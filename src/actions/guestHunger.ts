import { debug } from "../helpers/logger";

export interface GuestHungerArgs {
    id: number | null;
    adjustment: number;
}

export function guestHungerExecute(args: GuestHungerArgs): GameActionResult
{
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    const guest = <Guest>entity;
    guest.hunger -= args.adjustment;
    debug(`Guest hunger set to "${guest.hunger}`);
    return {};
}

export function guestHungerExecuteArgs(id: number | null, adjustment: number): GuestHungerArgs{
    return {"id": id, "adjustment": adjustment};
}