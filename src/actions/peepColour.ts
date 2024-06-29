import { debug } from "../helpers/logger";

export interface PeepColourArgs {
    id: number | null;
    colour: number;
    property?: GuestColours;
}

export function colourPeepExecute(args: PeepColourArgs): GameActionResult {
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    if (entity.type === "staff") {
        const staff = <Staff>entity;
        staff.colour = args.colour;
        debug(`Peep coloured to "${args.colour}"`);
    }
    else if (entity.type === "guest" && args.property) {
        const guest = <Guest>entity;
        guest[args.property] = args.colour;
    }
    return {};
}

export function colourPeepExecuteArgs(id: number | null, colour: number, property?: GuestColours): PeepColourArgs{
    return {"id": id, "colour": colour, "property": property};
}

type GuestColours = "tshirtColour" | "trousersColour" | "hatColour" | "balloonColour" | "umbrellaColour";