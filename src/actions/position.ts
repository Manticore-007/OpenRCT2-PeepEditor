export interface PositionArgs {
    id: number | null;
    axis: keyof CoordsXYZ;
    adjustment: number;
}

export function positionExecute(args: PositionArgs): GameActionResult
{
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    if (entity === null) return {};
    if (entity === null || entity.type !== "guest" && entity.type !== "staff" ) return {} ;
    const peep = <Guest|BaseStaff>entity;
    peep[args.axis] += args.adjustment;
    return {};
}

export function positionExecuteArgs(id: number | null, axis: keyof CoordsXYZ, adjustment: number): PositionArgs{
    return {"id": id, "axis": axis, "adjustment": adjustment};
}