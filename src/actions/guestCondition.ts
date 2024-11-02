import { debug } from "../helpers/logger";

type GuestCondition = "happiness" | "energy" | "hunger" | "thirst" | "nausea" | "toilet" | "mass"

export interface GuestConditionArgs {
    id: number | null;
    adjustment: number;
    condition:  GuestCondition;
}

export function guestConditionExecute(args: GuestConditionArgs): GameActionResult
{
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    const guest = <Guest>entity;
    if (args.condition === "hunger" || args.condition === "thirst")
    guest[args.condition] -= args.adjustment;
    else guest[args.condition] += args.adjustment;
    debug(`Guest ${args.condition} set to "${guest[args.condition]}`);
    return {};
}

export function guestConditionExecuteArgs(id: number | null, adjustment: number, condition: GuestCondition): GuestConditionArgs{
    return {"id": id, "adjustment": adjustment, "condition": condition};
}