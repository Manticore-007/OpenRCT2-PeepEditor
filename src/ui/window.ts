import { debug } from "../helpers/logger";
import { isDevelopment, pluginVersion } from "../helpers/environment";
import {
    windowId,
    widgetLineHeight,
    margin,
    windowWidth,
    windowColour,
    buttonSize,
    groupboxName
} from "../helpers/windowProperties";
import { costume } from "../helpers/costumes";
import {  staffTypeLabel } from "../helpers/staffTypes";
import {  multiplierList, setMultiplier } from "../helpers/windowProperties";
import { errorMessage } from "../helpers/errorMessages";
import {propertiesWindowGuestWidgets} from "./properties_window/guest_widgets";
import {
    arjanIsErg,
    peepPropertiesWindow,
    selectedPeep,
    setSelectedPeep,
} from "./properties_window/window";
import {propertiesWindowStaffWidgets} from "./properties_window/staff_widgets";
import {removePeep, removePeepWindow} from "./remove_peep_window/window";

const staffPropertiesWindow = "staff-properties-window";
const guestPropertiesWindow = "guest-properties-window";

const labelPeepName: LabelDesc = {
	type: "label",
	name: "label-peep-name",
	x: groupboxName.x + margin,
	y: groupboxName.y + groupboxName.height / 2.5 + 2,
	height: widgetLineHeight,
	width: groupboxName.width - margin * 2 - widgetLineHeight,
	text: `{RED} No peep selected`,
};

const viewportPeep: ViewportDesc = {
	type: "viewport",
	name: "viewport-peep",
	x: margin,
	y: groupboxName.y + groupboxName.height + margin,
	height: buttonSize * 6,
	width: windowWidth - buttonSize - margin * 2,
};

const buttonPicker: ButtonDesc = {
	type: "button",
	name: "button-picker",
	x: viewportPeep.x +viewportPeep.width,
	y: viewportPeep.y,
	height: buttonSize,
	width: buttonSize,
	image: 29402, //pipette
	border: false,
	onClick: () => peepSelect(),
};

const buttonFreeze: ButtonDesc = {
	type: "button",
	name: "button-freeze",
	x: buttonPicker.x,
	y: buttonPicker.y + buttonPicker.height,
	height: buttonSize,
	width: buttonSize,
	image: 5182, //red-green flag
	border: false,
	isDisabled: true,
	onClick: () => freezePeep(selectedPeep),
};

const buttonName: ButtonDesc = {
	type: "button",
	name: "button-peep-name",
	x: buttonPicker.x,
	y: buttonFreeze.y + buttonFreeze.height,
	height: buttonSize,
	width: buttonSize,
	image: 5168, //name tag
	border: false,
	isDisabled: true,
	onClick: () => setPeepName(selectedPeep),
};

const buttonLocate: ButtonDesc = {
	type: "button",
	name: "button-locate",
	x: buttonPicker.x,
	y: buttonName.y + buttonName.height,
	height: buttonSize,
	width: buttonSize,
	image: 5167, //locate
	border: false,
	isDisabled: true,
	onClick: () => locatePeep(selectedPeep),
};

const buttonDelete: ButtonDesc = {
	type: "button",
	name: "button-delete",
	x: buttonPicker.x,
	y: buttonLocate.y + buttonLocate.height,
	height: buttonSize,
	width: buttonSize,
	image: 5165, //trashcan
	border: false,
	isDisabled: true,
	onClick: () => { debug("Button delete clicked"); removePeep(selectedPeep, afterRemovePeepWindowClose); },
};

const buttonAllGuests: ButtonDesc = {
	type: "button",
	name: "button-all-guests",
	x: buttonPicker.x,
	y: buttonDelete.y + buttonDelete.height,
	height: buttonSize,
	width: buttonSize,
	image: 5193, //group of guests
	border: false,
	isDisabled: false,
	onClick: () => { selectAllGuests() }
};

const labelAuthor: LabelDesc = {
	type: "label",
	name: "label-author",
	x: margin,
	y: viewportPeep.height +viewportPeep.y + margin / 2 + 1,
	height: widgetLineHeight,
	width: windowWidth - margin * 2,
	isDisabled: true,
	text: "Manticore-007",
	textAlign: "centred",
	tooltip: "Powered by Basssiiie",
};

