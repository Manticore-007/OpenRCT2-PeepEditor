export interface AnimationFrameArgs {
    id: number | null;
    value: number;
    frame: number;
}

export function animationFrameExecute(args: AnimationFrameArgs): GameActionResult
{
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    if (entity === null) return {};
    const peep = <Guest|BaseStaff>entity;
    if (peep.animationOffset === 0 && args.frame === -1){
        peep.animationOffset = peep.animationLength - 1;
    }
    else peep.animationOffset += args.frame;
    return {};
}

export function animationFrameExecuteArgs(id: number | null, value: number, frame: number): AnimationFrameArgs{
    return {"id": id, "value": value, "frame": frame};
}