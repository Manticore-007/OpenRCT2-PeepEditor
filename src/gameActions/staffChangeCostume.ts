import { StaffCostumeSet } from "../../lib/interfaces";

export function changeStaffCostumeQuery(args: StaffCostumeSet): GameActionResult
{
    args;
    return {};
}

export function changeStaffCostumeExecute(args: StaffCostumeSet): GameActionResult
{
    if (args.staffId === null) {return {};}
    const entity = map.getEntity(args.staffId);
    const staff: Staff = <Staff>entity;
    const costume = args.costume;

    return setStaffCostume(staff, costume);
}

function setStaffCostume(staff: Staff, costume: number): GameActionResult {
	if (costume > 43) {
		costume += 208;
		staff.costume = costume;
	}
	else {staff.costume = costume;}
    return {};
}

export function changeStaffCostumeExecuteArgs(staff: Staff, costume: number): StaffCostumeSet
{
    return { "staffId": staff.id, "costume": costume};
}