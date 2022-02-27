
import { debug } from "../helpers/logger";
import { isDevelopment, pluginVersion } from "../helpers/environment";
import { SetColour, guestColourOptions } from "../functions/guests";


// Settings for the window
const windowId = "guest-editor-window";
const widgetLineHeight = 14;
const windowColour = 19;

const littering = "guest-editor-littering";
const explode = "guest-editor-explode";
const leavingPark = "guest-editor-leaving-park";
const slowWalk = "guest-editor-slow-walk";
const tracking = "guest-editor-tracking";
const waving = "guest-editor-waving";
const photo = "guest-editor-photo";
const painting = "guest-editor-painting";
const wow = "guest-editor-wow";
const hereweare = "guest-editor-here-we-are";
const iceCream = "guest-editor-ice-cream";
const pizza = "guest-editor-pizza";
const joy = "guest-editor-joy";
const angry = "guest-editor-angry";
const costumeDropdown = "guest-editor-dropdown-costume";
const stafftypeDropdown = "guest-editor-dropdown-stafftype";
const buttonPipette: string = "guest-editor-button-pipette";
const peepLabel: string = "guest-editor-staff-label";
const guestLabel: string = "guest-editor-guest-label";
const toolSelectPeep: string = "guest-editor-tool-select-staff";
const buttonLocateStaff: string = "guest-editor-button-locate-staff";
const buttonLocateGuest: string = "guest-editor-button-locate-guest";
const freeze: string = "guest-editor-checkbox-freeze-staff";
const viewport: string = "guest-editor-viewport";
const staffColourPicker: string = "guest-editor-staff-colour-picker";
const staffTypeLabel: string = "guest-editor-staff-type-label";
const costumeLabel: string = "guest-editor-costume-label";
const blackViewport: CoordsXY = {x: -9000, y: -9000};
const allGuests: string = "guest-editor-select-all-guests";


let widgetExplodeChecked: boolean = false;
let widgetLeavingPark: boolean = false;
let widgetSlowCheck: boolean = false;
let widgetTracking: boolean = false;
let widgetWaving: boolean = false;
let widgetPhoto: boolean = false;
let widgetPainting: boolean = false;
let widgetWow: boolean = false;
let widgetHereWeAre: boolean = false;
let widgetIceCream: boolean = false;
let widgetPizza: boolean = false;
let widgetJoy: boolean = false;
let widgetAngry: boolean = false;
const guestsEnergy: number = 0;
const peepName: string = "no staff selected";
const guestName: string = "no guest selected";
let toggle: boolean = false;
let toggleDisabled: boolean = true;
const coords: CoordsXYZ = { z: 0, y: 0, x: 0 }
let widgetFreeze: boolean = false;
let staffMember: Entity;
let energyStaff: number;
let idStaff: Staff;
let checkboxDisabled: boolean = true;
let colourPickerDisabled: boolean = true;
let update: (IDisposable | null) = null;
let toggleFreeze: boolean = false;
const staffTypeNumber: number = -1;
let selectedIndexCostume: number = -1;

export class PeepEditorWindow {
	/**
	 * Opens the window for the Peep Editor.
	 */

