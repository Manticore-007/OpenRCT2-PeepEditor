export interface PeepRotateArgs {
    id: number | null;
}

export function peepRotateExecute(args: PeepRotateArgs): GameActionResult
{
    const numDirections = 4;
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    if (entity === null) return {};
    if (entity === null || entity.type !== "guest" && entity.type !== "staff" ) return {} ;
    const peep = <Guest|BaseStaff>entity;
    peep.direction = <Direction>((peep.direction + 1) % numDirections);
    return {};
}

export function peepRotateExecuteArgs(id: number | null): PeepRotateArgs{
    return {"id": id};
}