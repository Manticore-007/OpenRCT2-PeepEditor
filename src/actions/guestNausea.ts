import { debug } from "../helpers/logger";

export interface GuestNauseaArgs {
    id: number | null;
    adjustment: number;
}

export function guestNauseaExecute(args: GuestNauseaArgs): GameActionResult
{
    if (args.id === null){return{}};
    const entity = map.getEntity(args.id);
    const guest = <Guest>entity;
    guest.nausea += args.adjustment;
    debug(`Guest nausea set to "${guest.nausea}`);
    return{}
}

export function guestNauseaExecuteArgs(id: number | null, adjustment: number): GuestNauseaArgs{
    return {"id": id, "adjustment": adjustment}
}