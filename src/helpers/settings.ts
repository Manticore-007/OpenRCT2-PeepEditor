import { Colour } from "openrct2-flexui";

export function setColour(string: string, colour: Colour) {
    return context.sharedStorage.set(string, colour);
}

export function getColour(string: string, colour: Colour) {
    return context.sharedStorage.get(string, colour);
}