const dropdownMultiplier: DropdownDesc = {
	type: "dropdown",
	name: "dropdown-multiplier",
	x: windowWidth - margin - 45,
	y: labelAuthor.y - 1,
	height: widgetLineHeight,
	width: 45,
	items: multiplierList,
	selectedIndex: 0,
	isDisabled: false,
	onChange: (number) => setMultiplier(number),
};

const buttonAbout: ButtonDesc = {
	type: "button",
	name: "button-about",
	x: margin + 1,
	y: labelAuthor.y,
	height: 10,
	width: 10,
	image: 5129, //small info
	border: false,
	isDisabled: false,
	onClick: () => {}
};

const widgetArray: Widget[] = [
	<ButtonWidget>buttonDelete,
	<ButtonWidget>buttonLocate,
	<ButtonWidget>buttonName,
];

let updateViewport: (IDisposable | null) = null;
let updateCoordinates: (IDisposable | null) = null;

export class PeepEditorWindow {

	/**
	 * Opens the window for the Peep Editor.
	 */

	open(): void {
		const window = ui.getWindow(windowId);
		const windowHeight = dropdownMultiplier.y + widgetLineHeight + margin / 2;
		if (window) {
			debug("The Peep Editor window is already shown.");
			window.bringToFront();
		}
		else {
			let windowTitle = `Peep Editor (v${pluginVersion})`;
			if (isDevelopment) {
				windowTitle += " [DEBUG]";
			}
			ui.openWindow({
				classification: windowId,
				title: windowTitle,
				x: ui.width / 8 - windowWidth / 8,
				y: ui.height / 8 - windowHeight / 8,
				width: windowWidth,
				height: windowHeight,
				colours: [windowColour, windowColour],
				widgets: [
					groupboxName, labelPeepName, viewportPeep, buttonPicker,
					buttonLocate, buttonFreeze, buttonDelete, buttonName, labelAuthor, dropdownMultiplier, buttonAllGuests, buttonAbout,
				],
				onClose: () => {
					if (ui.getWindow(peepPropertiesWindow)) {
						ui.getWindow(peepPropertiesWindow).close()
					};
					if (ui.getWindow(removePeepWindow)) {
						ui.getWindow(removePeepWindow).close()
					};
					ui.tool?.cancel();
					disableUpdate(updateViewport);
					disableUpdate(updateCoordinates);
				},
			});
			resetViewport();
		}
	};
};

function peepSelect()
{
	const window = ui.getWindow(windowId);
	const buttonPicker = window.findWidget<ButtonWidget>("button-picker");
	const buttonFreeze = window.findWidget<ButtonWidget>("button-freeze");
	const labelPeepName = window.findWidget<LabelWidget>("label-peep-name");

    if (buttonPicker.isPressed) {
        buttonPicker.isPressed = false;
        ui.tool?.cancel();
        return;
    }

    buttonPicker.isPressed = true;
    ui.activateTool({
        id: "peep-selector",
        cursor: "cross_hair",
        filter: ["entity"],
        onDown: e => {
            if (e.entityId !== undefined) {
                const entity = map.getEntity(e.entityId);
                const peep = <Staff | Guest>entity;
                setSelectedPeep(peep);
                if (!entity || (entity.type !== "staff" && entity.type !== "guest")) {
                    if (ui.getWindow(peepPropertiesWindow)) {
                        ui.getWindow(peepPropertiesWindow).close();
                    }
                    labelPeepName.text = `{RED} You must select a peep`;
                    errorMessage(entity.type);
                    widgetArray.forEach(widgetDisable);
                    buttonFreeze.isDisabled = true;
                    buttonFreeze.isPressed = false;
                    resetViewport();
                } else {
                    if (peep.peepType === "guest") {
                        buttonFreeze.isPressed = false
                        buttonFreeze.isDisabled = true;
                        peepProperties("guest", guestPropertiesWindow, staffPropertiesWindow);
                    } else {
                        peepProperties("staff", staffPropertiesWindow, guestPropertiesWindow);
                        peepCoordinates(peep);
                        getEnergy(peep);
                        getStaffType(<Staff>peep);
                        getCostume(<Staff>peep);
                        getColour(<Staff>peep);
                        buttonFreeze.isDisabled = false;
                    }
                    followPeep(peep);
                    ui.tool?.cancel();
                    widgetArray.forEach(widgetEnable);
                    buttonPicker.isPressed = false;
                    labelPeepName.text = `{WHITE}${peep.name}`;
                }
            }
        }
    });
}

