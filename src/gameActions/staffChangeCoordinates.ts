import { multiplier } from "../helpers/windowProperties";
import { returnSuccess } from "./base";

export function changeStaffCoordinatesQuery(args: object): GameActionResult
{
    args;
    return returnSuccess();
}

export function changeStaffCoordinatesExecute(args: object): GameActionResult
{
    const entity = map.getEntity(args.staffId);
    const staff: Staff = <Staff>entity;
    const axis: keyof CoordsXYZ = args.axis;
    const operator: number = args.operator;    

    return changeSpinner(staff, axis, operator);
}

function changeSpinner(staff: Staff, axis: keyof CoordsXYZ, operator: number): GameActionResult
{
	staff[axis] += operator * multiplier;
    return returnSuccess();
}

export function changeStaffCoordinatesExecuteArgs(staff: Staff, axis: keyof CoordsXYZ, operator: number): object
{
    return { "staffId": staff.id, "axis": axis, "operator": operator };
}