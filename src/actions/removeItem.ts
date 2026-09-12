import { debug } from "../helpers/logger";

export interface ItemRemoveArgs {
    id: number | null;
    item: GuestItemType;
}

export function itemRemoveExecute(args: ItemRemoveArgs): GameActionResult
{
    if (args.id === null) return{};
    const entity = map.getEntity(args.id);
    if (entity === null) return {};
    const guest = <Guest>entity;
    guest.removeItem({type: args.item});
    debug(`Guest item removed`);
    return {};
}

export function itemRemoveExecuteArgs(id: number | null, item: GuestItemType): ItemRemoveArgs{
    return {"id": id, "item": item};
}