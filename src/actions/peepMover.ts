import { debug } from "../helpers/logger";

export interface PeepMoveArgs {
    id: number | null;
    axis: keyof CoordsXYZ;
    adjustment: number;
}

export function movePeepExecute(args: PeepMoveArgs): GameActionResult
{
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    const peep = <Guest|Staff>entity;
    peep[args.axis] += args.adjustment;
    debug(`Peep moved to "x: ${peep.x}", "y: ${peep.y}", "z: ${peep.z}"`);
    return {};
}

export function movePeepExecuteArgs(id: number | null, axis: keyof CoordsXYZ, adjustment: number): PeepMoveArgs{
    return {"id": id, "axis": axis, "adjustment": adjustment};
}