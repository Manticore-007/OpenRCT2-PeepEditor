import { debug } from "../helpers/logger";

export interface StaffOrdersArgs {
    id: number | null;
    checked: boolean
    staffOrders: number;
}

export function staffOrdersExecute(args: StaffOrdersArgs): GameActionResult
{
    if (args.id === null){return{}};
    const entity = map.getEntity(args.id);
    const staff = <Staff>entity;
    args.checked ? staff.orders += args.staffOrders : staff.orders -= args.staffOrders;
    debug(`Staff orders set to "${staff.orders}"`);
    return{}
}

export function staffOrdersExecuteArgs(id: number | null, checked: boolean, staffOrders: number): StaffOrdersArgs{
    return {"id": id, "checked": checked, "staffOrders": staffOrders}
}