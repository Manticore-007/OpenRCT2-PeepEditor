import { Colour } from "openrct2-flexui";

export function setColour(string: string, colour: Colour): void {
    return context.sharedStorage.set(string, colour);
}

export function getColour(string: string, colour: Colour): Colour {
    return context.sharedStorage.get(string, colour);
}

export function setSticky(isSticky: boolean): void {
    return context.sharedStorage.set("pe.sticky", isSticky);
}

export function getSticky(isSticky: boolean): boolean {
    return context.sharedStorage.get("pe.sticky", isSticky);
}

export type Theme = "rct1" | "rct2";

export function setTheme(theme: Theme): void {
    return context.sharedStorage.set("pe.theme", theme);
}
export function getTheme(theme: Theme): Theme {
    return context.sharedStorage.get("pe.theme", theme);
}