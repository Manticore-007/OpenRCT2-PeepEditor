export interface PeepAnimationFrameArgs {
    id: number | null;
    value: number;
    frame: number;
}

export function animationFramePeepExecute(args: PeepAnimationFrameArgs): GameActionResult
{
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    if (entity === null) return {};
    const peep = <Guest|Staff>entity;
    if (peep.animationOffset === 0 && args.frame === -1){
        peep.animationOffset = peep.animationLength - 1;
    }
    else peep.animationOffset += args.frame;
    return {};
}

export function animationFramePeepExecuteArgs(id: number | null, value: number, frame: number): PeepAnimationFrameArgs{
    return {"id": id, "value": value, "frame": frame};
}