import { debug } from "../helpers/logger";

export interface PeepColourArgs {
    id: number | null;
    colour: number;
}

export function colourPeepExecute(args: PeepColourArgs): GameActionResult
{
    if (args.id === null){return{}};
    const entity = map.getEntity(args.id);
    const staff = <Staff>entity;
    staff.colour = args.colour;
    debug(`Peep coloured to "${args.colour}"`);
    return{}
}

export function colourPeepExecuteArgs(id: number | null, colour: number): PeepColourArgs{
    return {"id": id, "colour": colour}
}