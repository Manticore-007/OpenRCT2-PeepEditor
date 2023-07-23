import { staffType } from "../enums/staffTypes";

export let selectedPeep: Guest|Staff;
let selectedStaff: Staff;
export let selectedStaffType: number = -1;
export let selectedStaffCostume: number = -1;

export function setSelectedPeep(entity: Guest|Staff): void
{
    selectedPeep = entity;
    selectedStaff = <Staff>selectedPeep
    selectedStaffCostume = selectedStaff.costume;
    selectedStaffType = staffType.indexOf(selectedStaff.staffType);
}