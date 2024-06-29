import { debug } from "../helpers/logger";

export interface GuestItemRemoveArgs {
    id: number | null;
    item: GuestItemType;
}

export function guestItemRemoveExecute(args: GuestItemRemoveArgs): GameActionResult
{
    if (args.id === null) return{};
    const entity = map.getEntity(args.id);
    const guest = <Guest>entity;
    guest.removeItem({type: args.item});
    debug(`Guest item removed`);
    return {};
}

export function guestItemRemoveExecuteArgs(id: number | null, item: GuestItemType): GuestItemRemoveArgs{
    return {"id": id, "item": item};
}