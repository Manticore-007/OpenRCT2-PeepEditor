import { debug } from "../helpers/logger";

export interface StaffCostumeArgs {
    id: number | null;
    costume: StaffCostume;
}

export function staffCostumeExecute(args: StaffCostumeArgs): GameActionResult
{
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    const staff = <Staff>entity;
    staff.costume = args.costume;
    debug(`Staff costume set to "${args.costume}"`);
    return {};
}

export function staffCostumeExecuteArgs(id: number | null, costume: StaffCostume): StaffCostumeArgs{
    return {"id": id, "costume": costume};
}