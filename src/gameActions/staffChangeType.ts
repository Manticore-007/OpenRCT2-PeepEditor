import { staffType } from "../enums/staffTypes";
import { returnSuccess } from "./base";

export function changeStaffTypeQuery(args: object): GameActionResult
{
    args;
    return returnSuccess();
}

export function changeStaffTypeExecute(args: object): GameActionResult
{
    // @ts-ignore
    const entity = map.getEntity(args.staffId);
    const staff: Staff = <Staff>entity;
    // @ts-ignore
    const staffType = args.staffType;

    return setStaffType(staff, staffType);
}

function setStaffType(staff: Staff, number: number): GameActionResult {
	staff.staffType = staffType[number];
    return returnSuccess();
}

export function changeStaffTypeExecuteArgs(staff: Staff, staffType: number): object
{
    return { "staffId": staff.id, "staffType": staffType};
}