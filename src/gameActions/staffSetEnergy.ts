import { SetStaffEnergy } from "../../lib/interfaces";

export function setStaffEnergyQuery(args: SetStaffEnergy): GameActionResult
{
    args;
    return {};
}

export function setStaffEnergyExecute(args: SetStaffEnergy): GameActionResult
{
    if (args.staffId === null) {return {};}
    const entity = map.getEntity(args.staffId);
    const staff: Staff = <Staff>entity;
    const speed: number = args.speed;    

    return setEnergy(staff, speed);
}

function setEnergy(staff: Staff, speed: number): GameActionResult
{
    if (speed > 0 && speed < 256) {
        staff.energy = speed || staff.energy;
    }
    return {};
}

export function setStaffEnergyExecuteArgs(staff: Staff, speed: number): SetStaffEnergy
{
    return { "staffId": staff.id, "speed": speed };
}