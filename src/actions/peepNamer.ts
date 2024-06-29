import { debug } from "../helpers/logger";

export interface PeepNameArgs {
    id: number | null;
    name: string;
}

export function namePeepExecute(args: PeepNameArgs): GameActionResult
{
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    const peep = <Guest|Staff>entity;
    peep.name = args.name;
    debug(`Peep renamed to "${args.name}"`);
    return {};
}

export function namePeepExecuteArgs(id: number | null, name: string): PeepNameArgs{
    return {"id": id, "name": name};
}