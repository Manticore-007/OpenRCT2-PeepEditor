import { returnSuccess } from "./base";
import * as button from "../helpers/buttonControl"
import { getEnergy } from "../helpers/staffGetters";

export function freezeStaffQuery(args: object): GameActionResult
{
    args;
    return returnSuccess();
}

export function freezeStaffExecute(args: object): GameActionResult
{
    //@ts-ignore
    const entity = map.getEntity(args.staffId);
    const staff: Staff = <Staff>entity;

    return freezeStaff(staff);
}

function freezeStaff(staff: Staff): GameActionResult
{
	if (staff.energy !== 0) {
		staff.energy = 0;
        button.pressed("button-freeze");
	}
	else {
		staff.energy = 90;
        button.unpressed("button-freeze");
	}
	getEnergy(staff);
    return returnSuccess();
}

export function freezeStaffExecuteArgs(staff: Staff): object
{
    return { "staffId": staff.id};
}