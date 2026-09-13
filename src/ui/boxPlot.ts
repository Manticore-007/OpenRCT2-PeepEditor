import {
    Bindable,
    Colour,
    ElementParams,
    FlexiblePosition,
    Store,
    WidgetCreator,
    graphics,
    read,
} from "openrct2-flexui"

interface BoxChartParams extends ElementParams {
    q1: Store<number>
    q3: Store<number>
    median: Store<number>
    whiskerLow: Store<number>
    whiskerHigh: Store<number>
    minValue: Bindable<number>
    maxValue: Bindable<number>
    background?: Bindable<Colour>
    stroke?: Bindable<number>
}

function boxPlot(
    params: BoxChartParams & FlexiblePosition
): WidgetCreator<FlexiblePosition> {
    const colour = {
        main: 18,
        shadow: 15,
        box: 1
    }
    return graphics({
        width: params.width ?? "1w",
        height: params.height ?? 14,
        visibility: params.visibility || "visible",
        disabled: params.disabled,
        padding: { top: 2 },
        onDraw: (g) => {
            const q1 = read(params.q1)
            const q3 = read(params.q3)
            const median = read(params.median)
            const whiskerLow = read(params.whiskerLow)
            const whiskerHigh = read(params.whiskerHigh)

            // Dynamic bounds on both ends
            const minValue = read(params.minValue)
            const maxValue = read(params.maxValue)
            const span = maxValue - minValue;
            const safeSpan = span === 0 ? 1 : span; // Prevent division by zero

            // Helper to normalize any value into a 0 to 1 scale based on dynamic bounds
            const normalize = (val: number) => (val - minValue) / safeSpan;

            const width = g.width
            const hOffset = 1
            const height = g.height
            const vOffset = g.height * 0.025 // offset the graph towards the top to make space for labels

            // Draw the well containing the box chart.
            g.colour = read(params.background)
            g.well(0, 0, g.width, g.height)

            g.stroke = colour.shadow

            // Draw the low whisker shadow.
            g.line(
                width * normalize(whiskerLow) + hOffset + 2,
                1 + 1,
                width * normalize(whiskerLow) + hOffset + 2,
                height - 1 + 1
            )

            // Draw the shadow line from the low whisker to the first quartile.
            g.line(
                width * normalize(whiskerLow) + hOffset + 2,
                height / 2 - vOffset + 1,
                width * normalize(q1) + hOffset + 1,
                height / 2 - vOffset + 1
            )

            // Draw the shadow line from the third quartile to the high whisker.
            g.line(
                width * normalize(q3) + hOffset - 1,
                height / 2 - vOffset + 1,
                width * normalize(whiskerHigh) + hOffset - 2,
                height / 2 - vOffset + 1
            )

            // Draw the high whisker shadow.
            g.line(
                width * normalize(whiskerHigh) + hOffset - 2,
                1 + 1,
                width * normalize(whiskerHigh) + hOffset - 2,
                height - 1 + 1
            )

            g.stroke = read(params.stroke) || colour.main

            // Draw the low whisker.
            g.line(
                width * normalize(whiskerLow) + hOffset + 1,
                1,
                width * normalize(whiskerLow) + hOffset + 1,
                height - 2
            )

            // Draw the line from the low whisker to the first quartile.
            g.line(
                width * normalize(whiskerLow) + hOffset + 1,
                height / 2 - vOffset,
                width * normalize(q1) + hOffset,
                height / 2 - vOffset
            )
            g.colour = colour.box;

            // Draw the box.
            g.box(
                width * normalize(q1) + hOffset,
                1,
                width * ((q3 - q1) / safeSpan),
                height - 2
            )

            g.stroke = read(params.stroke) || colour.shadow

            // Draw the median.
            g.line(
                width * normalize(median) + hOffset,
                1,
                width * normalize(median) + hOffset,
                height - 2
            )

            g.stroke = colour.main

            // Draw the median shadow.
            g.line(
                width * normalize(median) + hOffset + 1,
                1,
                width * normalize(median) + hOffset + 1,
                height - 2
            )
            g.stroke = read(params.stroke) || colour.main

            // Draw the line from the third quartile to the high whisker.
            g.line(
                width * normalize(q3) + hOffset - 1,
                height / 2 - vOffset,
                width * normalize(whiskerHigh) + hOffset - 3,
                height / 2 - vOffset
            )

            // Draw the high whisker.
            g.line(
                width * normalize(whiskerHigh) + hOffset - 3,
                1,
                width * normalize(whiskerHigh) + hOffset - 3,
                height - 2
            )
        }
    })
}

export { type BoxChartParams, boxPlot }

export interface BoxPlotStats {
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
    outliers: number[];
}

/**
 * Calculates box plot statistics (Five-Number Summary + Outliers using IQR method)
 * @param data Array of numbers
 */
export interface BoxPlotStats {
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
    average: number;
    outliers: number[];
}

const STAT_KEYS = ["happiness", "energy", "hunger", "thirst", "nausea", "toilet", "mass"] as const;
type StatKey = typeof STAT_KEYS[number];

export function getAllStatistics(data: Guest[]): Record<StatKey, BoxPlotStats> {
    const n = data.length;
    if (n === 0) {
        throw new Error("Dataset cannot be empty");
    }

    // 1. Initialize TypedArrays and sums for all metrics simultaneously
    const storage = {} as Record<StatKey, { values: Float64Array; sum: number }>;
    for (const key of STAT_KEYS) {
        storage[key] = { values: new Float64Array(n), sum: 0 };
    }

    // 2. Single pass over the entire guest array (O(n) instead of O(7n))
    for (let i = 0; i < n; i++) {
        const guest = data[i];
        for (const key of STAT_KEYS) {
            let val = guest[key];
            if (key === "hunger" || key === "thirst") {
                val = 255 - val;
            }
            storage[key].values[i] = val;
            storage[key].sum += val;
        }
    }

    const result = {} as Record<StatKey, BoxPlotStats>;

    // 3. Compute statistics for each metric
    for (const key of STAT_KEYS) {
        const { values, sum } = storage[key];
        const average = sum / n;

        values.sort();

        const getMedianRange = (start: number, end: number): number => {
            const length = end - start;
            if (length === 0) return 0;
            const mid = start + Math.floor(length / 2);
            if (length % 2 === 0) {
                return (values[mid - 1] + values[mid]) / 2;
            }
            return values[mid];
        };

        const median = getMedianRange(0, n);
        const midIndex = Math.floor(n / 2);
        const q1 = getMedianRange(0, midIndex);
        const q3 = getMedianRange(n % 2 === 0 ? midIndex : midIndex + 1, n);

        const iqr = q3 - q1;
        const lowerFence = q1 - 1.5 * iqr;
        const upperFence = q3 + 1.5 * iqr;

        let firstValid = 0;
        while (firstValid < n && values[firstValid] < lowerFence) {
            firstValid++;
        }

        let lastValid = n - 1;
        while (lastValid >= 0 && values[lastValid] > upperFence) {
            lastValid--;
        }

        const min = firstValid <= lastValid ? values[firstValid] : values[0];
        const max = firstValid <= lastValid ? values[lastValid] : values[n - 1];

        const outliers: number[] = [];
        for (let i = 0; i < firstValid; i++) {
            outliers.push(values[i]);
        }
        for (let i = lastValid + 1; i < n; i++) {
            outliers.push(values[i]);
        }

        result[key] = {
            min,
            q1,
            median,
            q3,
            max,
            average,
            outliers
        };
    }

    return result;
}