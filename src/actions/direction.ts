export interface DirectionArgs {
    id: number | null;
    direction: Direction
}

export function directionExecute(args: DirectionArgs): GameActionResult
{
    const screenOrientation = ui.mainViewport.rotation;
    if (args.id === null)
        {
            return {};
        }
    const entity = map.getEntity(args.id);
    if (entity === null) 
        {
            return {};
        }
    if (entity === null || entity.type !== "guest" && entity.type !== "staff" )
        {
            return {};
        }
    const peep = <Guest|BaseStaff>entity;
    peep.direction = <Direction>((args.direction as number + 4 - screenOrientation) % 4);
    return {};
}

export function directionExecuteArgs(id: number | null, direction: Direction): DirectionArgs{
    return {"id": id, "direction": direction};
}