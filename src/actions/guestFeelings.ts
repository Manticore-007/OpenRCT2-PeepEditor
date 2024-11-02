import { debug } from "../helpers/logger";

export interface GuestFeelingArgs {
    id: number | null;
    adjustment: number;
    feeling: "happiness" | "energy" | "hunger" | "thirst" | "nausea" | "toilet" | "mass" ;
}

export function guestFeelingExecute(args: GuestFeelingArgs): GameActionResult
{
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    const guest = <Guest>entity;
    if (args.feeling === "hunger" || args.feeling === "thirst")
    guest[args.feeling] -= args.adjustment;
    else guest[args.feeling] += args.adjustment;
    debug(`Guest ${args.feeling} set to "${guest[args.feeling]}`);
    return {};
}

export function guestFeelingExecuteArgs(id: number | null, adjustment: number, feeling: "happiness" | "energy" | "hunger" | "thirst" | "nausea" | "toilet" | "mass"): GuestFeelingArgs{
    return {"id": id, "adjustment": adjustment, "feeling": feeling};
}