import { GuestColours } from "../../lib/interfaces";

export type GuestColoursOptions = "tshirtColour" | "trousersColour" | "balloonColour" | "umbrellaColour" | "hatColour";

export function setGuestColourQuery(args: GuestColours): GameActionResult
{
    args;
    return {};
}

export function setGuestColourExecute(args: GuestColours): GameActionResult
{
    if (args.guestId === null) {return {};}
    const entity = map.getEntity(args.guestId);
    const guest: Guest = <Guest>entity;
    const property: GuestColoursOptions = args.property;
    const colour: number = args.colour;

    return setGuestColour(guest, property, colour);
}

function setGuestColour(guest: Guest, property: GuestColoursOptions, colour: number): GameActionResult
{
    guest[property] = colour;
    return {};
}

export function setGuestColourExecuteArgs(guest: Guest, property: "tshirtColour" | "trousersColour" | "hatColour" | "balloonColour" | "umbrellaColour", colour: number): GuestColours
{
    return {"guestId": guest.id, "property": property, "colour": colour};
}