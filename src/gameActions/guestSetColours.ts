import { returnSuccess } from "./base";

export type GuestColoursOptions = "tshirtColour" | "trousersColour" | "balloonColour" | "umbrellaColour" | "hatColour";

export function setGuestColourQuery(args: object): GameActionResult
{
    args;
    return returnSuccess();
}

export function setGuestColourExecute(args: object): GameActionResult
{
    const entity = map.getEntity(args.guestId);
    const guest: Guest = <Guest>entity;
    const property: GuestColoursOptions = args.property;
    const colour: number = args.colour;

    return setGuestColour(guest, property, colour);
}

function setGuestColour(guest: Guest, property: GuestColoursOptions, colour: number): GameActionResult
{
    guest[property] = colour;
    return returnSuccess();
}

export function setGuestColourExecuteArgs(guest: Guest, property: keyof Guest, colour: number): object
{
    return {"guestId": guest.id, "property": property, "colour": colour};
}