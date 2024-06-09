import { debug } from "../helpers/logger";

export interface GuestMassArgs {
    id: number | null;
    adjustment: number;
}

export function guestMassExecute(args: GuestMassArgs): GameActionResult
{
    if (args.id === null){return{}};
    const entity = map.getEntity(args.id);
    const guest = <Guest>entity;
    guest.mass += args.adjustment;
    debug(`Guest mass set to "${guest.mass}`);
    return{}
}

export function guestMassExecuteArgs(id: number | null, adjustment: number): GuestMassArgs{
    return {"id": id, "adjustment": adjustment}
}