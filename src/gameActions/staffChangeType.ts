import { StaffTypeSet } from "../../lib/interfaces";
import { staffType } from "../enums/staffTypes";

export function changeStaffTypeQuery(args: StaffTypeSet): GameActionResult
{
    args;
    return {};
}

export function changeStaffTypeExecute(args: StaffTypeSet): GameActionResult
{
    if (args.staffId === null) {return {};}
    const entity = map.getEntity(args.staffId);
    const staff: Staff = <Staff>entity;
    const staffType = args.staffType;

    return setStaffType(staff, staffType);
}

function setStaffType(staff: Staff, number: number): GameActionResult {
	staff.staffType = staffType[number];
    return {};
}

export function changeStaffTypeExecuteArgs(staff: Staff, staffType: number): StaffTypeSet
{
    return { "staffId": staff.id, "staffType": staffType};
}