import { debug } from "../helpers/logger";

export interface StaffTypeArgs {
    id: number | null;
    staffType: StaffType;
}

export function staffTypeExecute(args: StaffTypeArgs): GameActionResult
{
    if (args.id === null){return{}};
    const entity = map.getEntity(args.id);
    const staff = <Staff>entity;
    staff.staffType = args.staffType;
    debug(`Staff type set to "${args.staffType}"`);
    return{}
}

export function staffTypeExecuteArgs(id: number | null, staffType: StaffType): StaffTypeArgs{
    return {"id": id, "staffType": staffType}
}