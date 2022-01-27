/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { debug } from '../helpers/logger';
import { isDevelopment, pluginVersion } from '../helpers/environment';

const windowOptions = {
	windowId: 'guest-editor-window',
	widgetLineHeight: 14,
	windowColour: 19,
};

//Enumerate the possible Guest properties we're going to modify
type GuestColourOptions = 'tshirtColour' | 'trousersColour' | 'balloonColour' | 'umbrellaColour' | 'hatColour';
let guestColourOptions: { [Keys in GuestColourOptions]: { id: string; colour: number | null } } = {
	tshirtColour: {
		id: 'guest-editor-tshirts',
		colour: windowOptions.windowColour,
	},
	trousersColour: {
		id: 'guest-editor-trousers',
		colour: windowOptions.windowColour,
	},
	balloonColour: {
		id: 'guest-editor-balloons',
		colour: windowOptions.windowColour,
	},
	umbrellaColour: {
		id: 'guest-editor-umbrellas',
		colour: windowOptions.windowColour,
	},
	hatColour: {
		id: 'guest-editor-hats',
		colour: windowOptions.windowColour,
	},
};
// Settings for the window
let costumeDropdown = { id: 'guest-editor-dropdown-costume', items: [
	'Panda', //0
	'Tiger', //1
	'Elephant', //2
	'Gladiator', //3
	'Gorilla', //4
	'Snowman', //5
	'Knight', //6
	'Astronaut', //7
	'Bandit', //8
	'Sheriff', //9
	'Pirate', //10
	'Icecream', //11
	'Chips', //12
	'Burger', //13
	'Soda can', //14
	'Balloon', //15
	'Candyfloss', //16
	'Umbrella', //17
	'Pizza', //18
	'Security', //19
	'Popcorn', //20
	'Arms crossed', //21
	'Head down', //22
	'Nauseous', //23
	'Very nauseous', //24
	'Needs toilet', //25
	'Hat', //26
	'Hotdog', //27
	'Tentacle', //28
	'Toffee apple', //29
	'Donut', //30
	'Coffee', //31
	'Nuggets', //32
	'Lemonade', //33
	'Walking', //34
	'Pretzel', //35
	'Sunglasses', //36
	'Sujongkwa', //37
	'Juice', //38
	'Funnel cake', //39
	'Noodles', //40
	'Sausage', //41
	'Soup', //42
	'Sandwich', //43
	'Guest', //252
	'Handyman', //253
	'Mechanic', //254
	'Security guard', //255
] };
let stafftypeDropdown = { id: 'guest-editor-dropdown-stafftype', items: ['Handyman', 'Mechanic', 'Security Guard', 'Entertainer'] };
let buttonTest = { id: 'guest-editor-button-test', value: 0 };
let staffLabel = { id: 'guest-editor-staff-label', value: 0 };
let toolSelectStaff = { id: 'guest-editor-tool-select-staff', value: 0 };
let buttonLocateStaff = { id: 'guest-editor-button-locate-staff', value: 0 };
let freeze = { id: 'guest-editor-checkbox-freeze-staff', value: 0 };
let viewport = { id: 'guest-editor-viewport', value: 0 };
let staffColourPicker = { id: 'guest-editor-staff-colour-picker', value: 0 };
let staffTypeLabel = { id: 'guest-editor-staff-type-label', value: 0 };
let costumeLabel = { id: 'guest-editor-costume-label', value: 0 };
let blackViewport: CoordsXY = { x: -9000, y: -9000 };

