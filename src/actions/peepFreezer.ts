import { debug } from "../helpers/logger";

export interface PeepFreezeArgs {
    id: number | null;
    pressed: boolean;
}

export function freezePeepExecute(args: PeepFreezeArgs): GameActionResult
{
    if (args.id === null){return{}};
    const entity = map.getEntity(args.id);
    const peep = <Guest|Staff>entity;
    if (args.pressed) {
        peep.energy = 0
        debug(`${peep.name} is frozen`);
    }
    else {
        peep.energy = 96;
        debug(`${peep.name} is unfrozen`)
    }
    return{}
}

export function freezePeepExecuteArgs(id: number | null, pressed: boolean): PeepFreezeArgs{
    return {"id": id, "pressed": pressed}
}