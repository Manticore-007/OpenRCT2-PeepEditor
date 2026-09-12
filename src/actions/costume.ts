export interface CostumeArgs {
    id: number | null;
    costume: StaffCostume;
}

export function costumeExecute(args: CostumeArgs): GameActionResult
{
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    if (entity === null || entity.type === "guest") return {};
    const staff = entity as BaseStaff;
    if (staff.staffType !== "entertainer") return {}
    staff.costume = args.costume;
    return {};
}

export function costumeExecuteArgs(id: number | null, costume: StaffCostume): CostumeArgs{
    return {"id": id, "costume": costume};
}