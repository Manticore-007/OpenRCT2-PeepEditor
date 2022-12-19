import { debug } from "../helpers/logger";
import { isDevelopment, pluginVersion } from "../helpers/environment";
import { windowId, widgetLineHeight, margin, windowWidth, windowColour, toolbarHeight, buttonSize } from "../helpers/windowProperties";
import { costume, costumeList } from "../helpers/costumes";
import { staffTypeList, staffTypeLabel, staffType } from "../helpers/staffTypes";
import { colour } from "../helpers/colours";
import { multiplier, multiplierList, setMultiplier } from "../helpers/windowProperties";
import { errorMessage } from "../helpers/errorMessages";

const removePeepWindow = "remove-peep-window";
let peepPropertiesWindow = "peep-properties-window";
const staffPropertiesWindow = "staff-properties-window";
const guestPropertiesWindow = "guest-properties-window";
const peepNameWindow = "peep-name-window";

let peepId: Guest | Staff;

const groupboxName: GroupBoxDesc = {
	type: "groupbox",
	name: "groupbox-name",
	text: "Name",
	x: margin,
	y: margin + toolbarHeight,
	height: widgetLineHeight * 3,
	width: windowWidth - margin * 2,
};

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
	onClick: () => freezePeep(peepId),
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
	onClick: () => setPeepName(peepId),
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
	onClick: () => locatePeep(peepId),
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
	onClick: () => { debug("Button delete clicked"), removePeep(peepId) },
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

