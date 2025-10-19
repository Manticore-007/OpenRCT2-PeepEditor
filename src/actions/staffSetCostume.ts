export interface StaffCostumeArgs {
    id: number | null;
    costume: StaffCostume;
}

export function staffCostumeExecute(args: StaffCostumeArgs): GameActionResult
{
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    if (entity === null) return {};
    const staff = <BaseStaff>entity;
    staff.costume = args.costume;
    return {};
}

export function staffCostumeExecuteArgs(id: number | null, costume: StaffCostume): StaffCostumeArgs{
    return {"id": id, "costume": costume};
}