function peepProperties(peepType: EntityType, thisWindow: string, otherWindow: string) {
	const thisPropertiesWindow = ui.getWindow(thisWindow);
	const peepEditorWindow = ui.getWindow(windowId);
	const otherPropertiesWindow = ui.getWindow(otherWindow);
	const buttonPicker = peepEditorWindow.findWidget<ButtonWidget>("button-picker");
	const buttonFreeze = peepEditorWindow.findWidget<ButtonWidget>("button-freeze");
	const buttonAllGuests = peepEditorWindow.findWidget<ButtonWidget>("button-all-guests");
	const labelPeepName = peepEditorWindow.findWidget<LabelWidget>("label-peep-name");
    arjanIsErg(thisWindow);
	if (thisPropertiesWindow) {
		debug(`${peepType} properties window is already shown`);
		thisPropertiesWindow.bringToFront();
	}
	else {
		if (otherPropertiesWindow) {
			otherPropertiesWindow.close();
		};
		ui.openWindow({
			classification: thisWindow,
			title: `${peepType.charAt(0).toUpperCase() + peepType.slice(1)} properties`,
			width: 200,
			height: peepEditorWindow.height,
			x: peepEditorWindow.x + peepEditorWindow.width,
			y: peepEditorWindow.y,
			colours: [windowColour, windowColour],
			widgets: widgetsProperties(peepType),
			onClose: () => {
				disableUpdate(updateCoordinates);
				resetViewport();
				widgetArray.forEach(widgetDisable);
				buttonFreeze.isDisabled = true;
				buttonFreeze.isPressed = false;
				buttonAllGuests.isPressed = false;
				buttonPicker.isDisabled = false;
				labelPeepName.text = `{RED} No peep selected`;
			},
		})
	}
};

function widgetsProperties(peepType: EntityType)
{
	if (peepType === "staff")
		return propertiesWindowStaffWidgets;
	else
		return propertiesWindowGuestWidgets;
}

function peepCoordinates(peepCoordinates: CoordsXYZ) {
	disableUpdate(updateCoordinates);
	const window = ui.getWindow(peepPropertiesWindow);
	updateCoordinates = context.subscribe("interval.tick", () => {
		window.findWidget<SpinnerWidget>("spinner-x-position").text = peepCoordinates.x.toString();
		window.findWidget<SpinnerWidget>("spinner-y-position").text = peepCoordinates.y.toString();
		window.findWidget<SpinnerWidget>("spinner-z-position").text = peepCoordinates.z.toString();
	});
};

function resetCoordinates() {
	disableUpdate(updateCoordinates)
	ui.getWindow(peepPropertiesWindow).findWidget<SpinnerWidget>("spinner-x-position").text = " ";
	ui.getWindow(peepPropertiesWindow).findWidget<SpinnerWidget>("spinner-y-position").text = " ";
	ui.getWindow(peepPropertiesWindow).findWidget<SpinnerWidget>("spinner-z-position").text = " ";
	debug("coordinates reset");
};

function resetViewport() {
    disableUpdate(updateViewport);
    ui.getWindow(windowId).findWidget<ViewportWidget>("viewport-peep").viewport.moveTo({ x: -9000, y: -9000, z: 9000 });
};

function followPeep(peep: Staff | Guest) {
	disableUpdate(updateViewport);
    updateViewport = context.subscribe("interval.tick", () => {
        ui.getWindow(windowId).findWidget<ViewportWidget>("viewport-peep").viewport.moveTo(peep);
    });
};



