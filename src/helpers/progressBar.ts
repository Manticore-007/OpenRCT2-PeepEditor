import {
  Bindable,
  Colour,
  ElementParams,
  FlexiblePosition,
  WidgetCreator,
  graphics,
  isStore,
  store
} from "openrct2-flexui";
import { getColour } from "./settings";


export const ProgressBarColour = {
  bar: {
    safe: store<Colour>(getColour("pe.bar.safe", Colour.BrightGreen)),
    warning: store<Colour>(getColour("pe.bar.warning", Colour.Yellow)),
    danger: store<Colour>(getColour("pe.bar.danger", Colour.BrightRed)),
  },
  foreground: store<Colour>(Colour.DarkYellow),
  background: store<Colour>(getColour("pe.bar.background", Colour.DarkYellow)),
};


interface ProgressBarParams extends ElementParams {
  /**
   * The background colour of the progress bar.
   */
  background: Bindable<Colour>

  /**
   * The foreground colour of the progress bar.
   */
  foreground: Bindable<Colour>

  /**
   * The percentage of the progress bar that is filled.
   */
  percentFilled: Bindable<number>

  /**
   * When true, full bar is positive.
   * When false empty bar is positive.
   */
  isPositive: Bindable<boolean>
}

function progressBar(
  params: ProgressBarParams & FlexiblePosition
): WidgetCreator<FlexiblePosition> {
  return graphics({
    width: params.width ?? "1w",
    height: params.height ?? 12,
    padding: { top: 2 },
    visibility: params.visibility || "visible",
    disabled: params.disabled,
    onDraw: (g) => {
      const background: Colour = isStore(params.background)
        ? params.background.get()
        : params.background;
      const percentFilled = isStore(params.percentFilled)
        ? params.percentFilled.get()
        : params.percentFilled;
      const disabled = isStore(params.disabled)
        ? params.disabled.get()
        : params.disabled;
        const isPositive = isStore(params.isPositive)
          ? params.isPositive.get()
          : params.isPositive;

      g.colour = background;
      g.well(0, 0, 88, 11);
      if (!disabled) {
        g.colour = colourPogressBar(isPositive, percentFilled);
        g.box(1, 1, 88 * percentFilled, 11 - 2);
      } else {
        g.box(1, 1, 88, 11 - 2);
      }
    }
  });
}

export { type ProgressBarParams, progressBar };

// Define a function named percentage that calculates the percentage of a given number.
export function percentage(fraction: number, total: number): number {
  // Multiply num by per divided by 100 to find the percentage.
  return fraction / total;
}

function colourPogressBar(positive: boolean, percentage: number): number {
  if (positive) {
    if (percentage <= 0.5) return ProgressBarColour.bar.danger.get();
    else if (percentage > 0.5 && percentage < 0.7) return ProgressBarColour.bar.warning.get();
    else if (percentage >= 0.7) return ProgressBarColour.bar.safe.get();
  }
  else {
    if (percentage <= 0.5) return ProgressBarColour.bar.safe.get();
    else if (percentage > 0.5 && percentage < 0.7) return ProgressBarColour.bar.warning.get();
    else if (percentage >= 0.7) return ProgressBarColour.bar.danger.get();
  }
  return Colour.DarkYellow;
}