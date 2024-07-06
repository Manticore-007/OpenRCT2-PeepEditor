
export interface GuestFlagsArgs {
    id: number | null;
    checked: boolean;
    flag: PeepFlags;
}

export function guestFlagsExecute(args: GuestFlagsArgs): GameActionResult
{
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    if (entity === null || entity.type !== "guest" && entity.type !== "staff" ) return {} ;
    const peep = <Guest|Staff>entity;
    peep.setFlag(args.flag , args.checked);
    return {};
}

export function guestFlagsExecuteArgs(id: number | null, checked: boolean, flag: PeepFlags): GuestFlagsArgs{
    return {"id": id, "checked": checked, "flag": flag};
}