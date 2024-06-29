export interface PeepAnimationFrameArgs {
    id: number | null;
    value: number;
    frame: number;
}

export function animationFramePeepExecute(args: PeepAnimationFrameArgs): GameActionResult
{
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    const peep = <Guest|Staff>entity;
    peep.animationOffset += args.frame;
    return {};
}

export function animationFramePeepExecuteArgs(id: number | null, value: number, frame: number): PeepAnimationFrameArgs{
    return {"id": id, "value": value, "frame": frame};
}