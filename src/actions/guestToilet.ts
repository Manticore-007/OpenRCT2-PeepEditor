import { debug } from "../helpers/logger";

export interface GuestToiletArgs {
    id: number | null;
    adjustment: number;
}

export function guestToiletExecute(args: GuestToiletArgs): GameActionResult
{
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    const guest = <Guest>entity;
    guest.toilet += args.adjustment;
    debug(`Guest toilet set to "${guest.toilet}`);
    return {};
}

export function guestToiletExecuteArgs(id: number | null, adjustment: number): GuestToiletArgs{
    return {"id": id, "adjustment": adjustment};
}