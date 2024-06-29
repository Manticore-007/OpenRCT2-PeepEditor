import { debug } from "../helpers/logger";

export interface GuestThirstArgs {
    id: number | null;
    adjustment: number;
}

export function guestThirstExecute(args: GuestThirstArgs): GameActionResult
{
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    const guest = <Guest>entity;
    guest.thirst -= args.adjustment;
    debug(`Guest thirst set to "${guest.thirst}`);
    return {};
}

export function guestThirstExecuteArgs(id: number | null, adjustment: number): GuestThirstArgs{
    return {"id": id, "adjustment": adjustment};
}