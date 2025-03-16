export interface PeepMoveArgs {
    id: number | null;
    axis: keyof CoordsXYZ;
    adjustment: number;
}

export function movePeepExecute(args: PeepMoveArgs): GameActionResult
{
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    if (entity === null) return {};
    if (entity === null || entity.type !== "guest" && entity.type !== "staff" ) return {} ;
    const peep = <Guest|Staff>entity;
    peep[args.axis] += args.adjustment;
    return {};
}

export function movePeepExecuteArgs(id: number | null, axis: keyof CoordsXYZ, adjustment: number): PeepMoveArgs{
    return {"id": id, "axis": axis, "adjustment": adjustment};
}