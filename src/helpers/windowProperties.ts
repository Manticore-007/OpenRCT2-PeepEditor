import { debug } from "./logger";
import { colour } from "../enums/colours";
import { isDevelopment, pluginVersion } from "./environment";

export const windowId = "peep-editor-window";

export const windowWidth = 260;
export const windowColour = colour["Dark yellow"];
export const widgetLineHeight = 14;
export const btnSize = 24;
export const toolbarHeight = 10;
export const margin = 5;

export const multiplierList = ["1x", "10x", "100x"];
export let multiplier = 1;

export function setMultiplier(number: number): void
{
	if (number === 0) {
		multiplier = 1;
	}
	if (number === 1) {
		multiplier = 10;
	}
	if (number === 2) {
		multiplier = 100;
	}
	debug(`Multiplier set to ${multiplierList[number]}`);
}

export let peepPropertiesWindow = "peep-properties-window";

export function setPeepPropertiesWindow(window: string): void
{
    peepPropertiesWindow = window;
}

export function resetCoordinates(): void
{
	ui.getWindow(peepPropertiesWindow).findWidget<SpinnerWidget>("spinner-x-position").text = " ";
	ui.getWindow(peepPropertiesWindow).findWidget<SpinnerWidget>("spinner-y-position").text = " ";
	ui.getWindow(peepPropertiesWindow).findWidget<SpinnerWidget>("spinner-z-position").text = " ";
	debug("coordinates reset");
}

export function versionString(): string
{
    if (isDevelopment) {
        return `{WHITE}${pluginVersion} [DEBUG]`;
    }
    else return `{WHITE}${pluginVersion}`;
}