import { Colour, compute, store } from "openrct2-flexui";

const title = store<string>("Peep Editor");

export const isSticky = store<boolean>(context.sharedStorage.get("pe.sticky", true));
export const isPinned = store<boolean>(context.sharedStorage.get("pe.favourite", false));
//export const isPinned = store<boolean>(context.sharedStorage.get("pe.favourite", false));
export const theme = store<Theme>(context.sharedStorage.get("pe.theme", "rct1"));
export const menuLabel = compute(isPinned, f => (f) ? `- ${title.get()}` : title.get())

export function setColour(key: string, colour: Colour): void
{
    return context.sharedStorage.set(key, colour);
}

export function getColour(key: string, colour: Colour): Colour
{
    return context.sharedStorage.get(key, colour);
}

export function setSticky(isSticky: boolean): void
{
    return context.sharedStorage.set("pe.sticky", isSticky);
}

export function getSticky(isSticky: boolean): boolean
{
    return context.sharedStorage.get("pe.sticky", isSticky);
}

export type Theme = "rct1" | "rct2";

export function setTheme(theme: Theme): void
{
    return context.sharedStorage.set("pe.theme", theme);
}

export function getTheme(theme: Theme): Theme {
    return context.sharedStorage.get("pe.theme", theme);
}

export function setMenuItem(isFavourite: boolean): void
{
    return context.sharedStorage.set("pe.favourite", isFavourite);
}

export function getMenuItem(isFavourite: boolean): boolean
{
    return context.sharedStorage.get("pe.favourite", isFavourite);
}

export function initSettings(): void
{
getColour("pe.main.primary", Colour.AquaDark);
getColour("pe.main.secondary", Colour.LightBrown);
getColour("pe.side.primary", Colour.AquaDark);
getColour("pe.side.secondary", Colour.LightBrown);
}