import { debug } from "../helpers/logger";

export interface PeepRemoveArgs {
    id: number | null;
}

export function removePeepExecute(args: PeepRemoveArgs): GameActionResult
{
    if (args.id === null){return{}};
    const entity = map.getEntity(args.id);
    const peep = <Guest|Staff>entity;
    debug(`${peep.name} is removed`);
    peep.remove();
    return{}
}

export function removePeepExecuteArgs(id: number | null): PeepRemoveArgs{
    return {"id": id}
}