import { debug } from "../../helpers/logger";
import { windowId, widgetLineHeight, windowWidth, windowColour, margin, toolbarHeight, buttonSize, selectedPeep, setSelectedPeep, groupboxName, peepPropertiesWindow, setPeepPropertiesWindow } from "../../helpers/windowProperties";
import { disableUpdateViewport, followPeep, resetViewport } from "../../helpers/resetViewport";
import { setPeepNameExecuteArgs } from "../../gameActions/peepSetName";
import { freezeStaffExecuteArgs, getEnergy } from "../../gameActions/staffFreeze";
import { staffWidgets } from "../propertiesWindow/staffWidgets";
import { drawTest, guestWidgets } from "../propertiesWindow/guestWidgets";
import { isDevelopment, pluginVersion } from "../../helpers/environment";
import { customImageFor } from "../../helpers/customImages";
import { staffTypeLabel } from "../../enums/staffTypes";
import { costume } from "../../enums/costumes";
import { errorMessage } from "../../enums/errorMessages";
import { removePeep, removePeepWindow } from "../../gameActions/peepRemove";

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
	onClick: () => context.executeAction("pe_freezestaff", freezeStaffExecuteArgs(<Staff>selectedPeep)),
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
	onClick: () => context.executeAction("pe_peepname", setPeepNameExecuteArgs(selectedPeep)),
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
	onClick: () => ui.mainViewport.scrollTo(selectedPeep),
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
	onClick: () => removePeep(selectedPeep),
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
	y: viewportPeep.height +viewportPeep.y + margin / 2,
	height: widgetLineHeight,
	width: windowWidth - margin * 2,
	isDisabled: true,
	text: "Manticore-007 © 2022-2023",
	textAlign: "centred",
};

export const buttonAbout: ButtonDesc = {
	type: "button",
	name: "button-about",
	x: margin + 1,
	y: labelAuthor.y,
	height: 10,
	width: 10,
	image: 5129, //small info
	border: false,
	isDisabled: false,	
	onClick: () => openAboutWindow(),
};

export const widgetsMain: WidgetDesc[] =
[
    groupboxName, labelPeepName, viewportPeep, buttonPicker, buttonFreeze, buttonName, buttonLocate, buttonDelete, buttonAllGuests,
    labelAuthor, buttonAbout
];

export const widgetArray: Widget[] = [
	<ButtonWidget>buttonDelete,
	<ButtonWidget>buttonLocate,
	<ButtonWidget>buttonName,
];

export class PeepEditorWindow
{

	/**
	 * Opens the window for the Peep Editor.
	 */

	open(): void {
		const window = ui.getWindow(windowId);
		const windowHeight = buttonAbout.y + widgetLineHeight;
		if (window) {
			debug("The Peep Editor window is already shown.");
			window.bringToFront();
		}
		else {
			ui.openWindow({
				classification: windowId,
				title: "Peep Editor",
				x: ui.width / 8 - windowWidth / 8,
				y: ui.height / 8 - windowHeight / 8,
				width: windowWidth,
				height: windowHeight,
				colours: [windowColour, windowColour],
				widgets: widgetsMain,
				onClose: () => {
					if (ui.getWindow(peepPropertiesWindow)) {
						ui.getWindow(peepPropertiesWindow).close()
					};
					if (ui.getWindow(removePeepWindow)) {
						ui.getWindow(removePeepWindow).close()
					};
					if (ui.getWindow(aboutWindow)) {
						ui.getWindow(aboutWindow).close()
					};
					ui.tool?.cancel();
					disableUpdateViewport();
					disableUpdateCoordinates();
				},
			});
			resetViewport();
		}
	};
}

let updateCoordinates: (IDisposable | null) = null;
export const staffPropertiesWindow = "staff-properties-window";
export const guestPropertiesWindow = "guest-properties-window";
export const aboutWindow = "about-window"

