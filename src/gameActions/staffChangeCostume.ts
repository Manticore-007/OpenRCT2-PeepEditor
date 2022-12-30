import { returnSuccess } from "./base";

export function changeStaffCostumeQuery(args: object): GameActionResult
{
    args;
    return returnSuccess();
}

export function changeStaffCostumeExecute(args: object): GameActionResult
{
    // @ts-ignore
    const entity = map.getEntity(args.staffId);
    const staff: Staff = <Staff>entity;
    // @ts-ignore
    const costume = args.costume;

    return setStaffCostume(staff, costume);
}

function setStaffCostume(staff: Staff, costume: number): GameActionResult {
	if (costume > 43) {
		costume += 208
		staff.costume = costume
	}
	else {staff.costume = costume}
    return returnSuccess();
}

export function changeStaffCostumeExecuteArgs(staff: Staff, costume: number): object
{
    return { "staffId": staff.id, "costume": costume};
}