let widgetProps: { [K in PeepFlags]: { id: string; toggle: boolean } } = {
	leavingPark: { id: 'guest-editor-leaving-park', toggle: false },
	slowWalk: { id: 'guest-editor-slow-walk', toggle: false },
	tracking: { id: 'guest-editor-tracking', toggle: false },
	waving: { id: 'guest-editor-waving', toggle: false },
	hasPaidForParkEntry: { id: 'N/A', toggle: false },
	painting: { id: 'guest-editor-painting', toggle: false },
	wow: { id: 'guest-editor-wow', toggle: false },
	litter: { id: 'guest-editor-littering', toggle: false },
	pizza: { id: 'guest-editor-pizza', toggle: false },
	explode: { id: 'guest-editor-explode', toggle: false },
	contagious: { id: 'N/A', toggle: false },
	joy: { id: 'guest-editor-joy', toggle: false },
	angry: { id: 'guest-editor-angry', toggle: false },
	iceCream: { id: 'guest-editor-ice-cream', toggle: false },
	hereWeAre: { id: 'guest-editor-here-we-are', toggle: false },
	photo: { id: 'guest-editor-photo', toggle: false },
	lost: { id: 'N/A', toggle: false },//Not used
	hunger: { id: 'N/A', toggle: false },//Not used
	toilet: { id: 'N/A', toggle: false },//Not used
	crowded: { id: 'N/A', toggle: false },//Not used
	happiness: { id: 'N/A', toggle: false },//Not used
	nausea: { id: 'N/A', toggle: false },//Not used
	purple: { id: 'N/A', toggle: false },//Not used
	rideShouldBeMarkedAsFavourite: { id: 'N/A', toggle: false },//Not used
	parkEntranceChosen: { id: 'N/A', toggle: false },//Not used

};

//Probably could move these variables somewhere cleaner, but I can't quite figure out how ATM.
const guestsEnergy: number = 0;
const staffName: string = 'no staff selected';
let toggle: boolean = false;
let toggleDisabled: boolean = true;
const coords: CoordsXYZ = { z: 0, y: 0, x: 0 };
let widgetFreeze: boolean = false;
let staffMember: Entity;
let energyStaff: number;
let idStaff: Staff;
let checkboxDisabled: boolean = true;
let colourPickerDisabled: boolean = true;
let update: IDisposable | null = null;
let toggleFreeze: boolean = false;
const staffTypeNumber: number = -1;
let selectedIndexCostume: number = -1;

export class PeepEditorWindow {
	/**
	 * Opens the window for the Peep Editor.
	 */

