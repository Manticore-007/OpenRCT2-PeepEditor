export interface PeepAnimationArgs {
    id: number | null;
    animation: GuestAnimation | StaffAnimation;
}

export function animationPeepExecute(args: PeepAnimationArgs): GameActionResult
{
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    if (entity === null) return {};
    const peep = <Guest|BaseStaff>entity;
    peep.animation = args.animation;
    return {};
}

export function animationPeepExecuteArgs(id: number | null, animation: GuestAnimation | StaffAnimation): PeepAnimationArgs{
    return {"id": id, "animation": animation};
}