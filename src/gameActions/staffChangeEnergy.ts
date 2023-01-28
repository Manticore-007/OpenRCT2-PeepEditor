import { multiplier } from "../helpers/windowProperties";
import { returnSuccess } from "./base";

export function changeStaffEnergyQuery(args: object): GameActionResult
{
    args;
    return returnSuccess();
}

export function changeStaffEnergyExecute(args: object): GameActionResult
{
    //@ts-ignore
    const entity = map.getEntity(args.staffId);
    const staff: Staff = <Staff>entity;
    //@ts-ignore
    const operator: number = args.operator;    

    return changeSpinner(staff, operator);
}

function changeSpinner(staff: Staff, operator: number): GameActionResult
{
    if (staff.energy ===0) {return returnSuccess();}
    else if ((staff.energy >= 2 && operator === -1) || (staff.energy <= 254 && operator === +1) || staff.energy === 0)
    {
    staff.energy += operator * multiplier;
    }
    return returnSuccess();
}

export function changeStaffEnergyExecuteArgs(staff: Staff, operator: number): object
{
    return { "staffId": staff.id, "operator": operator };
}