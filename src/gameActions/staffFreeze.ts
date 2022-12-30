import { windowId } from "../helpers/windowProperties";
import { returnSuccess } from "./base";

export function freezeStaffQuery(args: object): GameActionResult
{
    args;
    return returnSuccess();
}

export function freezeStaffExecute(args: object): GameActionResult
{
    const entity = map.getEntity(args.staffId);
    const staff: Staff = <Staff>entity;

    return freezeStaff(staff);
}

function freezeStaff(staff: Staff): GameActionResult
{
	if (staff.energy !== 0) {
		staff.energy = 0;
	}
	else {
		staff.energy = 90;
	}
	getEnergy(staff);
    return returnSuccess();
}

export function freezeStaffExecuteArgs(staff: Staff): object
{
    return { "staffId": staff.id};
}

export function getEnergy(staff: Staff): void
{
	const button = ui.getWindow(windowId).findWidget<ButtonWidget>("button-freeze");
	if (staff.energy <= 1) {
			button.isPressed = true;
	}
	else {
		button.isPressed = false;
	}
}