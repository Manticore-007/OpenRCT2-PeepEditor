export interface PeepSpeedArgs {
    id: number | null;
    adjustment: number;
}

export function peepSpeedExecute(args: PeepSpeedArgs): GameActionResult
{
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    const peep = <Guest|Staff>entity;
    peep.energy += args.adjustment;
    return {};
}

export function peepSpeedExecuteArgs(id: number | null, adjustment: number): PeepSpeedArgs{
    return {"id": id, "adjustment": adjustment};
}