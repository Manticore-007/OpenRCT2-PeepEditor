export type GuestKey = "happiness" | "energy" | "hunger" | "thirst" | "nausea" | "toilet" | "mass";

export interface GuestKeysArgs {
    id: number | null;
    key:  GuestKey;
    adjustment: number;
}

export function guestKeysExecute(args: GuestKeysArgs): GameActionResult
{
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    if (entity === null) return {};
    const guest = <Guest>entity;
    if (args.key === "hunger" || args.key === "thirst")
    guest[args.key] -= args.adjustment;
    else guest[args.key] += args.adjustment;
    return {};
}

export function guestKeysExecuteArgs(id: number | null, key: GuestKey, adjustment: number): GuestKeysArgs{
    return {"id": id, "key": key, "adjustment": adjustment};
}