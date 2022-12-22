import {multiplier} from "../../helpers/windowProperties";
import {debug} from "../../helpers/logger";
import {staffType, staffTypeList} from "../../helpers/staffTypes";

export let peepPropertiesWindow = "peep-properties-window";

export function arjanIsErg(newName: string): void
{
    peepPropertiesWindow = newName;
}

export let selectedPeep: Guest | Staff;

export function setSelectedPeepById(id: number): Guest | Staff | null
{
    const newEntity = map.getEntity(id);
    if (newEntity == null)
        return null;

    if (newEntity.type == "guest")
        selectedPeep = <Guest>newEntity;
    else if (newEntity.type == "staff")
        selectedPeep = <Staff>newEntity;
    else
        return null;

    return selectedPeep;
}

export function setSelectedPeep(peep: Guest | Staff): void
{
    selectedPeep = peep;
}
export function refreshSelectedPeep(): void
{
    if (selectedPeep.id == null)
        return;

    setSelectedPeepById(selectedPeep.id);
}

export function changeSpinner(spinner: SpinnerWidget, axis: keyof CoordsXYZ, operator: number): void
{
    selectedPeep[axis] = selectedPeep[axis] + operator * multiplier;
    updateSpinner(spinner, axis);
}

export function updateSpinner(spinner: SpinnerWidget, axis: keyof CoordsXYZ): void
{
    const spinnerWidget = ui.getWindow(peepPropertiesWindow).findWidget<SpinnerWidget>(spinner.name);
    spinnerWidget.text = selectedPeep[axis].toString();
    debug(`${[axis]}: ${selectedPeep[axis]}`);
}

export function setStaffType(number: number): void
{
    const staff = <Staff>selectedPeep;
    staff.staffType = staffType[number];
    debug(`Stafftype is set to ${staffTypeList[number]}`);
}
