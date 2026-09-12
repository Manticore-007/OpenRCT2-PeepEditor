export interface GiveItemArgs {
    id: number | null;
    item: GuestItem;
}

export function giveItemExecute(args: GiveItemArgs): GameActionResult
{
    if (args.id === null) return{};
    const entity = map.getEntity(args.id);
    if (entity === null) return {};
    const guest = <Guest>entity;
    guest.giveItem(args.item);
    return {};
}

export function giveItemExecuteArgs(id: number | null, item: GuestItem): GiveItemArgs{
    return {"id": id, "item": item};
}