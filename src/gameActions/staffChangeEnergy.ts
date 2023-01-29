import { StaffEnergy } from "../../lib/interfaces";
import { multiplier } from "../helpers/windowProperties";

export function changeStaffEnergyQuery(args: StaffEnergy): GameActionResult
{
    args;
    return {};
}

export function changeStaffEnergyExecute(args: StaffEnergy): GameActionResult
{
    if (args.staffId === null) {return {};}
    const entity = map.getEntity(args.staffId);
    const staff: Staff = <Staff>entity;
    const operator: number = args.operator;    

    return changeSpinner(staff, operator);
}

function changeSpinner(staff: Staff, operator: number): GameActionResult
{
    if (staff.energy ===0) {return {};}
    else if ((staff.energy >= 2 && operator === -1) || (staff.energy <= 254 && operator === +1) || staff.energy === 0)
    {
        staff.energy += operator * multiplier;
    }
    return {};
}

export function changeStaffEnergyExecuteArgs(staff: Staff, operator: number): StaffEnergy
{
    return { "staffId": staff.id, "operator": operator };
}