function afterRemovePeepWindowClose(peep: Staff | Guest): void
{
	if (peep.peepType === "staff"){
		resetCoordinates();
	}
	const window = ui.getWindow(windowId);
	const buttonFreeze = window.findWidget<ButtonWidget>("button-freeze");
	const LabelName = window.findWidget<LabelWidget>("label-peep-name");
	widgetArray.forEach(widgetDisable);
	buttonFreeze.isDisabled = true;
	buttonFreeze.isPressed = false;
	LabelName.text = `{RED} No peep selected`;
	ui.getWindow(peepPropertiesWindow).close();
	resetViewport();
	peep.remove();
}

function getStaffType(peep: Staff)
{
	const dropdown = ui.getWindow(peepPropertiesWindow).findWidget<DropdownWidget>("dropdown-staff-type");
	dropdown.text = staffTypeLabel[peep.staffType];
	debug(`stafftype is ${peep.staffType}`);
}

function getCostume(peep: Staff)
{
	const dropdown = ui.getWindow(peepPropertiesWindow).findWidget<DropdownWidget>("dropdown-costume");
	if (peep.costume > 251) {
		dropdown.text = costume[peep.costume - 208]
	}
	else {dropdown.text = costume[peep.costume]}
}

function getEnergy(peep: Staff | Guest)
{
	const button = ui.getWindow(windowId).findWidget<ButtonWidget>("button-freeze");
	if (peep.energy <= 1) {
			button.isPressed = true;
	}
	else {
		button.isPressed = false;
	}
}

function freezePeep(peep: Staff | Guest)
{
	if (peep.energy !== 0) {
		peep.energy = 0;
	}
	else {
		peep.energy = 90;
	}
	getEnergy(peep);
};

function locatePeep(peep: Staff | Guest) {
	ui.mainViewport.scrollTo(peep);
}

function widgetEnable(name: Widget) {
	const widget = ui.getWindow(windowId).findWidget<Widget>(name.name);
    widget.isDisabled = false;
}

function widgetDisable(name: Widget) {
	const widget = ui.getWindow(windowId).findWidget<Widget>(name.name);
		widget.isDisabled = true;
};

function disableUpdate(update: IDisposable | null) {
	update?.dispose();
	update = null;
};



function selectAllGuests() {
	const window = ui.getWindow(windowId);
	const PropertiesWindow = ui.getWindow(peepPropertiesWindow)
	const buttonAllGuests = window.findWidget<ButtonWidget>("button-all-guests");
	const buttonPicker = window.findWidget<ButtonWidget>("button-picker");
	const buttonLocate = window.findWidget<ButtonWidget>("button-locate");
	const buttonName = window.findWidget<ButtonWidget>("button-peep-name");
	const buttonDelete = window.findWidget<ButtonWidget>("button-delete");
	const labelPeepName = window.findWidget<LabelWidget>("label-peep-name");
	disableUpdate(updateCoordinates);
	disableUpdate(updateViewport);
	resetViewport();
	if (buttonAllGuests.isPressed === false){
		peepProperties("guest", guestPropertiesWindow, staffPropertiesWindow)
		buttonAllGuests.isPressed = true;
		buttonPicker.isDisabled = true;
		buttonLocate.isDisabled = true;
		buttonName.isDisabled = true;
		buttonDelete.isDisabled = false;
		labelPeepName.text = `{GREEN}All guests in the park`;
	}
	else {
		buttonAllGuests.isPressed = false;
		buttonPicker.isDisabled = false;
		PropertiesWindow.close();
	}
};

function getColour(staff: Staff)
{
	const window = ui.getWindow(staffPropertiesWindow);
	const widget = window.findWidget<ColourPickerWidget>("colourpicker-staff");
	widget.colour = staff.colour;
}

function setPeepName(peep: Staff | Guest) {
	const window = ui.getWindow(windowId);
	ui.showTextInput({
		title: peepTypeTitle(peep),
		description: peepTypeDescription(peep),
		initialValue: `${selectedPeep.name}`,
		callback: text => {
			selectedPeep.name = text
			window.findWidget<LabelWidget>("label-peep-name").text = `{WHITE}${text}`
		},
	})
};

function peepTypeTitle(peep: Staff | Guest): string {
	if (peep.peepType === "staff") { return "Staff member name" }
	else { return "Guest's name" }
};

function peepTypeDescription(peep: Staff | Guest): string {
	if (peep.peepType === "staff") { return "Enter new name for this member of staff:" }
	else { return "Enter name for this guest:" }
};