	open(): void {
		const window = ui.getWindow(windowOptions.windowId);
		if (window) {
			debug('The Peep Editor window is already shown.');
			window.bringToFront();
		} else {
			let windowTitle = `Peep Editor (v${pluginVersion})`;
			if (isDevelopment) {
				windowTitle += ' [DEBUG]';
			}

			ui.openWindow({
				onClose: () => {
					toggle = false;
					toggleDisabled = true;
					toggleFreeze = false;
					checkboxDisabled = true;
					colourPickerDisabled = true;
					widgetFreeze = false;
					ui.tool?.cancel();
				},
				classification: windowOptions.windowId,
				title: windowTitle,
				width: 260,
				height: 250,
				colours: [windowOptions.windowColour, windowOptions.windowColour],
				tabs: [
					{
						image: 5628, //staff
						widgets: [
							<LabelWidget>{
								type: 'label',
								x: 0,
								y: 232,
								width: 260,
								height: windowOptions.widgetLineHeight,
								textAlign: 'centred',
								text: 'Manticore-007 + lts Smitty',
								tooltip: 'Powered by Basssiiie',
								isDisabled: true,
							},
							<GroupBoxWidget>{
								type: 'groupbox',
								x: 10,
								y: 55,
								width: 240,
								height: 170,
								text: 'Staff',
							},
							<GroupBoxWidget>{
								type: 'groupbox',
								x: 10,
								y: 95,
								width: 240,
								height: 130,
							},
							<LabelWidget>{
								name: staffLabel.id,
								type: 'label',
								x: 20,
								y: 73,
								width: 260,
								height: windowOptions.widgetLineHeight,
								text: `Name: {RED}${staffName}`,
								isDisabled: false,
							},
							<LabelWidget>{
								name: staffTypeLabel.id,
								type: 'label',
								x: 20,
								y: 110,
								width: 140,
								height: windowOptions.widgetLineHeight,
								text: `Type:`,
								isDisabled: true,
							},
							<DropdownWidget>{
								name: stafftypeDropdown.id,
								type: 'dropdown',
								x: 75,
								y: 110,
								width: 95,
								height: windowOptions.widgetLineHeight,
								items: stafftypeDropdown.items,
								selectedIndex: staffTypeNumber,
								isDisabled: true,
								onChange: (number) => setStaffType(number),
							},
							<LabelWidget>{
								name: costumeLabel.id,
								type: 'label',
								x: 20,
								y: 125,
								width: 140,
								height: windowOptions.widgetLineHeight,
								text: `Costume:`,
								isDisabled: true,
							},
							<DropdownWidget>{
								name: costumeDropdown.id,
								type: 'dropdown',
								x: 75,
								y: 125,
								width: 95,
								height: windowOptions.widgetLineHeight,
								items: costumeDropdown.items,
								selectedIndex: selectedIndexCostume,
								isDisabled: true,
								onChange: (number) => setCostume(number),
							},
							<ButtonWidget>{
								name: buttonTest.id,
								type: 'button',
								border: true,
								x: 185,
								y: 165,
								width: 24,
								height: 24,
								image: 29467,
								isPressed: toggle,
								onClick: () => selectStaff(),
							},
							<ButtonWidget>{
								name: buttonLocateStaff.id,
								type: 'button',
								border: true,
								x: 211,
								y: 165,
								width: 24,
								height: 24,
								image: 5167, //locate icon
								isPressed: false,
								isDisabled: toggleDisabled,
								onClick: () => gotoStaff(),
							},
							<ButtonWidget>{
								name: freeze.id,
								type: 'button',
								border: true,
								x: 185,
								y: 191,
								width: 24,
								height: 24,
								image: 5182, //red/green flag
								isPressed: toggleFreeze,
								isDisabled: toggleDisabled,
								onClick: () => buttonFreeze(),
							},
							<ColourPickerWidget>{
								type: 'colourpicker',
								x: 220,
								y: 73,
								width: 100,
								height: windowOptions.widgetLineHeight,
								name: staffColourPicker.id,
								tooltip: 'Change staff colour',
								isDisabled: colourPickerDisabled,
								colour: 0,
								onChange: (colour) => staffColourSet(colour),
							},
							<ViewportWidget>{
								type: 'viewport',
								name: viewport.id,
								x: 185,
								y: 110,
								width: 50,
								height: 50,
								viewport: {
									left: blackViewport.x,
									top: blackViewport.y,
								},
							},
						],
					},
					{
						image: { frameBase: 5221, frameCount: 8, frameDuration: 4 },
						widgets: [
							<LabelWidget>{
								type: 'label',
								x: 0,
								y: 232,
								width: 260,
								height: windowOptions.widgetLineHeight,
								textAlign: 'centred',
								text: 'Manticore-007',
								tooltip: 'Powered by Basssiiie',
								isDisabled: true,
							},
							<GroupBoxWidget>{
								type: 'groupbox',
								x: 10,
								y: 55,
								width: 240,
								height: 170,
								text: 'Colours',
							},
							<ColourPickerWidget>{
								type: 'colourpicker',
								x: 20,
								y: 80,
								width: 100,
								height: windowOptions.widgetLineHeight,
								name: guestColourOptions.tshirtColour.id,
								tooltip: 'Change guests shirts',
								isDisabled: false,
								colour: guestColourOptions.tshirtColour.colour,
								onChange: (colour: number) => this.SetGuestFeatureColour('tshirtColour', colour),
							},
							<LabelWidget>{
								type: 'label',
								x: 40,
								y: 80,
								width: 275,
								height: windowOptions.widgetLineHeight,
								text: 'Shirts',
								isDisabled: false,
							},
							<ColourPickerWidget>{
								type: 'colourpicker',
								x: 20,
								y: 100,
								width: 100,
								height: windowOptions.widgetLineHeight,
								name: guestColourOptions.trousersColour.id,
								tooltip: 'Change guests trousers',
								isDisabled: false,
								colour: guestColourOptions.trousersColour.colour,
								onChange: (colour: number) => this.SetGuestFeatureColour('trousersColour', colour),
							},
							<LabelWidget>{
								type: 'label',
								x: 40,
								y: 100,
								width: 275,
								height: windowOptions.widgetLineHeight,
								text: 'Trousers',
								isDisabled: false,
							},
							<ColourPickerWidget>{
								type: 'colourpicker',
								x: 20,
								y: 120,
								width: 100,
								height: windowOptions.widgetLineHeight,
								name: guestColourOptions.balloonColour.id,
								tooltip: 'Change guests balloons',
								isDisabled: false,
								colour: guestColourOptions.balloonColour.colour,
								onChange: (colour: number) => this.SetGuestFeatureColour('balloonColour', colour),
							},
							<LabelWidget>{
								type: 'label',
								x: 40,
								y: 120,
								width: 275,
								height: windowOptions.widgetLineHeight,
								text: 'Balloons',
								isDisabled: false,
							},
							<ColourPickerWidget>{
								type: 'colourpicker',
								x: 20,
								y: 140,
								width: 100,
								height: windowOptions.widgetLineHeight,
								name: guestColourOptions.hatColour.id,
								tooltip: 'Change guests hats',
								isDisabled: false,
								colour: guestColourOptions.hatColour.colour,
								onChange: (colour: number) => this.SetGuestFeatureColour('hatColour', colour),
							},
							<LabelWidget>{
								type: 'label',
								x: 40,
								y: 140,
								width: 275,
								height: windowOptions.widgetLineHeight,
								text: 'Hats',
								isDisabled: false,
							},
							<ColourPickerWidget>{
								type: 'colourpicker',
								x: 20,
								y: 160,
								width: 100,
								height: windowOptions.widgetLineHeight,
								name: guestColourOptions.umbrellaColour.id,
								tooltip: 'Change guests umbrellas',
								isDisabled: false,
								colour: guestColourOptions.balloonColour.colour,
								onChange: (colour: number) => this.SetGuestFeatureColour('umbrellaColour', colour),
							},
							<LabelWidget>{
								type: 'label',
								x: 40,
								y: 160,
								width: 275,
								height: windowOptions.widgetLineHeight,
								text: 'Umbrellas',
								isDisabled: false,
							},
						],
					},
					{
						image: {
							frameBase: 5318, //pointing hand
							frameCount: 8,
							frameDuration: 2,
						},
						widgets: [
							<LabelWidget>{
								type: 'label',
								x: 0,
								y: 232,
								width: 260,
								height: windowOptions.widgetLineHeight,
								textAlign: 'centred',
								text: 'Manticore-007',
								tooltip: 'Powered by Basssiiie',
								isDisabled: true,
							},
							<GroupBoxWidget>{
								type: 'groupbox',
								x: 10,
								y: 55,
								width: 240,
								height: 170,
								text: 'Flags',
							},
							<CheckboxWidget>{
								name: widgetProps.litter.id,
								type: 'checkbox',
								x: 20,
								y: 78,
								width: 100,
								height: 15,
								text: 'Litter',
								tooltip: 'Lets guests behave like pigs',
								isChecked: widgetProps.litter.toggle,
								onChange: () => this.ToggleGuestFlags('litter'),
							},
							<CheckboxWidget>{
								name: widgetProps.explode.id,
								type: 'checkbox',
								x: 20,
								y: 98,
								width: 100,
								height: 15,
								text: 'Explode',
								tooltip: 'Execute Order 66',
								isChecked: widgetProps.explode.toggle,
								onChange: () => this.ToggleGuestFlags('explode'),
							},
							<CheckboxWidget>{
								name: widgetProps.leavingPark.id,
								type: 'checkbox',
								x: 20,
								y: 118,
								width: 100,
								height: 15,
								text: 'Leave park',
								tooltip: 'Evacuate park',
								isChecked: widgetProps.leavingPark.toggle,
								onChange: () => this.ToggleGuestFlags('leavingPark'),
							},
							<CheckboxWidget>{
								name: widgetProps.slowWalk.id,
								type: 'checkbox',
								x: 20,
								y: 138,
								width: 100,
								height: 15,
								text: 'Slow walk',
								tooltip: "Give the guests the Iron Boots from 'Ocarina of Time'",
								isChecked: widgetProps.slowWalk.toggle,
								onChange: () => this.ToggleGuestFlags('slowWalk'),
							},
							<CheckboxWidget>{
								name: widgetProps.tracking.id,
								type: 'checkbox',
								x: 20,
								y: 158,
								width: 100,
								height: 15,
								text: 'Track your guests',
								tooltip: 'Vaccinate all of your guests with tracking chips',
								isChecked: widgetProps.tracking.toggle,
								onChange: () => this.ToggleGuestFlags('tracking'),
							},
							<CheckboxWidget>{
								name: widgetProps.waving.id,
								type: 'checkbox',
								x: 20,
								y: 178,
								width: 100,
								height: 15,
								text: 'Wave',
								tooltip: "'Hey Everyone'",
								isChecked: widgetProps.waving.toggle,
								onChange: () => this.ToggleGuestFlags('waving'),
							},
							<CheckboxWidget>{
								name: widgetProps.photo.id,
								type: 'checkbox',
								x: 20,
								y: 198,
								width: 100,
								height: 15,
								text: 'Make photos',
								tooltip: 'Guests documenting their good time at your park',
								isChecked: widgetProps.photo.toggle,
								onChange: () => this.ToggleGuestFlags('photo'),
							},
							<CheckboxWidget>{
								name: widgetProps.painting.id,
								type: 'checkbox',
								x: 150,
								y: 78,
								width: 100,
								height: 15,
								text: 'Paint',
								tooltip: 'Guests painting happy accidents',
								isChecked: widgetProps.painting.toggle,
								onChange: () => this.ToggleGuestFlags('painting'),
							},
							<CheckboxWidget>{
								name: widgetProps.wow.id,
								type: 'checkbox',
								x: 150,
								y: 98,
								width: 100,
								height: 15,
								text: 'Wow',
								tooltip: 'Guests think they are Owen Wilson',
								isChecked: widgetProps.wow.toggle,
								onChange: () => this.ToggleGuestFlags('wow'),
							},
							<CheckboxWidget>{
								name: widgetProps.hereWeAre.id,
								type: 'checkbox',
								x: 150,
								y: 118,
								width: 100,
								height: 15,
								text: 'Here we are',
								tooltip: 'Guests think they are working for CNN',
								isChecked: widgetProps.hereWeAre.toggle,
								onChange: () => this.ToggleGuestFlags('hereWeAre'),
							},
							<CheckboxWidget>{
								name: widgetProps.iceCream.id,
								type: 'checkbox',
								x: 150,
								y: 138,
								width: 100,
								height: 15,
								text: 'Ice cream',
								tooltip: 'Luitenant Dan, ice cream!',
								isChecked: widgetProps.iceCream.toggle,
								onChange: () => this.ToggleGuestFlags('iceCream'),
							},
							<CheckboxWidget>{
								name: widgetProps.pizza.id,
								type: 'checkbox',
								x: 150,
								y: 158,
								width: 100,
								height: 15,
								text: 'Pizza',
								tooltip: "'A cheese pizza, just for me'",
								isChecked: widgetProps.pizza.toggle,
								onChange: () => this.ToggleGuestFlags('pizza'),
							},
							<CheckboxWidget>{
								name: widgetProps.joy.id,
								type: 'checkbox',
								x: 150,
								y: 178,
								width: 100,
								height: 15,
								text: 'Joy',
								tooltip: 'Press A to jump',
								isChecked: widgetProps.joy.toggle,
								onChange: () => this.ToggleGuestFlags('joy'),
							},
							<CheckboxWidget>{
								name: widgetProps.angry.id,
								type: 'checkbox',
								x: 150,
								y: 198,
								width: 100,
								height: 15,
								text: 'Angry',
								tooltip: 'Turn the guests into Karens',
								isChecked: widgetProps.angry.toggle,
								onChange: () => this.ToggleGuestFlags('angry'),
							},
						],
					},
					{
						image: {
							frameBase: 5245, // rising graph
							frameCount: 8,
							frameDuration: 4,
						},
						widgets: [
							<LabelWidget>{
								type: 'label',
								x: 0,
								y: 232,
								width: 260,
								height: windowOptions.widgetLineHeight,
								textAlign: 'centred',
								text: 'Manticore-007',
								tooltip: 'Powered by Basssiiie',
								isDisabled: true,
							},
							<GroupBoxWidget>{
								type: 'groupbox',
								x: 10,
								y: 55,
								width: 240,
								height: 170,
								text: 'Conditions',
							},
							<LabelWidget>{
								type: 'label',
								x: 0,
								y: 140,
								width: 260,
								height: windowOptions.widgetLineHeight,
								textAlign: 'centred',
								text: 'Not yet available',
								isDisabled: true,
							},
						],
					},
					{
						image: {
							frameBase: 5367, //rotating info box
							frameCount: 8,
							frameDuration: 4,
						},
						widgets: [
							<LabelWidget>{
								type: 'label',
								x: 0,
								y: 232,
								width: 260,
								height: windowOptions.widgetLineHeight,
								textAlign: 'centred',
								text: 'Manticore-007',
								tooltip: 'Powered by Basssiiie',
								isDisabled: true,
							},
							<GroupBoxWidget>{
								type: 'groupbox',
								x: 10,
								y: 55,
								width: 240,
								height: 70,
								text: 'About',
							},
							<LabelWidget>{
								type: 'label',
								x: 0,
								y: 85,
								width: 260,
								height: windowOptions.widgetLineHeight,
								textAlign: 'centred',
								text: 'My first plugin made by me, Manticore-007 \n Built with coaching from Basssiiie \n Based on his Proxy Pather Plugin',
							},
							<GroupBoxWidget>{
								type: 'groupbox',
								x: 10,
								y: 140,
								width: 240,
								height: 40,
								text: 'GitHub',
							},
							<LabelWidget>{
								type: 'label',
								x: 0,
								y: 157,
								width: 260,
								height: windowOptions.widgetLineHeight,
								textAlign: 'centred',
								text: 'https://github.com/Manticore-007',
							},
						],
					},
				],
			});
		}
	}

