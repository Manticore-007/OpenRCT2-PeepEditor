export interface AnimationArgs {
    id: number | null;
    index: number;
}

export function animationExecute(args: AnimationArgs): GameActionResult
{
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    if (entity === null) return {};
    const peep = <Guest|BaseStaff>entity;
    peep.animation = peep.availableAnimations[args.index];
    return {};
}

export function animationExecuteArgs(id: number | null, index: number): AnimationArgs{
    return {"id": id, "index": index};
}