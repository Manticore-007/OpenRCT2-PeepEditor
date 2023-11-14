import { SetStaffCoordinates, StaffCoordinates } from "../../lib/interfaces";
import { multiplier } from "../helpers/windowProperties";

export function changeStaffCoordinatesQuery(args: StaffCoordinates): GameActionResult
{
    args;
    return {};
}

export function changeStaffCoordinatesExecute(args: StaffCoordinates): GameActionResult
{
    if (args.staffId === null) {return {};}
    const entity = map.getEntity(args.staffId);
    const staff: Staff = <Staff>entity;
    const axis: keyof CoordsXYZ = args.axis;
    const operator: number = args.operator;    
    const _multiplier: number = args.multiplier;

    return changeSpinner(staff, axis, operator, _multiplier);
}

function changeSpinner(staff: Staff, axis: keyof CoordsXYZ, operator: number, _multiplier: number): GameActionResult
{
	staff[axis] += operator * _multiplier;
    return {};
}

export function changeStaffCoordinatesExecuteArgs(staff: Staff, axis: keyof CoordsXYZ, operator: number): StaffCoordinates
{
    return { "staffId": staff.id, "axis": axis, "operator": operator, "multiplier": multiplier };
}



//textbox input
export function setStaffCoordinatesQuery(args: SetStaffCoordinates): GameActionResult
{
    args;
    return {};
}

export function setStaffCoordinatesExecute(args: SetStaffCoordinates): GameActionResult
{
    if (args.staffId === null) {return {};}
    const entity = map.getEntity(args.staffId);
    const staff: Staff = <Staff>entity;
    const axis: keyof CoordsXYZ = args.axis;
    const text: string = args.text;    

    return setCoordinate(staff, axis, text);
}

function setCoordinate(staff: Staff, axis: keyof CoordsXYZ, text: string): GameActionResult
{
	staff[axis] = parseInt(text) || staff[axis];
    return {};
}

export function setStaffCoordinatesExecuteArgs(staff: Staff, axis: keyof CoordsXYZ, text: string): SetStaffCoordinates
{
    return { "staffId": staff.id, "axis": axis, "text": text };
}