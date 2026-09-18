import { debug } from "../helpers/logger";

export interface RemoveArgs {
    id: number | null;
}

export function removeExecute(args: RemoveArgs): GameActionResult
{
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    if (entity === null) return {};
    const peep = <Guest|BaseStaff>entity;
    debug(`${peep.name} is removed`);
    peep.remove();
    return {};
}

export function removeExecuteArgs(id: number | null): RemoveArgs{
    return {"id": id};
}