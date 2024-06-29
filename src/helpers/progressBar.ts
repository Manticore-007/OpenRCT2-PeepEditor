import {
    Bindable,
    Colour,
    ElementParams,
    FlexiblePosition,
    WidgetCreator,
    graphics,
    isStore
  } from "openrct2-flexui";
  
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
  }
  
  function progressBar(
    params: ProgressBarParams & FlexiblePosition
  ): WidgetCreator<FlexiblePosition> {
    return graphics({
      width: params.width ?? "1w",
      height: params.height ?? 10,
      padding: {top: 2},
      visibility: params.visibility || "visible",
      disabled: params.disabled,
      onDraw: (g) => {
        const background: Colour = isStore(params.background)
          ? params.background.get()
          : params.background;
        const foreground: Colour = isStore(params.foreground)
          ? params.foreground.get()
          : params.foreground;
        const percentFilled = isStore(params.percentFilled)
          ? params.percentFilled.get()
          : params.percentFilled;
        const disabled = isStore(params.disabled)
          ? params.disabled.get()
          : params.disabled;
  
        g.colour = background;
        g.well(0, 0, 94, 10);
        if (!disabled) {
          g.colour = foreground;
          g.box(1, 1, 94 * percentFilled - 2, 10 - 2);
        } else {
          g.box(1, 1, 94 - 2, 10 - 2);
        }
      }
    });
  }
  
  export { type ProgressBarParams, progressBar };

  // Define a function named percentage that calculates the percentage of a given number.
export function percentage(fraction: number, total: number): number
{
  // Multiply num by per divided by 100 to find the percentage.
  return fraction/total;
}

export function colourPogressBar(positive: boolean, percentage: number): number
{
    if (positive){
        if (percentage <= 0.5) return Colour.BrightRed;
        else if (percentage > 0.5 && percentage < 0.7) return Colour.Yellow;
        else if (percentage >= 0.7) return Colour.BrightGreen;
    }
    else {
        if (percentage <= 0.5) return Colour.BrightGreen;
        else if (percentage > 0.5 && percentage < 0.7) return Colour.Yellow;
        else if (percentage >= 0.7) return Colour.BrightRed;
    }
    return Colour.DarkYellow;
}