import { debug } from "../helpers/logger";

export interface PeepSpeedArgs {
    id: number | null;
    adjustment: number;
}

export function speedPeepExecute(args: PeepSpeedArgs): GameActionResult
{
    if (args.id === null){return{}};
    const entity = map.getEntity(args.id);
    const peep = <Guest|Staff>entity;
    peep.energy += args.adjustment;
    debug(`Peep speed set to "${peep.energy}`);
    return{}
}

export function speedPeepExecuteArgs(id: number | null, adjustment: number): PeepSpeedArgs{
    return {"id": id, "adjustment": adjustment}
}