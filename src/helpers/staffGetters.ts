import { colourList } from "../enums/colours";
import { costume } from "../enums/costumes";
import { staffTypeLabel } from "../enums/staffTypes";
import { sideWindow } from "../ui/sideWindow";
import { selectedStaffCostume, selectedStaffType } from "./selectedPeep";
import { disableUpdateCoordinates, disableUpdateEnergy, disableUpdateStaffColour, updateCoordinates, updateEnergy, updateStaffColour } from "./updates";
import { windowId } from "./windowProperties";

export function getFreeze(staff: Staff): void
{
	const button = ui.getWindow(windowId).findWidget<ButtonWidget>("button-freeze");
	if (staff.energy <= 1) {
			button.isPressed = true;
	}
	else {
		button.isPressed = false;
	}
}

export function getColourStaff(staff: Staff): void
{
	const widget = sideWindow.findWidget<ColourPickerWidget>("colourpicker-staff");
	widget.colour = staff.colour;
}

export function getCostume(staff: Staff): void
{
	const dropdown = sideWindow.findWidget<DropdownWidget>("dropdown-costume");
	if (staff.staffType === "entertainer") {
		dropdown.selectedIndex = selectedStaffCostume;
		if (staff.costume > 251) {
			dropdown.text = costume[staff.costume - 208];
		}
		else dropdown.text = costume[staff.costume];
	}
	if (staff.staffType === "mechanic") {
		dropdown.selectedIndex = costume.Mechanic;
	}
	if (staff.staffType === "handyman") {
		dropdown.selectedIndex = costume.Handyman;
	}
	if (staff.staffType === "security") {
		dropdown.selectedIndex = costume["Security guard"];
	}
}

export function getStaffType(peep: Staff): void
{
	const dropdown = sideWindow.findWidget<DropdownWidget>("dropdown-staff-type");
	dropdown.text = staffTypeLabel[peep.staffType];
	dropdown.selectedIndex = selectedStaffType;
}

export function getCoordinates(staff: Staff): void
{
	disableUpdateCoordinates();
	updateCoordinates(context.subscribe("interval.tick", () => {
		sideWindow.findWidget<SpinnerWidget>("spinner-x-position").text = staff.x.toString();
		sideWindow.findWidget<SpinnerWidget>("spinner-y-position").text = staff.y.toString();
		sideWindow.findWidget<SpinnerWidget>("spinner-z-position").text = staff.z.toString();
	}));
}

export function getLblColourStaff(staff: Staff): void
{
	disableUpdateStaffColour();
	const widget = sideWindow.findWidget<LabelWidget>("textbox-staff-colour");
	updateStaffColour(context.subscribe("interval.tick", () => {
		widget.text = `${colourList[staff.colour]}`;
	}));
}

export function getEnergy(staff: Staff): void
{
	disableUpdateEnergy();
	updateEnergy(context.subscribe("interval.tick", () => {
		sideWindow.findWidget<SpinnerWidget>("spinner-energy").text = staff.energy.toString();
	}));
}