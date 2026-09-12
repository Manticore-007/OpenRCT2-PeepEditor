import { debug } from "../helpers/logger";

export interface RenameArgs {
    id: number | null;
    name: string;
}

export function renameExecute(args: RenameArgs): GameActionResult
{
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    if (entity === null) return {};
    const peep = <Guest|BaseStaff>entity;
    peep.name = args.name;
    debug(`Peep renamed to "${args.name}"`);
    return {};
}

export function renameExecuteArgs(id: number | null, name: string): RenameArgs{
    return {"id": id, "name": name};
}