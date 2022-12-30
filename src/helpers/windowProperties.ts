import { debug } from "./logger";
import { colour } from "../enums/colours";

export const multiplierList = ["1x", "10x", "100x"];
export let multiplier = 1;
export const windowId = "peep-editor-window";
export const widgetLineHeight = 14;
export const buttonSize = 24;
export const toolbarHeight = 10;
export const margin = 5;
export const windowWidth = 260;
export const windowColour = colour.DarkYellow;
export let selectedPeep: Guest | Staff;

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

export function setSelectedPeep(peep: Guest | Staff): void
{
    selectedPeep = peep;
}

export const groupboxName: GroupBoxDesc = {
	type: "groupbox",
	name: "groupbox-name",
	text: "Name",
	x: margin,
	y: margin + toolbarHeight,
	height: widgetLineHeight * 2.5,
	width: windowWidth - margin * 2,
};

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