	SetGuestFeatureColour(feature: GuestColourOptions, colour: number) {
		console.log(`Changing ${feature}`);
		const guests = map.getAllEntities('guest');
		guests.forEach((guest) => {
			guest[feature] = colour;
		});
		guestColourOptions[feature].colour = colour;
	}

	/**
	 * Flips the value for @param guestFlag
	 */
	ToggleGuestFlags(guestFlag: PeepFlags) {
		const guests = map.getAllEntities('guest');
		guests.forEach((guest) => {
			//Flip the flag from being true <> false per https://stackoverflow.com/questions/11604409/how-to-toggle-a-boolean
			guest.setFlag(guestFlag, !guest.getFlag(guestFlag));
		});
		//Update the UI?
		//The original code updated this var every loop, not sure why.
		//I've opted to just set it equal to whatever the 0th guest is.
		widgetProps[guestFlag].toggle = guests[0].getFlag(guestFlag);
		return widgetProps[guestFlag];
	}

	SetEnergy(energy: number) {
		const guest = map.getAllEntities('guest');
		guest.forEach((guest) => {
			guest.energy = energy;
			guest.energyTarget = 0;
			energy = guestsEnergy;
		});
	}
}
function setStaffName(name: string) {
	const win = ui.getWindow(windowOptions.windowId);
	if (win) {
		const label = win.findWidget<LabelWidget>(staffLabel.id);
		label.text = `Name: {WHITE}${name}`;
	}
}
function getStaffType(type: string) {
	const win = ui.getWindow(windowOptions.windowId);
	const staffTypeNumber = ['handyman', 'mechanic', 'security', 'entertainer'];
	if (win) {
		const dropdown = win.findWidget<DropdownWidget>(stafftypeDropdown.id);
		const dropdownCostume = win.findWidget<DropdownWidget>(costumeDropdown.id);
		const typeLabel = win.findWidget<LabelWidget>(staffTypeLabel.id);
		const staffcostumeLabel = win.findWidget<LabelWidget>(costumeLabel.id);
		if (dropdown.items !== undefined) {
			dropdown.selectedIndex = staffTypeNumber.indexOf(type);
		}
		(dropdownCostume.isDisabled = false), (dropdown.isDisabled = false);
		typeLabel.isDisabled = false;
		staffcostumeLabel.isDisabled = false;
	}
}
function setStaffType(number: number) {
	const staffTypeList: StaffType[] = ['handyman', 'mechanic', 'security', 'entertainer'];
	idStaff.staffType = staffTypeList[number];
}
function getCostume(number: number) {
	const win = ui.getWindow(windowOptions.windowId);
	const dropdownCostume = win.findWidget<DropdownWidget>(costumeDropdown.id);
	if (number > 251) {
		selectedIndexCostume = number - 208;
		dropdownCostume.selectedIndex = selectedIndexCostume;
	} else {
		selectedIndexCostume = number;
		dropdownCostume.selectedIndex = selectedIndexCostume;
	}
}
function setCostume(number: number) {
	const win = ui.getWindow(windowOptions.windowId);
	const dropdownCostume = win.findWidget<DropdownWidget>(costumeDropdown.id);
	if (number === 0 && idStaff.staffType != 'entertainer') {
		selectedIndexCostume = -1;
		dropdownCostume.selectedIndex = selectedIndexCostume;
		return;
	} else {
		if (number > 43) {
			selectedIndexCostume = number + 208;
			idStaff.costume = selectedIndexCostume;
		} else {
			selectedIndexCostume = number;
			idStaff.costume = selectedIndexCostume;
		}
	}
}
function buttonFreeze() {
	const win = ui.getWindow(windowOptions.windowId);
	if (win) {
		const button = win.findWidget<ButtonWidget>(freeze.id);
		if (energyStaff === 0) {
			energyStaff = 96;
			idStaff.energy = energyStaff;
			toggleFreeze = false;
			button.isPressed = toggleFreeze;
		} else {
			energyStaff = 0;
			idStaff.energy = energyStaff;
			toggleFreeze = true;
			button.isPressed = toggleFreeze;
		}
	}
}
function staffColourSet(colour: number) {
	idStaff.colour = colour;
}
function gotoStaff() {
	coords.x = staffMember.x;
	coords.y = staffMember.y;
	coords.z = staffMember.z;
	ui.mainViewport.scrollTo(coords);
}
function selectStaff() {
	const window = ui.getWindow(windowOptions.windowId);
	const buttonPicker = window.findWidget<ButtonWidget>(buttonTest.id);
	const buttonLocate = window.findWidget<ButtonWidget>(buttonLocateStaff.id);
	const buttonFreeze = window.findWidget<ButtonWidget>(freeze.id);
	const staffColourCurrent = window.findWidget<ColourPickerWidget>(staffColourPicker.id);
	const pluginViewport = window.findWidget<ViewportWidget>(viewport.id);
	const dropdownType = window.findWidget<DropdownWidget>(stafftypeDropdown.id);
	const dropdownCostume = window.findWidget<DropdownWidget>(costumeDropdown.id);
	const label = window.findWidget<LabelWidget>(staffTypeLabel.id);
	if (!window) {
		return;
	} else {
		if (toggle !== false) {
			toggle = false;
			buttonPicker.isPressed = toggle;
			ui.tool?.cancel();
		} else {
			toggle = true;
			buttonPicker.isPressed = toggle;
			ui.activateTool({
				id: toolSelectStaff.id,
				cursor: 'cross_hair',
				filter: ['entity'],
				onDown: (e) => {
					if (e.entityId !== undefined) {
						console.log(e.entityId);
						const entity = map.getEntity(e.entityId);
						const staff = <Staff>entity;
						idStaff = staff;
						if (!entity || entity.type !== 'staff') {
							dropdownType.selectedIndex = -1;
							toggle = false;
							(toggleDisabled = true),
								(toggleFreeze = false),
								(colourPickerDisabled = true),
								(label.isDisabled = true),
								(dropdownType.isDisabled = true),
								(dropdownCostume.isDisabled = true),
								(buttonPicker.isPressed = toggle),
								(buttonLocate.isDisabled = toggleDisabled),
								(buttonFreeze.isDisabled = toggleDisabled),
								(buttonFreeze.isPressed = toggleFreeze),
								(staffColourCurrent.isDisabled = colourPickerDisabled);
							if (update !== null) {
								update.dispose();
								update = null;
							}
							pluginViewport.viewport?.moveTo(blackViewport);
							ui.tool?.cancel();
							ui.showError('You have to select', 'a staff member');
							setStaffName('{RED}No staff selected');
							debug('invalid entity selected');
						} else {
							if (staff.energy !== 0) {
								buttonFreeze.isPressed = false;
							} else {
								buttonFreeze.isPressed = true;
							}
							ui.tool?.cancel(),
								(toggle = false),
								(toggleDisabled = false),
								(colourPickerDisabled = false),
								(staffColourCurrent.isDisabled = colourPickerDisabled),
								(staffColourCurrent.colour = staff.colour),
								(buttonLocate.isDisabled = toggleDisabled),
								(buttonPicker.isPressed = toggle),
								(buttonFreeze.isDisabled = toggleDisabled),
								getCostume(staff.costume);
							getStaffType(staff.staffType);
							setStaffName(staff.name);
							const pluginViewport = window.findWidget<ViewportWidget>(viewport.id);
							update = context.subscribe('interval.tick', () =>
								pluginViewport.viewport?.moveTo({
									x: staff.x,
									y: staff.y,
									z: staff.z,
								})
							);
						}
						return (energyStaff = staff.energy), (staffMember = entity);
					}
					return;
				},
			});
		}
	}
}
