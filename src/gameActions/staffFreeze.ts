import { PeepId } from "../../lib/interfaces";

export function freezeStaffQuery(args: PeepId): GameActionResult
{
    args;
    return {};
}

export function freezeStaffExecute(args: PeepId): GameActionResult
{
    if (args.peepId === null) {return {};}
    const entity = map.getEntity(args.peepId);
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
    return {};
}

export function freezeStaffExecuteArgs(staff: Staff): PeepId
{
    return { "peepId": staff.id};
}