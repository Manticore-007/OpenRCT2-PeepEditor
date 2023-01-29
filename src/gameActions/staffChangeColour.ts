import { StaffColour } from "../../lib/interfaces";

export function changeStaffColourQuery(args: StaffColour): GameActionResult
{
    args;
    return {};
}

export function changeStaffColourExecute(args: StaffColour): GameActionResult
{
    if (args.staffId === null) {return {};}
    const entity = map.getEntity(args.staffId);
    const staff: Staff = <Staff>entity;
    const colour = args.colour;

    return setStaffColour(staff, colour);
}

function setStaffColour(staff: Staff, colour: number): GameActionResult {
	staff.colour = colour;
    return {};
}

export function changeStaffColourExecuteArgs(staff: Staff, colour: number): StaffColour
{
    return { "staffId": staff.id, "colour": colour};
}