function peepSelect() {
	const window = ui.getWindow(windowId);
	const buttonPicker = window.findWidget<ButtonWidget>("button-picker");
	const buttonFreeze = window.findWidget<ButtonWidget>("button-freeze");
	const labelPeepName = window.findWidget<LabelWidget>("label-peep-name");
		if (buttonPicker.isPressed !== false) {
			buttonPicker.isPressed = false;
			ui.tool?.cancel();
		}
		else {
			buttonPicker.isPressed = true
			ui.activateTool({
				id: "peep-selector",
				cursor: "cross_hair",
				filter: ["entity"],
				onDown: e => {
					if (e.entityId !== undefined) {
						const entity = map.getEntity(e.entityId);
						const peep = <Staff | Guest>entity;
						peepId = peep;
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
							if (peep.peepType === "guest"){
								buttonFreeze.isPressed = false
								buttonFreeze.isDisabled = true;
								peepProperties("guest", guestPropertiesWindow, staffPropertiesWindow);
							}
							else {
								peepProperties("staff", staffPropertiesWindow, guestPropertiesWindow);
								peepCoordinates(peep);
								getEnergy(peep);
								getStaffType(<Staff>peep)
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
	};

function peepProperties(peepType: EntityType, thisWindow: string, otherWindow: string) {
	const thisPropertiesWindow = ui.getWindow(thisWindow);
	const peepEditorWindow = ui.getWindow(windowId);
	const otherPropertiesWindow = ui.getWindow(otherWindow);
	const buttonPicker = peepEditorWindow.findWidget<ButtonWidget>("button-picker");
	const buttonFreeze = peepEditorWindow.findWidget<ButtonWidget>("button-freeze");
	const buttonAllGuests = peepEditorWindow.findWidget<ButtonWidget>("button-all-guests");
	const labelPeepName = peepEditorWindow.findWidget<LabelWidget>("label-peep-name");
	peepPropertiesWindow = thisWindow;
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

function widgetsProperties(peepType: EntityType) {
	if (peepType === "staff") {
		return [
			<GroupBoxDesc>{
				type: "groupbox",
				name: "groupbox-uniform-colour",
				text: "Colour",
				x: margin,
				y: margin + toolbarHeight,
				height: widgetLineHeight * 3,
				width: 200 - margin * 2,
			},
			<ColourPickerDesc> {
				type: "colourpicker",
				name: "colourpicker-staff",
				x: 200 - margin - widgetLineHeight * 2,
				y: margin + toolbarHeight + widgetLineHeight * 3 / 2.5 + 2,
				height: widgetLineHeight,
				width: widgetLineHeight,
				colour: windowColour,
				onChange: (number) => setColour(number),
			},
			<GroupBoxDesc>{
				type: "groupbox",
				name: "groupbox-appearance",
				text: "Appearance",
				x: margin,
				y: margin * 2 + toolbarHeight * 5 - 2,
				height: widgetLineHeight * 5,
				width: 200 - margin * 2,
			},
			<LabelDesc> {
				type: "label",
				name: "label-staff-type",
				x: margin + toolbarHeight,
				y: margin * 2 + toolbarHeight * 7 -2,
				height: widgetLineHeight,
				width: groupboxName.width - margin * 2,
				text: "Type: ",
			},
			<DropdownDesc> {
				type: "dropdown",
				name: "dropdown-staff-type",
				x: margin + 80,
				y: margin * 2 + toolbarHeight * 7 -2,
				height: widgetLineHeight,
				width: 95,
				items: staffTypeList,
				selectedIndex: -1,
				onChange: (number: number) => setStaffType(number),
			},
			<LabelDesc> {
				type: "label",
				name: "label-costume",
				x: margin + toolbarHeight,
				y: margin * 2 + toolbarHeight * 9 -2,
				height: widgetLineHeight,
				width: groupboxName.width - margin * 2,
				text: "Costume: ",
			},
			<DropdownDesc> {
				type: "dropdown",
				name: "dropdown-costume",
				x: margin + 80,
				y: margin * 2 + toolbarHeight * 9 -2,
				height: widgetLineHeight,
				width: 95,
				items: costumeList,
				selectedIndex: -1,
				onChange: (number) => setCostume(number),
			},
			<GroupBoxDesc>{
				type: "groupbox",
				name: "groupbox-coordinates",
				text: "Coordinates",
				x: margin,
				y: margin * 2 + toolbarHeight * 5 + widgetLineHeight * 5 - 1,
				height: widgetLineHeight * 6.5,
				width: 200 - margin * 2,
			},
			<LabelDesc>{
				type: "label",
				name: "label-x-position",
				x: margin + toolbarHeight,
				y: margin * 2 + toolbarHeight * 5 + widgetLineHeight * 6.5 - 2,
				height: widgetLineHeight,
				width: groupboxName.width - margin * 2,
				text: "X position: ",
			},
			<SpinnerDesc>{
				type: "spinner",
				name: "spinner-x-position",
				x: margin + 80,
				y: margin * 2 + toolbarHeight * 5 + widgetLineHeight * 6.5 - 2,
				height: widgetLineHeight,
				width: 95,
				text: ` `,
				onIncrement: () => changeSpinner(ui.getWindow(peepPropertiesWindow).findWidget<SpinnerWidget>("spinner-x-position"), "x", + 1),
				onDecrement: () => changeSpinner(ui.getWindow(peepPropertiesWindow).findWidget<SpinnerWidget>("spinner-x-position"), "x", - 1),
			},
			<LabelDesc>{
				type: "label",
				name: "label-y-position",
				x: margin + toolbarHeight,
				y: margin * 2 + toolbarHeight * 5 + widgetLineHeight * 8 - 2,
				height: widgetLineHeight,
				width: groupboxName.width - margin * 2,
				text: "Y position: ",
			},
			<SpinnerDesc>{
				type: "spinner",
				name: "spinner-y-position",
				x: margin + 80,
				y: margin * 2 + toolbarHeight * 5 + widgetLineHeight * 8 - 2,
				height: widgetLineHeight,
				width: 95,
				text: ` `,
				onIncrement: () => changeSpinner(ui.getWindow(peepPropertiesWindow).findWidget<SpinnerWidget>("spinner-y-position"), "y", + 1),
				onDecrement: () => changeSpinner(ui.getWindow(peepPropertiesWindow).findWidget<SpinnerWidget>("spinner-y-position"), "y", - 1),
			},
			<LabelDesc>{
				type: "label",
				name: "label-z-position",
				x: margin + toolbarHeight,
				y: margin * 2 + toolbarHeight * 5 + widgetLineHeight * 9.5 - 2,
				height: widgetLineHeight,
				width: groupboxName.width - margin * 2,
				text: "Z position: ",
			},
			<SpinnerDesc>{
				type: "spinner",
				name: "spinner-z-position",
				x: margin + 80,
				y: margin * 2 + toolbarHeight * 5 + widgetLineHeight * 9.5 - 2,
				height: widgetLineHeight,
				width: 95,
				text: ` `,
				onIncrement: () => changeSpinner(ui.getWindow(peepPropertiesWindow).findWidget<SpinnerWidget>("spinner-z-position"), "z", + 1),
				onDecrement: () => changeSpinner(ui.getWindow(peepPropertiesWindow).findWidget<SpinnerWidget>("spinner-z-position"), "z", - 1),
			},
		]
	}
	else {
		return [
			<GroupBoxDesc>{
				type: "groupbox",
				name: "groupbox-attribute-colours",
				text: "Attribute colours",
				x: margin,
				y: margin + toolbarHeight,
				height: widgetLineHeight * 3,
				width: 200 - margin * 2,
			},
			<LabelDesc> {
				type: "label",
				name: "label-tshirt-colour",
				x: 9,
				y: margin + toolbarHeight + widgetLineHeight * 3 / 2.5 + 2,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `{INLINE_SPRITE}{217}{19}{0}{0}{SPRITE}`,
			},
			<ColourPickerDesc> {
				type: "colourpicker",
				name: "colourpicker-tshirt",
				x: 9 * 3,
				y: margin + toolbarHeight + widgetLineHeight * 3 / 2.5 + 2,
				height: widgetLineHeight,
				width: widgetLineHeight,
				colour: windowColour,
				onChange: (number) => setColour(number),
			},
			<LabelDesc> {
				type: "label",
				name: "label-trousers-colour",
				x: 9 * 5,
				y: margin + toolbarHeight + widgetLineHeight * 3 / 2.5 + 2,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `{INLINE_SPRITE}{253}{19}{0}{0}{SPRITE}`,
			},
			<ColourPickerDesc> {
				type: "colourpicker",
				name: "colourpicker-trousers",
				x: 9 * 7,
				y: margin + toolbarHeight + widgetLineHeight * 3 / 2.5 + 2,
				height: widgetLineHeight,
				width: widgetLineHeight,
				colour: windowColour,
				onChange: (number) => setColour(number),
			},
			<LabelDesc> {
				type: "label",
				name: "label-hat-colour",
				x: 9 * 9,
				y: margin + toolbarHeight + widgetLineHeight * 3 / 2.5 + 2,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `{INLINE_SPRITE}{215}{19}{0}{0}`,
			},
			<ColourPickerDesc> {
				type: "colourpicker",
				name: "colourpicker-hat",
				x: 9 * 11,
				y: margin + toolbarHeight + widgetLineHeight * 3 / 2.5 + 2,
				height: widgetLineHeight,
				width: widgetLineHeight,
				colour: windowColour,
				onChange: (number) => setColour(number),
			},
			<LabelDesc> {
				type: "label",
				name: "label-balloon-colour",
				x: 9 * 13,
				y: margin + toolbarHeight + widgetLineHeight * 3 / 2.5 + 2,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `{INLINE_SPRITE}{197}{19}{0}{0}`,
			},
			<ColourPickerDesc> {
				type: "colourpicker",
				name: "colourpicker-balloon",
				x: 9 * 15,
				y: margin + toolbarHeight + widgetLineHeight * 3 / 2.5 + 2,
				height: widgetLineHeight,
				width: widgetLineHeight,
				colour: windowColour,
				onChange: (number) => setColour(number),
			},
			<LabelDesc> {
				type: "label",
				name: "label-umbrella-colour",
				x: 9 * 17,
				y: margin + toolbarHeight + widgetLineHeight * 3 / 2.5 + 2,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `{INLINE_SPRITE}{201}{19}{0}{0}`,
			},
			<ColourPickerDesc> {
				type: "colourpicker",
				name: "colourpicker-umbrella",
				x: 9 * 19,
				y: margin + toolbarHeight + widgetLineHeight * 3 / 2.5 + 2,
				height: widgetLineHeight,
				width: widgetLineHeight,
				colour: windowColour,
				onChange: (number) => setColour(number),
			},
			<GroupBoxDesc>{
				type: "groupbox",
				name: "groupbox-flags",
				text: "Flags",
				x: margin,
				y: margin * 2 + toolbarHeight * 5 - 2,
				height: buttonSize * 7 - margin,
				width: 200 - margin * 2,
			},
			<CheckboxDesc> {
				type: "checkbox",
				name: "checkbox-leaving-park",
				x: 19,
				y: margin + toolbarHeight + widgetLineHeight * 4 + 1,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `Leaving park`,
			},
			<CheckboxDesc> {
				type: "checkbox",
				name: "checkbox-slow-walk",
				x: 19,
				y: margin + toolbarHeight + widgetLineHeight * 5,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `Slow walk`,
			},
			<CheckboxDesc> {
				type: "checkbox",
				name: "checkbox-tracking",
				x: 19,
				y: margin + toolbarHeight + widgetLineHeight * 6 -1,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `Tracking`,
			},
			<CheckboxDesc> {
				type: "checkbox",
				name: "checkbox-waving",
				x: 19,
				y: margin + toolbarHeight + widgetLineHeight * 7 -2,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `Waving`,
			},
			<CheckboxDesc> {
				type: "checkbox",
				name: "checkbox-painting",
				x: 19,
				y: margin + toolbarHeight + widgetLineHeight * 8 -3,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `Painting`,
			},
			<CheckboxDesc> {
				type: "checkbox",
				name: "checkbox-photo",
				x: 19,
				y: margin + toolbarHeight + widgetLineHeight * 9 -4,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `Photo`,
			},
			<CheckboxDesc> {
				type: "checkbox",
				name: "checkbox-wow",
				x: 19,
				y: margin + toolbarHeight + widgetLineHeight * 10 -5,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `Wow!`,
			},
			<CheckboxDesc> {
				type: "checkbox",
				name: "checkbox-litter",
				x: 19,
				y: margin + toolbarHeight + widgetLineHeight * 11 -6,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `Litter`,
			},
			<CheckboxDesc> {
				type: "checkbox",
				name: "checkbox-lost",
				x: 19,
				y: margin + toolbarHeight + widgetLineHeight * 12 -7,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `Lost`,
			},
			<CheckboxDesc> {
				type: "checkbox",
				name: "checkbox-hunger",
				x: 19,
				y: margin + toolbarHeight + widgetLineHeight * 13 -8,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `Hunger`,
			},
			<CheckboxDesc> {
				type: "checkbox",
				name: "checkbox-here-we-are",
				x: 19,
				y: margin + toolbarHeight + widgetLineHeight * 14 -9,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `Here we are`,
			},
			<CheckboxDesc> {
				type: "checkbox",
				name: "checkbox-toilet",
				x: 110,
				y: margin + toolbarHeight + widgetLineHeight * 4 +1,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `Toilet`,
			},
			<CheckboxDesc> {
				type: "checkbox",
				name: "checkbox-crowded",
				x: 110,
				y: margin + toolbarHeight + widgetLineHeight * 5,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `Crowded`,
			},
			<CheckboxDesc> {
				type: "checkbox",
				name: "checkbox-happiness",
				x: 110,
				y: margin + toolbarHeight + widgetLineHeight * 6 -1,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `Happiness`,
			},
			<CheckboxDesc> {
				type: "checkbox",
				name: "checkbox-nausea",
				x: 110,
				y: margin + toolbarHeight + widgetLineHeight * 7 -2,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `Nausea`,
			},
			<CheckboxDesc> {
				type: "checkbox",
				name: "checkbox-purple",
				x: 110,
				y: margin + toolbarHeight + widgetLineHeight * 8 -3,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `Purple`,
			},
			<CheckboxDesc> {
				type: "checkbox",
				name: "checkbox-pizza",
				x: 110,
				y: margin + toolbarHeight + widgetLineHeight * 9 -4,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `Pizza`,
			},
			<CheckboxDesc> {
				type: "checkbox",
				name: "checkbox-explode",
				x: 110,
				y: margin + toolbarHeight + widgetLineHeight * 10 -5,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `Explode`,
			},
			<CheckboxDesc> {
				type: "checkbox",
				name: "checkbox-contagious",
				x: 110,
				y: margin + toolbarHeight + widgetLineHeight * 11 -6,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `Contagious`,
			},
			<CheckboxDesc> {
				type: "checkbox",
				name: "checkbox-joy",
				x: 110,
				y: margin + toolbarHeight + widgetLineHeight * 12 -7,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `Joy`,
			},
			<CheckboxDesc> {
				type: "checkbox",
				name: "checkbox-angry",
				x: 110,
				y: margin + toolbarHeight + widgetLineHeight * 13 -8,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `Angry`,
			},
			<CheckboxDesc> {
				type: "checkbox",
				name: "checkbox-ice-cream",
				x: 110,
				y: margin + toolbarHeight + widgetLineHeight * 14 -9,
				height: widgetLineHeight,
				width: windowWidth - margin * 2,
				text: `Ice cream`,
			},
		]
	}
};

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

function removePeep(peep: Staff | Guest) {
	const thisWindow = ui.getWindow(removePeepWindow);
	if (thisWindow) {
		debug("Remove peep window is already shown");
		thisWindow.bringToFront();
	}
	else
		ui.openWindow({
			onClose: () => {
				ui.tool?.cancel();
			},
			classification: removePeepWindow,
			title: "Remove peep",
			width: 200,
			height: 100,
			x: ui.width / 2 - 100,
			y: ui.height / 2 - 50,
			colours: [colour.BordeauxRed, colour.BordeauxRed],
			widgets: [
				<LabelDesc>{
					type: "label",
					x: 0,
					y: 48,
					width: 200,
					height: widgetLineHeight,
					textAlign: "centred",
					text: `{WHITE}Are you sure you want to remove\n${peep.name}?`,
					isDisabled: false
				},
				<ButtonDesc>{
					name: "yes",
					type: "button",
					border: true,
					x: 10,
					y: 80,
					width: 85,
					height: 14,
					text: "Yes",
					isPressed: false,
					isDisabled: false,
					onClick: () => yesRemovePeep(peep),
				},
				<ButtonDesc>{
					name: "cancel",
					type: "button",
					border: true,
					x: 105,
					y: 80,
					width: 85,
					height: 14,
					text: "Cancel",
					isPressed: false,
					isDisabled: false,
					onClick: () => ui.getWindow(removePeepWindow).close()
				},
			]
		});
};

function yesRemovePeep(peep: Staff | Guest) {
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
	ui.getWindow(removePeepWindow).close();
	ui.getWindow(peepPropertiesWindow).close();
	resetViewport();
	peep.remove();
};

function getStaffType(peep: Staff) {
	const dropdown = ui.getWindow(peepPropertiesWindow).findWidget<DropdownWidget>("dropdown-staff-type");
	dropdown.text = staffTypeLabel[peep.staffType];
	debug(`stafftype is ${peep.staffType}`);
};

function setStaffType(number: number) {
	const staff = <Staff>peepId;
	staff.staffType = staffType[number];
    debug(`Stafftype is set to ${staffTypeList[number]}`)
};

function getCostume(peep: Staff) {
	const dropdown = ui.getWindow(peepPropertiesWindow).findWidget<DropdownWidget>("dropdown-costume");
	if (peep.costume > 251) {
		dropdown.text = costume[peep.costume - 208]
	}
	else {dropdown.text = costume[peep.costume]}
};

function setCostume(number: number) {
	const staff = <Staff>peepId;
	if (number > 43) {
		number = number + 208
		staff.costume = number
	}
	else {staff.costume = number}
    debug(`Costume is set to ${costume[number]}`)
};

function getEnergy(peep: Staff | Guest) {
	const button = ui.getWindow(windowId).findWidget<ButtonWidget>("button-freeze");
	if (peep.energy <= 1) {
			button.isPressed = true;
	}
	else {
		button.isPressed = false;
	}
};

function freezePeep(peep: Staff | Guest) {
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
};

function widgetEnable(name: Widget) {
	const widget = ui.getWindow(windowId).findWidget<Widget>(name.name);
		widget.isDisabled = false;
};

function widgetDisable(name: Widget) {
	const widget = ui.getWindow(windowId).findWidget<Widget>(name.name);
		widget.isDisabled = true;
};

function disableUpdate(update: IDisposable | null) {
	update?.dispose();
	update = null;
};

function changeSpinner(spinner: SpinnerWidget, axis: keyof CoordsXYZ, operator: number) {
	peepId[axis] = peepId[axis] + operator * multiplier;
	updateSpinner(spinner, axis);
};

function updateSpinner(spinner: SpinnerWidget, axis: keyof CoordsXYZ) {
	const spinnerWidget = ui.getWindow(peepPropertiesWindow).findWidget<SpinnerWidget>(spinner.name);
	spinnerWidget.text = peepId[axis].toString();
	debug(`${[axis]}: ${peepId[axis]}`);
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

function getColour(peep: Staff | Guest) {
	const window = ui.getWindow(staffPropertiesWindow);
	const widget = window.findWidget<ColourPickerWidget>("colourpicker-staff");
	const staff = <Staff>peep;
	widget.colour = staff.colour;
}

function setColour(number: number) {
	const staff = <Staff>peepId;
	staff.colour = number
};


function setPeepName(peep: Staff | Guest) {
	const window = ui.getWindow(windowId);
	ui.showTextInput({
		title: peepTypeTitle(peep),
		description: peepTypeDescription(peep),
		initialValue: `${peepId.name}`,
		callback: text => {
			peepId.name = text
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