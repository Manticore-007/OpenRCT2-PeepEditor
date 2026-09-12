import { GuestColours } from "../helpers/colours";
import { debug } from "../helpers/logger";

export interface ColourArgs {
    id: number | null;
    colour: number;
    property?: GuestColours;
}

export function colourExecute(args: ColourArgs): GameActionResult {
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    if (entity === null) return {};
    if (entity.type === "staff") {
        const staff = <BaseStaff>entity;
        staff.colour = args.colour;
        debug(`Peep coloured to "${args.colour}"`);
    }
    else if (entity.type === "guest" && args.property) {
        const guest = <Guest>entity;
        guest[args.property] = args.colour;
    }
    return {};
}

export function colourExecuteArgs(id: number | null, colour: number, property?: GuestColours): ColourArgs{
    return {"id": id, "colour": colour, "property": property};
}