export function peepProperties(peepType: EntityType, thisWindow: string, otherWindow: string)
{
	const thisPropertiesWindow = ui.getWindow(thisWindow);
	const peepEditorWindow = ui.getWindow(windowId);
	const otherPropertiesWindow = ui.getWindow(otherWindow);
	const buttonPicker = peepEditorWindow.findWidget<ButtonWidget>("button-picker");
	const buttonFreeze = peepEditorWindow.findWidget<ButtonWidget>("button-freeze");
	const buttonAllGuests = peepEditorWindow.findWidget<ButtonWidget>("button-all-guests");
	const labelPeepName = peepEditorWindow.findWidget<LabelWidget>("label-peep-name");
	setPeepPropertiesWindow(thisWindow);
	if (thisPropertiesWindow) {
		debug(`${peepType} properties window is already shown`);
		thisPropertiesWindow.bringToFront();
	}
	else {
		if (otherPropertiesWindow) {
			otherPropertiesWindow.close();
		};
		if (ui.getWindow(aboutWindow)) {
			ui.getWindow(aboutWindow).close();
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
				disableUpdateCoordinates();
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
}

export function openAboutWindow(): void
{
	const window = ui.getWindow(aboutWindow);
	const propertiesWindow = ui.getWindow(peepPropertiesWindow)
	const mainWindow = ui.getWindow(windowId);
	if (window) {
		debug("About window is already shown");
		window.bringToFront();
	}
	else {
		if (propertiesWindow) { propertiesWindow.close() };
		ui.openWindow({
			classification: aboutWindow,
			title: "About",
			width: 200,
			height: mainWindow.height,
			x: mainWindow.x + mainWindow.width,
			y: mainWindow.y,
			colours: [windowColour, windowColour],
			widgets: [
				<GroupBoxDesc>{
					type: "groupbox",
					name: "groupbox-about-version",
					x: margin,
					y: margin + toolbarHeight,
					height: widgetLineHeight * 2.5,
					width: 200 - margin * 2,
				},
				<LabelDesc> {
					type: "label",
					name: "label-about-version",
					x: margin,
					y: margin + toolbarHeight + widgetLineHeight * 2 / 2.5 + 3,
					height: widgetLineHeight,
					width: 200 - margin * 2,
					text: versionString(),
					textAlign: "centred",
				},
				<LabelDesc> {
					type: "label",
					name: "label-peep-editor",
					x: margin,
					y: groupboxName.y + groupboxName.height + margin * 2 + 5,
					height: widgetLineHeight,
					width: 200 - margin * 2,
					text: "Peep Editor, a plugin for OpenRCT2",
					textAlign: "centred",
				},
				<CustomDesc> {
					type: "custom",
					name: "custom-widget-manticore",
					x: margin * 3,
					y: 95,
					width: 128,
					height: 128,
					onDraw: function (g) {drawTest(g, customImageFor("manticore"))},
				},
				<LabelDesc> {
					type: "label",
					name: "label-special-thanks-people",
					x: 85,
					y: 121,
					height: 200,
					width: 100 - margin * 2,
					text: "Special thanks:\n Basssiiie\n ltsSmitty\n Gymnasiast\n Sadret\n Enox",
					textAlign: "centred",
				},
				<LabelDesc> {
					type: "label",
					name: "label-github-page",
					x: margin,
					y: 185,
					height: widgetLineHeight,
					width: 200 - margin * 2,
					text: "https://github.com/Manticore-007/OpenRCT2-PeepEditor",
					textAlign: "centred",
				},
			],
			onClose: () => { },
		})
	}
}

function versionString(): string
{
    if (isDevelopment) {
        return `Version ${pluginVersion} [DEBUG]`
    }
    else {`Version ${pluginVersion}`}
return "{RED} undefined"
}

function widgetsProperties(peepType: EntityType): WidgetBaseDesc[]
{
	if (peepType === "staff")
		return staffWidgets;
	else
		return guestWidgets;
}

export function disableUpdateCoordinates()
{
	updateCoordinates?.dispose();
	updateCoordinates = null;
}

export function peepCoordinates(peepCoordinates: CoordsXYZ)
{
	disableUpdateCoordinates();
	const window = ui.getWindow(peepPropertiesWindow);
	updateCoordinates = context.subscribe("interval.tick", () => {
		window.findWidget<SpinnerWidget>("spinner-x-position").text = peepCoordinates.x.toString();
		window.findWidget<SpinnerWidget>("spinner-y-position").text = peepCoordinates.y.toString();
		window.findWidget<SpinnerWidget>("spinner-z-position").text = peepCoordinates.z.toString();
	});
}

export function widgetEnable(name: Widget)
{
	const widget = ui.getWindow(windowId).findWidget<Widget>(name.name);
		widget.isDisabled = false;
}

export function widgetDisable(name: Widget)
{
	const widget = ui.getWindow(windowId).findWidget<Widget>(name.name);
		widget.isDisabled = true;
}

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
				}
				else {
					if (peep.peepType === "guest") {
						buttonFreeze.isPressed = false
						buttonFreeze.isDisabled = true;
						peepProperties("guest", guestPropertiesWindow, staffPropertiesWindow);
						getColourGuest(<Guest>peep);
					}
					else {
						peepProperties("staff", staffPropertiesWindow, guestPropertiesWindow);
						peepCoordinates(peep);
						getEnergy(<Staff>peep);
						getStaffType(<Staff>peep)
						getCostume(<Staff>peep);
						getColourStaff(<Staff>peep);
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

function getColourGuest(guest: Guest): void
{
	const window = ui.getWindow(guestPropertiesWindow);
	window.findWidget<ColourPickerWidget>("colourpicker-tshirt").colour = guest.tshirtColour;
	window.findWidget<ColourPickerWidget>("colourpicker-trousers").colour = guest.trousersColour;
	window.findWidget<ColourPickerWidget>("colourpicker-balloon").colour = guest.balloonColour;
	window.findWidget<ColourPickerWidget>("colourpicker-hat").colour = guest.hatColour;
	window.findWidget<ColourPickerWidget>("colourpicker-umbrella").colour = guest.umbrellaColour
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

function getColourStaff(peep: Staff): void
{
	const window = ui.getWindow(staffPropertiesWindow);
	const widget = window.findWidget<ColourPickerWidget>("colourpicker-staff");
	const staff = <Staff>peep;
	widget.colour = staff.colour;
}

function selectAllGuests()
{
	const window = ui.getWindow(windowId);
	const PropertiesWindow = ui.getWindow(peepPropertiesWindow)
	const buttonAllGuests = window.findWidget<ButtonWidget>("button-all-guests");
	const buttonPicker = window.findWidget<ButtonWidget>("button-picker");
	const buttonLocate = window.findWidget<ButtonWidget>("button-locate");
	const buttonName = window.findWidget<ButtonWidget>("button-peep-name");
	const buttonDelete = window.findWidget<ButtonWidget>("button-delete");
	const labelPeepName = window.findWidget<LabelWidget>("label-peep-name");
	disableUpdateCoordinates();
	disableUpdateViewport();
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
}