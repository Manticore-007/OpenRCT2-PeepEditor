export interface StaffTypeArgs {
    id: number | null;
    staffType: StaffType;
}

export function staffTypeExecute(args: StaffTypeArgs): GameActionResult
{
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    if (entity === null) return {};
    const staff = <BaseStaff>entity;
    staff.staffType = args.staffType;
    return {};
}

export function staffTypeExecuteArgs(id: number | null, staffType: StaffType): StaffTypeArgs{
    return {"id": id, "staffType": staffType};
}