	open(): void {
		const window = ui.getWindow(windowId);
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
				onClose: () => {
					toggle = false
					toggleDisabled = true
					toggleFreeze = false
					checkboxDisabled = true
					colourPickerDisabled = true
					widgetFreeze = false
					ui.tool?.cancel()
				},
				classification: windowId,
				title: windowTitle,
				width: 260,
				height: 250,
				colours: [windowColour, windowColour],
				tabs: [
					{
						image: 5628, //staff
						widgets: [
							<LabelWidget>{
								type: "label",
								x: 0,
								y: 232,
								width: 260,
								height: widgetLineHeight,
								textAlign: "centred",
								text: "Manticore-007",
								tooltip: "Powered by Basssiiie",
								isDisabled: true
							},
							<GroupBoxWidget>{
								type: "groupbox",
								x: 10,
								y: 55,
								width: 240,
								height: 170,
								text: "Staff",
							},
							<GroupBoxWidget>{
								type: "groupbox",
								x: 10,
								y: 95,
								width: 240,
								height: 130,
							},
							<LabelWidget>{
								name: peepLabel,
								type: "label",
								x: 20,
								y: 73,
								width: 260,
								height: widgetLineHeight,
								text: `Name: {RED}${peepName}`,
								isDisabled: false
							},
							<LabelWidget>{
								name: staffTypeLabel,
								type: "label",
								x: 20,
								y: 110,
								width: 140,
								height: widgetLineHeight,
								text: `Type:`,
								isDisabled: true,
							},
							<DropdownWidget>{
								name: stafftypeDropdown,
								type: "dropdown",
								x: 75,
								y: 110,
								width: 95,
								height: widgetLineHeight,
								items: ["Handyman", "Mechanic", "Security Guard", "Entertainer"],
								selectedIndex: staffTypeNumber,
								isDisabled: true,
								onChange: (number) => setStaffType(number)
							},
							<LabelWidget>{
								name: costumeLabel,
								type: "label",
								x: 20,
								y: 125,
								width: 140,
								height: widgetLineHeight,
								text: `Costume:`,
								isDisabled: true,
							},
							<DropdownWidget>{
								name: costumeDropdown,
								type: "dropdown",
								x: 75,
								y: 125,
								width: 95,
								height: widgetLineHeight,
								items: [
									"Panda",				//0
									"Tiger",				//1
									"Elephant",				//2
									"Gladiator",			//3
									"Gorilla",				//4
									"Snowman",				//5
									"Knight",				//6
									"Astronaut",			//7
									"Bandit",				//8
									"Sheriff",				//9
									"Pirate",				//10
									"Icecream",				//11
									"Chips",				//12
									"Burger",				//13
									"Soda can",				//14
									"Balloon",				//15
									"Candyfloss",			//16
									"Umbrella",				//17
									"Pizza",				//18
									"Security",				//19
									"Popcorn",				//20
									"Arms crossed",			//21
									"Head down",			//22
									"Nauseous",				//23
									"Very nauseous",		//24
									"Needs toilet",			//25
									"Hat",					//26
									"Hotdog",				//27
									"Tentacle",				//28
									"Toffee apple",			//29
									"Donut",				//30
									"Coffee",				//31
									"Nuggets",				//32
									"Lemonade",				//33
									"Walking",				//34
									"Pretzel",				//35
									"Sunglasses",			//36
									"Sujongkwa",			//37
									"Juice",				//38
									"Funnel cake",			//39
									"Noodles",				//40
									"Sausage",				//41
									"Soup",					//42
									"Sandwich",				//43
									"Guest",				//252
									"Handyman",				//253
									"Mechanic",				//254
									"Security guard",		//255
								],
								selectedIndex: selectedIndexCostume,
								isDisabled: true,
								onChange: (number) => setCostume(number)
							},
							<ButtonWidget>{
								name: buttonPipette,
								type: "button",
								border: true,
								x: 185,
								y: 165,
								width: 24,
								height: 24,
								image: 29467,	//pipette
								isPressed: toggle,
								onClick: () => selectPeep("staff")
							},
							<ButtonWidget>{
								name: buttonLocateStaff,
								type: "button",
								border: true,
								x: 211,
								y: 165,
								width: 24,
								height: 24,
								image: 5167, //locate icon
								isPressed: false,
								isDisabled: toggleDisabled,
								onClick: () => gotoStaff()
							},
							<ButtonWidget>{
								name: freeze,
								type: "button",
								border: true,
								x: 185,
								y: 191,
								width: 24,
								height: 24,
								image: 5182, //red/green flag
								isPressed: toggleFreeze,
								isDisabled: toggleDisabled,
								onClick: () => buttonFreeze()
							},
							<ColourPickerWidget>{
								type: "colourpicker",
								x: 220,
								y: 73,
								width: 100,
								height: widgetLineHeight,
								name: staffColourPicker,
								tooltip: "Change staff colour",
								isDisabled: colourPickerDisabled,
								colour: 0,
								onChange: (colour) => staffColourSet(colour),
							},
							<ViewportWidget>{
								type: "viewport",
								name: viewport,
								x: 185,
								y: 110,
								width: 50,
								height: 50,
								viewport: {
									left: blackViewport.x,
									top: blackViewport.y,
								}
							},
						]
					},
					/*{
						image: {
							frameBase: 5568,
							frameCount: 8,
							frameDuration: 4,
						}, //group of guests
						widgets: [
							<LabelWidget>{
								type: "label",
								x: 0,
								y: 232,
								width: 260,
								height: widgetLineHeight,
								textAlign: "centred",
								text: "Manticore-007",
								tooltip: "Powered by Basssiiie",
								isDisabled: true
							},
							<GroupBoxWidget>{
								type: "groupbox",
								x: 10,
								y: 55,
								width: 240,
								height: 170,
								text: "Guests",
							},
							<GroupBoxWidget>{
								type: "groupbox",
								x: 10,
								y: 95,
								width: 240,
								height: 130,
							},
							<LabelWidget>{
								name: guestLabel,
								type: "label",
								x: 20,
								y: 73,
								width: 260,
								height: widgetLineHeight,
								text: `Name: {RED}${guestName}`,
								isDisabled: false
							},
							<ButtonWidget>{
								name: buttonPipette,
								type: "button",
								border: true,
								x: 185,
								y: 165,
								width: 24,
								height: 24,
								image: 29467,	//pipette
								isPressed: toggle,
								onClick: () => selectPeep("guest")
							},
							<ButtonWidget>{
								name: buttonLocateGuest,
								type: "button",
								border: true,
								x: 211,
								y: 165,
								width: 24,
								height: 24,
								image: 5167, //locate icon
								isPressed: false,
								isDisabled: false,
								onClick: () => gotoPeep("guest")
							},
							<ButtonWidget>{
								name: freeze,
								type: "button",
								border: true,
								x: 185,
								y: 191,
								width: 24,
								height: 24,
								image: 5182, //red/green flag
								isPressed: toggleFreeze,
								isDisabled: false,
								onClick: () => buttonFreeze()
							},
							<ButtonWidget>{
								name: allGuests,
								type: "button",
								border: true,
								x: 211,
								y: 191,
								width: 24,
								height: 24,
								image: 5193, //group of peeps
								isPressed: false,
								isDisabled: false,
								onClick: () => buttonAllGuests()
							},
							<ViewportWidget>{
								type: "viewport",
								name: viewport,
								x: 185,
								y: 110,
								width: 50,
								height: 50,
								viewport: {
									left: blackViewport.x,
									top: blackViewport.y,
								},
							},
						]
					},*/
					{
						image: { frameBase: 5221, frameCount: 8, frameDuration: 4, }, //paintbrush
						widgets: [
							<LabelWidget>{
								type: "label",
								x: 0,
								y: 232,
								width: 260,
								height: widgetLineHeight,
								textAlign: "centred",
								text: "Manticore-007",
								tooltip: "Powered by Basssiiie",
								isDisabled: true
							},
							<GroupBoxWidget>{
								type: "groupbox",
								x: 10,
								y: 55,
								width: 240,
								height: 170,
								text: "Colours",
							},
							<ColourPickerWidget>{
								type: "colourpicker",
								x: 20,
								y: 80,
								width: 100,
								height: widgetLineHeight,
								name: guestColourOptions.tshirtColour.id,
								tooltip: "Change guests shirts",
								isDisabled: false,
								colour: guestColourOptions.tshirtColour.colour,
								onChange: (colour: number) => SetColour(colour, "tshirtColour"),
							},
							<LabelWidget>{
								type: "label",
								x: 40,
								y: 80,
								width: 275,
								height: widgetLineHeight,
								text: "Shirts",
								isDisabled: false
							},
							<ColourPickerWidget>{
								type: "colourpicker",
								x: 20,
								y: 100,
								width: 100,
								height: widgetLineHeight,
								name: guestColourOptions.trousersColour.id,
								tooltip: "Change guests trousers",
								isDisabled: false,
								colour: guestColourOptions.trousersColour.colour,
								onChange: (colour: number) => SetColour(colour, "trousersColour"),
							},
							<LabelWidget>{
								type: "label",
								x: 40,
								y: 100,
								width: 275,
								height: widgetLineHeight,
								text: "Trousers",
								isDisabled: false
							},
							<ColourPickerWidget>{
								type: "colourpicker",
								x: 20,
								y: 120,
								width: 100,
								height: widgetLineHeight,
								name: guestColourOptions.balloonColour.id,
								tooltip: "Change guests balloons",
								isDisabled: false,
								colour: guestColourOptions.balloonColour.colour,
								onChange: (colour: number) => SetColour(colour, "balloonColour"),
							},
							<LabelWidget>{
								type: "label",
								x: 40,
								y: 120,
								width: 275,
								height: widgetLineHeight,
								text: "Balloons",
								isDisabled: false
							},
							<ColourPickerWidget>{
								type: "colourpicker",
								x: 20,
								y: 140,
								width: 100,
								height: widgetLineHeight,
								name: guestColourOptions.hatColour.id,
								tooltip: "Change guests hats",
								isDisabled: false,
								colour: guestColourOptions.hatColour.colour,
								onChange: (colour: number) => SetColour(colour, "hatColour"),
							},
							<LabelWidget>{
								type: "label",
								x: 40,
								y: 140,
								width: 275,
								height: widgetLineHeight,
								text: "Hats",
								isDisabled: false
							},
							<ColourPickerWidget>{
								type: "colourpicker",
								x: 20,
								y: 160,
								width: 100,
								height: widgetLineHeight,
								name: guestColourOptions.umbrellaColour.id,
								tooltip: "Change guests umbrellas",
								isDisabled: false,
								colour: guestColourOptions.umbrellaColour.colour,
								onChange: (colour: number) => SetColour(colour, "umbrellaColour"),
							},
							<LabelWidget>{
								type: "label",
								x: 40,
								y: 160,
								width: 275,
								height: widgetLineHeight,
								text: "Umbrellas",
								isDisabled: false
							},
						],
					},
					{
						image: {
							frameBase: 5318,	//pointing hand
							frameCount: 8,
							frameDuration: 2,
						},
						widgets: [
							<LabelWidget>{
								type: "label",
								x: 0,
								y: 232,
								width: 260,
								height: widgetLineHeight,
								textAlign: "centred",
								text: "Manticore-007",
								tooltip: "Powered by Basssiiie",
								isDisabled: true
							},
							<GroupBoxWidget>{
								type: "groupbox",
								x: 10,
								y: 55,
								width: 240,
								height: 170,
								text: "Flags",
							},
							<CheckboxWidget>{
								name: littering,
								type: "checkbox",
								x: 20,
								y: 78,
								width: 100,
								height: 15,
								text: "Litter",
								tooltip: "Lets guests behave like pigs",
								isChecked: false,
								onChange: () => checkbox("litter", littering),
							},
							<CheckboxWidget>{
								name: explode,
								type: "checkbox",
								x: 20,
								y: 98,
								width: 100,
								height: 15,
								text: "Explode",
								tooltip: "Execute Order 66",
								isChecked: widgetExplodeChecked,
								onChange: () => checkbox("explode", explode),
							},
							<CheckboxWidget>{
								name: leavingPark,
								type: "checkbox",
								x: 20,
								y: 118,
								width: 100,
								height: 15,
								text: "Leave park",
								tooltip: "Evacuate park",
								isChecked: widgetLeavingPark,
								onChange: () => checkbox("leavingPark", leavingPark),
							},
							<CheckboxWidget>{
								name: slowWalk,
								type: "checkbox",
								x: 20,
								y: 138,
								width: 100,
								height: 15,
								text: "Slow walk",
								tooltip: "Give the guests the Iron Boots from 'Ocarina of Time'",
								isChecked: false,
								onChange: () => checkbox("slowWalk", slowWalk),
							},
							<CheckboxWidget>{
								name: tracking,
								type: "checkbox",
								x: 20,
								y: 158,
								width: 100,
								height: 15,
								text: "Track your guests",
								tooltip: "Vaccinate all of your guests with tracking chips",
								isChecked: widgetTracking,
								onChange: () => checkbox("tracking", tracking),
							},
							<CheckboxWidget>{
								name: waving,
								type: "checkbox",
								x: 20,
								y: 178,
								width: 100,
								height: 15,
								text: "Wave",
								tooltip: "'Hey Everyone'",
								isChecked: widgetWaving,
								onChange: () => checkbox("waving", waving),
							},
							<CheckboxWidget>{
								name: photo,
								type: "checkbox",
								x: 20,
								y: 198,
								width: 100,
								height: 15,
								text: "Make photos",
								tooltip: "Guests documenting their good time at your park",
								isChecked: widgetPhoto,
								onChange: () => checkbox("photo", photo),
							},
							<CheckboxWidget>{
								name: painting,
								type: "checkbox",
								x: 150,
								y: 78,
								width: 100,
								height: 15,
								text: "Paint",
								tooltip: "Guests painting happy accidents",
								isChecked: widgetPainting,
								onChange: () => checkbox("painting", painting),
							},
							<CheckboxWidget>{
								name: wow,
								type: "checkbox",
								x: 150,
								y: 98,
								width: 100,
								height: 15,
								text: "Wow",
								tooltip: "Guests think they are Owen Wilson",
								isChecked: widgetWow,
								onChange: () => checkbox("wow", wow),
							},
							<CheckboxWidget>{
								name: hereweare,
								type: "checkbox",
								x: 150,
								y: 118,
								width: 100,
								height: 15,
								text: "Here we are",
								tooltip: "Guests think they are working for CNN",
								isChecked: widgetHereWeAre,
								onChange: () => checkbox("hereWeAre", hereweare),
							},
							<CheckboxWidget>{
								name: iceCream,
								type: "checkbox",
								x: 150,
								y: 138,
								width: 100,
								height: 15,
								text: "Ice cream",
								tooltip: "Luitenant Dan, ice cream!",
								isChecked: widgetIceCream,
								onChange: () => checkbox("iceCream", iceCream),
							},
							<CheckboxWidget>{
								name: pizza,
								type: "checkbox",
								x: 150,
								y: 158,
								width: 100,
								height: 15,
								text: "Pizza",
								tooltip: "'A cheese pizza, just for me'",
								isChecked: widgetPizza,
								onChange: () => checkbox("pizza", pizza),
							},
							<CheckboxWidget>{
								name: joy,
								type: "checkbox",
								x: 150,
								y: 178,
								width: 100,
								height: 15,
								text: "Joy",
								tooltip: "Press A to jump",
								isChecked: widgetJoy,
								onChange: () => checkbox("joy", joy),
							},
							<CheckboxWidget>{
								name: angry,
								type: "checkbox",
								x: 150,
								y: 198,
								width: 100,
								height: 15,
								text: "Angry",
								tooltip: "Turn the guests into Karens",
								isChecked: widgetAngry,
								onChange: () => checkbox("angry", angry),
							},
						]
					},
					/*{
						image: {
							frameBase: 5245,	// rising graph
							frameCount: 8,
							frameDuration: 4,
						},
						widgets: [
							<LabelWidget>{
								type: "label",
								x: 0,
								y: 232,
								width: 260,
								height: widgetLineHeight,
								textAlign: "centred",
								text: "Manticore-007",
								tooltip: "Powered by Basssiiie",
								isDisabled: true
							},
							<GroupBoxWidget>{
								type: "groupbox",
								x: 10,
								y: 55,
								width: 240,
								height: 170,
								text: "Conditions",
							},
							<LabelWidget>{
								type: "label",
								x: 0,
								y: 140,
								width: 260,
								height: widgetLineHeight,
								textAlign: "centred",
								text: "Not yet available",
								isDisabled: true
							},
						]
					},*/
					{
						image: {
							frameBase: 5367,	//rotating info box
							frameCount: 8,
							frameDuration: 4,
						},
						widgets: [
							<LabelWidget>{
								type: "label",
								x: 0,
								y: 232,
								width: 260,
								height: widgetLineHeight,
								textAlign: "centred",
								text: "Manticore-007",
								tooltip: "Powered by Basssiiie",
								isDisabled: true
							},
							<GroupBoxWidget>{
								type: "groupbox",
								x: 10,
								y: 55,
								width: 240,
								height: 110,
								text: "About",
							},
							<LabelWidget>{
								type: "label",
								x: 0,
								y: 105,
								width: 260,
								height: widgetLineHeight,
								textAlign: "centred",
								text: "First plugin made by me, Manticore-007 \n Built with coaching from Basssiiie \n Based on his Proxy Pather Plugin \n \n Special thank you to Smitty \n for introducing me to refactoring and DRY",
							},
							<GroupBoxWidget>{
								type: "groupbox",
								x: 10,
								y: 185,
								width: 240,
								height: 40,
								text: "GitHub",
							},
							<LabelWidget>{
								type: "label",
								x: 0,
								y: 202,
								width: 260,
								height: widgetLineHeight,
								textAlign: "centred",
								text: "https://github.com/Manticore-007",
							},
						]
					},
				]
			});
		}
	}
	SetEnergy(energy: number) {
		const guest = map.getAllEntities("guest");
		guest.forEach(guest => {
			guest.energy = energy;
			guest.energyTarget = 0;
			energy = guestsEnergy;
		});
	}
	
	
}
function checkbox(flag: PeepFlags, name: string) {
	const win = ui.getWindow(windowId);
	const widget = win.findWidget<CheckboxWidget>(name);
	const guest = map.getAllEntities("guest");
	guest.forEach(guest => {
		if (guest.getFlag(flag) === false) {
			guest.setFlag(flag, true);
			widget.isChecked = true;
		}
		else {
			guest.setFlag(flag, false);
			widget.isChecked = false;;
		}
	});
}
function setPeepName(name: string) {
	const win = ui.getWindow(windowId);
	if (win) {
		const label = win.findWidget<LabelWidget>(peepLabel);
		label.text = `Name: {WHITE}${name}`;
	}
}
function getStaffType(type: string){
	const win = ui.getWindow(windowId);
	const staffTypeNumber = [
		"handyman", "mechanic", "security", "entertainer"
	]
	if (win) {
		const dropdown = win.findWidget<DropdownWidget>(stafftypeDropdown);
		const dropdownCostume = win.findWidget<DropdownWidget>(costumeDropdown);
		const typeLabel = win.findWidget<LabelWidget>(staffTypeLabel);
		const staffcostumeLabel = win.findWidget<LabelWidget>(costumeLabel);
		if (dropdown.items !== undefined){
		dropdown.selectedIndex = staffTypeNumber.indexOf(type);
		}
		dropdownCostume.isDisabled = false,
		dropdown.isDisabled = false;
		typeLabel.isDisabled = false;
		staffcostumeLabel.isDisabled = false;
		
	}
}
function setStaffType(number: number){
	const staffTypeList: StaffType[] = ["handyman", "mechanic", "security", "entertainer"]
		idStaff.staffType = staffTypeList[number]	
}
function getCostume(number: number) {
	const win = ui.getWindow(windowId);
	const dropdownCostume = win.findWidget<DropdownWidget>(costumeDropdown);
		if (number > 251) {
			selectedIndexCostume = number - 208
			dropdownCostume.selectedIndex = selectedIndexCostume
		}
		else {
			selectedIndexCostume = number
			dropdownCostume.selectedIndex = selectedIndexCostume
		}
}
function setCostume(number: number) {
	const win = ui.getWindow(windowId);
	const dropdownCostume = win.findWidget<DropdownWidget>(costumeDropdown);
	if (number === 0 && idStaff.staffType != "entertainer"){
		selectedIndexCostume = -1;
		dropdownCostume.selectedIndex = selectedIndexCostume
		return
	}
	else {
		if (number > 43) {
			selectedIndexCostume = number + 208
			idStaff.costume = selectedIndexCostume
		}
		else {
			selectedIndexCostume = number
			idStaff.costume = selectedIndexCostume
		}
	}
}
function buttonFreeze() {
	const win = ui.getWindow(windowId);
	if (win) {
		const button = win.findWidget<ButtonWidget>(freeze);
		if (energyStaff === 0) {
			energyStaff = 96			
			idStaff.energy = energyStaff
			toggleFreeze = false
			button.isPressed = toggleFreeze
		}
		else {
			energyStaff = 0
			idStaff.energy = energyStaff
			toggleFreeze = true
			button.isPressed = toggleFreeze
		}
	}
}
function staffColourSet(colour: number){
	idStaff.colour = colour
}
function gotoStaff() {
	coords.x = staffMember.x
	coords.y = staffMember.y
	coords.z = staffMember.z
	ui.mainViewport.scrollTo(coords)
}
function selectPeep(peepType: EntityType) {
	const window = ui.getWindow(windowId);
	const buttonPicker = window.findWidget<ButtonWidget>(buttonPipette);
	const buttonLocate = window.findWidget<ButtonWidget>(buttonLocateStaff);
	const buttonFreeze = window.findWidget<ButtonWidget>(freeze);
	const staffColourCurrent = window.findWidget<ColourPickerWidget>(staffColourPicker);
	const pluginViewport = window.findWidget<ViewportWidget>(viewport);
	const dropdownType = window.findWidget<DropdownWidget>(stafftypeDropdown);
	const dropdownCostume = window.findWidget<DropdownWidget>(costumeDropdown);
	const label = window.findWidget<LabelWidget>(staffTypeLabel);
	if (!window) {
		return
	}
	else {
		if (toggle !== false) {
			toggle = false
			buttonPicker.isPressed = toggle
			ui.tool?.cancel();
		}
		else {
			toggle = true
			buttonPicker.isPressed = toggle
			ui.activateTool({
				id: toolSelectPeep,
				cursor: "cross_hair",
				filter: ["entity"],
				onDown: e => {
					if (e.entityId !== undefined) {
						console.log(`Entity ID: ${e.entityId}`)
						const entity = map.getEntity(e.entityId);
						const staff = <Staff>entity;
						idStaff = staff;
						if (!entity || entity.type !== peepType) {
							dropdownType.selectedIndex = -1;
							toggle = false							
							toggleDisabled = true,
							toggleFreeze = false,
							colourPickerDisabled = true,
							label.isDisabled = true,
							dropdownType.isDisabled = true,
							dropdownCostume.isDisabled = true,
							buttonPicker.isPressed = toggle,
							buttonLocate.isDisabled = toggleDisabled,
							buttonFreeze.isDisabled = toggleDisabled,
							buttonFreeze.isPressed = toggleFreeze,
							staffColourCurrent.isDisabled = colourPickerDisabled;
							if (update !== null) {
								update.dispose();
								update = null;
							}
							pluginViewport.viewport?.moveTo(blackViewport);
							ui.tool?.cancel();
							ui.showError(`You have to`, `select ${peepType}`)
							setPeepName(`{RED}No ${peepType} selected`)
						}
						else {
							if (staff.energy !== 0) {
								buttonFreeze.isPressed = false
							}
							else {
								buttonFreeze.isPressed = true
							}
							ui.tool?.cancel(),
								toggle = false,
								toggleDisabled = false,
								colourPickerDisabled = false,
								staffColourCurrent.isDisabled = colourPickerDisabled,
								staffColourCurrent.colour = staff.colour,
								buttonLocate.isDisabled = toggleDisabled,
								buttonPicker.isPressed = toggle,
								buttonFreeze.isDisabled = toggleDisabled,
								getCostume(staff.costume);
								getStaffType(staff.staffType);
								setPeepName(staff.name);
									const pluginViewport = window.findWidget<ViewportWidget>(viewport);
									update = context.subscribe("interval.tick", () => pluginViewport.viewport?.moveTo({x: staff.x, y: staff.y, z: staff.z}));
						}
						return energyStaff = staff.energy, staffMember = entity
					}
					return
				},
			})
		}
	}
}