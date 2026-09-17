import { debug } from "../helpers/logger";

export interface OrdersArgs {
    id: number | null;
    checked: boolean
    staffOrders: number;
}

export function ordersExecute(args: OrdersArgs): GameActionResult
{
    if (args.id === null) return {};
    const entity = map.getEntity(args.id);
    if (entity === null) return {};
    const staff = <BaseStaff>entity;
    args.checked ? staff.orders += args.staffOrders : staff.orders -= args.staffOrders;
    debug(`Staff orders set to "${staff.orders}"`);
    return {};
}

export function ordersExecuteArgs(id: number | null, checked: boolean, staffOrders: number): OrdersArgs{
    return {"id": id, "checked": checked, "staffOrders": staffOrders};
}