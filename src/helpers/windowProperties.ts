import { debug } from "../helpers/logger";
import { colour } from "./colours";

export const multiplierList = ["1x", "10x", "100x"];
export let multiplier = 1;
export const windowId = "peep-editor-window";
export const widgetLineHeight = 14;
export const buttonSize = 24;
export const toolbarHeight = 10;
export const margin = 5;
export const windowWidth = 260;
export const windowColour = colour.DarkYellow;

export function setMultiplier(number: number) {
	if (number === 0) {
		multiplier = 1
	}
	if (number === 1) {
		multiplier = 10
	}
	if (number === 2) {
		multiplier = 100
	}
	debug(`Multiplier set to ${multiplierList[number]}`)
};


export const groupboxName: GroupBoxDesc = {
    type: "groupbox",
    name: "groupbox-name",
    text: "Name",
    x: margin,
    y: margin + toolbarHeight,
    height: widgetLineHeight * 3,
    width: windowWidth - margin * 2,
};
