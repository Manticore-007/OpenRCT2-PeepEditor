import { debug } from "../helpers/logger";

export interface GuestHappinessArgs {
    id: number | null;
    adjustment: number;
}

export function guestHappinessExecute(args: GuestHappinessArgs): GameActionResult
{
    if (args.id === null){return{}};
    const entity = map.getEntity(args.id);
    const guest = <Guest>entity;
    guest.happiness += args.adjustment;
    debug(`Guest happiness set to "${guest.happiness}`);
    return{}
}

export function guestHappinessExecuteArgs(id: number | null, adjustment: number): GuestHappinessArgs{
    return {"id": id, "adjustment": adjustment}
}