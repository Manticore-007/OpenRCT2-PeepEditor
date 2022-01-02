import { debug } from "../helpers/logger";
import { isDevelopment, pluginVersion } from "../helpers/environment";


// Settings for the window
const windowId = "guest-editor-window";
const widgetLineHeight = 14;
const colourpickershirts = "guest-editor-tshirts";
const colourpickertrousers = "guest-editor-trousers";
const colourpickerballoons = "guest-editor-balloons";
const colourpickerhats = "guest-editor-hats";
const colourpickerumbrellas = "guest-editor-umbrellas";
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
const buttonStaff = "guest-editor-button-staff";


const windowColour: number = 19;
let widgetcolourshirts: number = windowColour;
let widgetcolourtrousers: number = windowColour;
let widgetcolourballoons: number = windowColour;
let widgetcolourhats: number = windowColour;
let widgetcolourumbrellas: number = windowColour;
let widgetLitteringChecked: boolean = false;
let widgetExplodeChecked: boolean = false;
let widgetLeavingPark: boolean = false;
let widgetSlowWalk: boolean = false;
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
let staffId: number = 0;
const colourStaff: number = windowColour;
let staffName: string = "no staff selected";


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
							<LabelWidget>{
								type: "label",
								x: 20,
								y: 78,
								width: 260,
								height: widgetLineHeight,
								text: `Name: ${staffName}`,
								isDisabled: false
							},
							<ButtonWidget>{
								name: buttonStaff,
								type: "button",
								x: 20,
								y: 98,
								width: 100,
								height: widgetLineHeight,
								text: "Freeze staff",
								isPressed: false,
								onClick: () => this.freezeStaff(),
							},
							<ColourPickerWidget>{
								type: "colourpicker",
								x: 130,
								y: 99,
								width: 100,
								height: widgetLineHeight,
								name: "setstaffcolour",
								tooltip: "Change staff colour",
								isDisabled: false,
								colour: colourStaff,
								onChange: (colour) => this.colourStaff(colour),
							},
							<ButtonWidget>{
								name: buttonStaff,
								type: "button",
								x: 20,
								y: 118,
								width: 100,
								height: widgetLineHeight,
								text: "Unfreeze staff",
								isPressed: false,
								onClick: () => this.unfreezeStaff(),
							},
						]
					},
					{
						image: { frameBase: 5221, frameCount: 8, frameDuration: 4, },
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
								name: colourpickershirts,
								tooltip: "Change guests shirts",
								isDisabled: false,
								colour: widgetcolourshirts,
								onChange: (colour: number) => this.SetColourShirt(colour),
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
								name: colourpickertrousers,
								tooltip: "Change guests trousers",
								isDisabled: false,
								colour: widgetcolourtrousers,
								onChange: (colour: number) => this.SetColourTrousers(colour),
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
								name: colourpickerballoons,
								tooltip: "Change guests balloons",
								isDisabled: false,
								colour: widgetcolourballoons,
								onChange: (colour: number) => this.SetColourBalloons(colour),
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
								name: colourpickerhats,
								tooltip: "Change guests hats",
								isDisabled: false,
								colour: widgetcolourhats,
								onChange: (colour: number) => this.SetColourHats(colour),
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
								name: colourpickerumbrellas,
								tooltip: "Change guests umbrellas",
								isDisabled: false,
								colour: widgetcolourumbrellas,
								onChange: (colour: number) => this.SetColourUmbrellas(colour),
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
								isChecked: widgetLitteringChecked,
								onChange: (isChecked: boolean) => this.LitterCheckbox(isChecked),
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
								onChange: (isChecked: boolean) => this.ExplodeCheckbox(isChecked),
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
								onChange: (isChecked: boolean) => this.LeaveCheckbox(isChecked),
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
								isChecked: widgetSlowWalk,
								onChange: (isChecked: boolean) => this.SlowWalkCheckbox(isChecked),
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
								onChange: (isChecked: boolean) => this.TrackingCheckbox(isChecked),
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
								onChange: (isChecked: boolean) => this.WavingCheckbox(isChecked),
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
								onChange: (isChecked: boolean) => this.PhotoCheckbox(isChecked),
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
								onChange: (isChecked: boolean) => this.PaintingCheckbox(isChecked),
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
								onChange: (isChecked: boolean) => this.WowCheckbox(isChecked),
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
								onChange: (isChecked: boolean) => this.HereWeAreCheckbox(isChecked),
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
								onChange: (isChecked: boolean) => this.IceCreamCheckbox(isChecked),
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
								onChange: (isChecked: boolean) => this.PizzaCheckbox(isChecked),
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
								onChange: (isChecked: boolean) => this.JoyCheckbox(isChecked),
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
								onChange: (isChecked: boolean) => this.AngryCheckbox(isChecked),
							},
						]
					},
					{
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
							/*
							<ButtonWidget>{
								type: "button",
								x: 20,
								y: 78,
								width: 100,
								height: widgetLineHeight,
								text: "Freeze guests",
								onClick: () => this.SetEnergy(guestsEnergy),
							},*/
						]
					},
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
								height: 70,
								text: "About",
							},
							<LabelWidget>{
								type: "label",
								x: 0,
								y: 85,
								width: 260,
								height: widgetLineHeight,
								textAlign: "centred",
								text: "My first plugin made by me, Manticore-007 \n Built with coaching from Basssiiie \n Based on his Proxy Pather Plugin",
							},
							<GroupBoxWidget>{
								type: "groupbox",
								x: 10,
								y: 140,
								width: 240,
								height: 40,
								text: "GitHub",
							},
							<LabelWidget>{
								type: "label",
								x: 0,
								y: 157,
								width: 260,
								height: widgetLineHeight,
								textAlign: "centred",
								text: "https://github.com/Manticore-007",
							},
						]
					}
				]
			});
		}
	}
	freezeStaff() {
		ui.activateTool({
			id: "cursor",
			cursor: "cross_hair",
			filter: ["entity"],
			onDown: e => {
				if (e.entityId) {
					const entity = map.getEntity(e.entityId);
					const staff = <Staff>entity;
					if (!entity || entity.type !== "staff") {
						ui.tool?.cancel();
						debug("invalid entity selected");
					}
					else {
						ui.tool?.cancel();
						debug(e.entityId.toString());
						debug(staff.name);
						staff.energy = 0;
						staffName = staff.name;

					}
					return staffId = e.entityId;
				}
				return staffId;
			}
		});
	}
	unfreezeStaff() {
		ui.activateTool({
			id: "cursor",
			cursor: "cross_hair",
			filter: ["entity"],
			onDown: e => {
				if (e.entityId) {
					const entity = map.getEntity(e.entityId);
					const staff = <Staff>entity;
					if (!entity || entity.type !== "staff") {
						ui.tool?.cancel();
						debug("invalid entity selected");
					}
					else {
						ui.tool?.cancel();
						debug(e.entityId.toString());
						debug(staff.name);
						staff.energy = 96;
						staffName = staff.name;
					}
					return staffId = e.entityId;
				}
				return staffId;
			}
		});
	}
	colourStaff(colour: number) {
		ui.activateTool({
			id: "cursor",
			cursor: "cross_hair",
			filter: ["entity"],
			onDown: e => {
				if (e.entityId) {
					const entity = map.getEntity(e.entityId);
					const staff = <Staff>entity;
					if (!entity || entity.type !== "staff") {
						ui.tool?.cancel();
						debug("invalid entity selected");
					}
					else {
						ui.tool?.cancel();
						debug(e.entityId.toString());
						debug(staff.name);
						staff.colour = colour;
						staffName = staff.name;
					}
					return staffId = e.entityId;
				}
				return staffId;
			}
		});
	}
	SetEnergy(energy: number) {
		const guest = map.getAllEntities("guest");
		guest.forEach(guest => {
			guest.energy = energy;
			guest.energyTarget = 0;
			energy = guestsEnergy;
		});
	}
	SetColourShirt(tshirtcolour: number) {
		const guest = map.getAllEntities("guest");
		guest.forEach(guest => {
			guest.tshirtColour = tshirtcolour;
			widgetcolourshirts = tshirtcolour;
		});
	}
	SetColourTrousers(trouserscolour: number) {
		const guest = map.getAllEntities("guest");
		guest.forEach(guest => {
			guest.trousersColour = trouserscolour;
			widgetcolourtrousers = trouserscolour;
		});
	}
	SetColourBalloons(balloonscolour: number) {
		const guest = map.getAllEntities("guest");
		guest.forEach(guest => {
			guest.balloonColour = balloonscolour;
			widgetcolourballoons = balloonscolour;
		});
	}
	SetColourHats(hatscolour: number) {
		const guest = map.getAllEntities("guest");
		guest.forEach(guest => {
			guest.hatColour = hatscolour;
			widgetcolourhats = hatscolour;
		});
	}
	SetColourUmbrellas(umbrellascolour: number) {
		const guest = map.getAllEntities("guest");
		guest.forEach(guest => {
			guest.umbrellaColour = umbrellascolour;
			widgetcolourumbrellas = umbrellascolour;
		});
	}
	LitterCheckbox(guestslittering: boolean) {
		const guest = map.getAllEntities("guest");
		guest.forEach(guest => {
			if (guest.getFlag("litter") === false) {
				guest.setFlag("litter", true);
				guestslittering = guest.getFlag("litter");
			}
			else guest.setFlag("litter", false);
			widgetLitteringChecked = guest.getFlag("litter");
		});
	}
	ExplodeCheckbox(guestsExploding: boolean) {
		const guest = map.getAllEntities("guest");
		guest.forEach(guest => {
			if (guest.getFlag("explode") === false) {
				guest.setFlag("explode", true);
				guestsExploding = guest.getFlag("explode");
			}
			else guest.setFlag("explode", false);
			widgetExplodeChecked = guest.getFlag("explode");
		});
	}
	LeaveCheckbox(guestsLeavingPark: boolean) {
		const guest = map.getAllEntities("guest");
		guest.forEach(guest => {
			if (guest.getFlag("leavingPark") === false) {
				guest.setFlag("leavingPark", true);
				guestsLeavingPark = guest.getFlag("leavingPark");
			}
			else guest.setFlag("leavingPark", false);
			widgetLeavingPark = guest.getFlag("leavingPark");
		});
	}
	SlowWalkCheckbox(guestsSlowWalk: boolean) {
		const guest = map.getAllEntities("guest");
		guest.forEach(guest => {
			if (guest.getFlag("slowWalk") === false) {
				guest.setFlag("slowWalk", true);
				guestsSlowWalk = guest.getFlag("slowWalk");
			}
			else guest.setFlag("slowWalk", false);
			widgetSlowWalk = guest.getFlag("slowWalk");
		});
	}
	TrackingCheckbox(guestTracking: boolean) {
		const guest = map.getAllEntities("guest");
		guest.forEach(guest => {
			if (guest.getFlag("tracking") === false) {
				guest.setFlag("tracking", true);
				guestTracking = guest.getFlag("tracking");
			}
			else guest.setFlag("tracking", false);
			widgetTracking = guest.getFlag("tracking");
		});
	}
	WavingCheckbox(guestsWaving: boolean) {
		const guest = map.getAllEntities("guest");
		guest.forEach(guest => {
			if (guest.getFlag("waving") === false) {
				guest.setFlag("waving", true);
				guestsWaving = guest.getFlag("waving");
			}
			else guest.setFlag("waving", false);
			widgetWaving = guest.getFlag("waving");
		});
	}
	PhotoCheckbox(guestsPhoto: boolean) {
		const guest = map.getAllEntities("guest");
		guest.forEach(guest => {
			if (guest.getFlag("photo") === false) {
				guest.setFlag("photo", true);
				guestsPhoto = guest.getFlag("photo");
			}
			else guest.setFlag("photo", false);
			widgetPhoto = guest.getFlag("photo");
		});
	}
	PaintingCheckbox(guestsPainting: boolean) {
		const guest = map.getAllEntities("guest");
		guest.forEach(guest => {
			if (guest.getFlag("painting") === false) {
				guest.setFlag("painting", true);
				guestsPainting = guest.getFlag("painting");
			}
			else guest.setFlag("painting", false);
			widgetPainting = guest.getFlag("painting");
		});
	}
	WowCheckbox(guestsWow: boolean) {
		const guest = map.getAllEntities("guest");
		guest.forEach(guest => {
			if (guest.getFlag("wow") === false) {
				guest.setFlag("wow", true);
				guestsWow = guest.getFlag("wow");
			}
			else guest.setFlag("wow", false);
			widgetWow = guest.getFlag("wow");
		});
	}
	HereWeAreCheckbox(guestsHereWeAre: boolean) {
		const guest = map.getAllEntities("guest");
		guest.forEach(guest => {
			if (guest.getFlag("hereWeAre") === false) {
				guest.setFlag("hereWeAre", true);
				guestsHereWeAre = guest.getFlag("hereWeAre");
			}
			else guest.setFlag("hereWeAre", false);
			widgetHereWeAre = guest.getFlag("hereWeAre");
		});
	}
	IceCreamCheckbox(guestsIceCream: boolean) {
		const guest = map.getAllEntities("guest");
		guest.forEach(guest => {
			if (guest.getFlag("iceCream") === false) {
				guest.setFlag("iceCream", true);
				guestsIceCream = guest.getFlag("iceCream");
			}
			else guest.setFlag("iceCream", false);
			widgetIceCream = guest.getFlag("iceCream");
		});
	}
	PizzaCheckbox(guestsPizza: boolean) {
		const guest = map.getAllEntities("guest");
		guest.forEach(guest => {
			if (guest.getFlag("pizza") === false) {
				guest.setFlag("pizza", true);
				guestsPizza = guest.getFlag("pizza");
			}
			else guest.setFlag("pizza", false);
			widgetPizza = guest.getFlag("pizza");
		});
	}
	JoyCheckbox(guestsJoy: boolean) {
		const guest = map.getAllEntities("guest");
		guest.forEach(guest => {
			if (guest.getFlag("joy") === false) {
				guest.setFlag("joy", true);
				guestsJoy = guest.getFlag("joy");
			}
			else guest.setFlag("joy", false);
			widgetJoy = guest.getFlag("joy");
		});
	}
	AngryCheckbox(guestsAngry: boolean) {
		const guest = map.getAllEntities("guest");
		guest.forEach(guest => {
			if (guest.getFlag("angry") === false) {
				guest.setFlag("angry", true);
				guestsAngry = guest.getFlag("angry");
			}
			else guest.setFlag("angry", false);
			widgetAngry = guest.getFlag("angry");
		});
	}
}
