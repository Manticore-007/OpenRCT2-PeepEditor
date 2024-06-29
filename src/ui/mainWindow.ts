
/// <reference path="../../lib/openrct2.d.ts" />

import { button, horizontal, label, tab, tabwindow, vertical, viewport, toggle, twoway, compute, Colour, window, groupbox, spinner, dropdown, textbox, colourPicker, graphics, checkbox, store, WidgetCreator, FlexiblePosition, Parsed, Bindable, ElementVisibility } from "openrct2-flexui";
import { togglePeepPicker } from "../actions/peepPicker";
import { locate } from "../actions/peepLocator";
import { model } from "../viewmodel/peepViewModel";
import { freezePeepExecuteArgs } from "../actions/peepFreezer";
import { namePeepExecuteArgs } from "../actions/peepNamer";
import { isDevelopment, pluginVersion } from "../helpers/environment";
import { removePeepExecuteArgs } from "../actions/peepRemover";
import { debug } from "../helpers/logger";
import { movePeepExecuteArgs } from "../actions/peepMover";
import { speedPeepExecuteArgs } from "../actions/peepSpeed";
import { colourPeepExecuteArgs } from "../actions/peepColour";
import { colourList } from "../helpers/colours";
import { customImageFor } from "../helpers/customImages";
import { staffType, staffTypeList } from "../helpers/staffTypes";
import { costumeList } from "../helpers/costumes";
import { animationList } from "../helpers/animations";
import { staffTypeExecuteArgs } from "../actions/staffSetType";
import { staffCostumeExecuteArgs } from "../actions/staffSetCostume";
import { animationPeepExecuteArgs } from "../actions/peepAnimation";
import { animationFramePeepExecuteArgs } from "../actions/peepAnimationFrame";
import { staffOrdersExecuteArgs } from "../actions/staffSetOrders";
import { guestFlagsExecuteArgs } from "../actions/guestFlags";
import { colourPogressBar, percentage, progressBar } from "../helpers/progressBar";
import { guestHappinessExecuteArgs } from "../actions/guestHappiness";
import { guestHungerExecuteArgs } from "../actions/guestHunger";
import { guestThirstExecuteArgs } from "../actions/guestThirst";
import { guestNauseaExecuteArgs } from "../actions/guestNausea";
import { guestToiletExecuteArgs } from "../actions/guestToilet";
import { guestMassExecuteArgs } from "../actions/guestMass";
import { ParkRide, getAllRides } from "../objects/parkRides";
import { guestItemTypeList } from "../helpers/guestItemTypes";
import { guestItemRemoveExecuteArgs } from "../actions/guestItemRemove";

const securityOrders = store<boolean>(true);
const entertainerOrders = store<boolean>(true);

const pointingFingerIcon: ImageAnimation = { frameBase: 5318, frameCount: 8, frameDuration: 2, };
const infoIcon: ImageAnimation = { frameBase: 5367, frameCount: 8, frameDuration: 4, };
const paintIcon: ImageAnimation = { frameBase: 5221, frameCount: 8, frameDuration: 4, };
const mapIcon: ImageAnimation = { frameBase: 5192, frameCount: 1, frameDuration: 4, offset: { x: 4, y: 1 }};
const lensIcon: ImageAnimation = {frameBase: 29401, frameCount: 1, frameDuration: 4, offset: {x: 4, y: 1}};

const deleteIcon: number = 5165;
const locateIcon: number = 5167;
const nameIcon: number = 5168;
const flagsIcon: number = 5182;
//const allGuestsIcon: number = 5193;
const itemsIcon: number = 5326;
const moodIcon: number = 5288;

const rideList = store<ParkRide[]>([]);
const selectedRide = store<[ParkRide, number] | null>(null);

rideList.subscribe(r => {
	let selection: [ParkRide, number] | null = null;
	if (r.length > 0)
	{
		const previous = selectedRide.get();
		const selectedIdx = (previous && previous[1] < r.length) ? previous[1] : 0;
		selection = [ r[selectedIdx], selectedIdx ];
	}
	selectedRide.set(selection);
})

rideList.set(getAllRides());
model._rideId.set(rideList.get()[0]._id)

let multiplier: number = 1;
let hasItemArray: boolean[] = []

const staticControls = [
	toggle({
		width: 24,
		height: 24,
		image: "eyedropper",
		tooltip: "Select a peep a the map",
		isPressed: twoway(model._isPicking),
		padding: {top: 1},
		onChange: pressed => togglePeepPicker(pressed, p =>
		{
			model._select(p); model._tabImage(p);
			model._name.set(p.name); model._availableAnimations.set(p.availableAnimations);
			if (p.type === "staff") {
				const staff = <Staff>p;
				model._availableCostumes.set(staff.availableCostumes)
			}
		},
			() => model._isPicking.set(false))
	}),
	toggle({
		height: 24,
		width: 24,
		image: flagsIcon,
		tooltip: "Freeze the selected peep in place",
		disabled: compute(model._isStaff, s => !s),
		isPressed: model._isFrozen,
		padding: {top: 1},
		onChange: (pressed) => {
			const peep = model._selectedPeep.get();
			if (peep !== undefined)
			context.executeAction("pe-freezepeep", freezePeepExecuteArgs(peep.id, pressed));
		}
	}),
	button({
		height: 24,
		width: 24,
		image: nameIcon,
		tooltip: "Give the selected peep a new name, even a longer name than usual",
		disabled: model._isPeepSelected,
		padding: {top: 1},
		onClick: () => {
			const peep = model._selectedPeep.get();
			if (peep !== undefined)
				ui.showTextInput({
					title: textInputTitle(peep),
					description: peepTypeQuery(),
					initialValue: `${peep.name}`,
					callback: text => {
						model._name.set(text);
						context.executeAction("pe-namepeep", namePeepExecuteArgs(peep.id, text));
					},
				})
		}
	}),
	button({
		height: 24,
		width: 24,
		image: locateIcon,
		tooltip: "Focus the main viewport on the selected peep",
		disabled: model._isPeepSelected,
		padding: {top: 1},
		onClick: () => {
			const peep = model._selectedPeep.get();
			if (peep) locate(peep);
		}
	}),
	button({
		height: 24,
		width: 24,
		image: deleteIcon,
		tooltip: "Remove the selected peep from existence",
		disabled: model._isPeepSelected,
		padding: {top: 1},
		onClick: () => {
			const peep = model._selectedPeep.get();
			if (peep !== undefined)
				openWindowRemovePeep(peep);
		}
	}),
	// button({
	// 	height: 24,
	// 	width: 24,
	// 	image: allGuestsIcon,
	// 	tooltip: "Select all guests on the map",
	// 	padding: {top: 1},
	// })
]

export const windowPeepEditor = tabwindow({
	title: model._name,
	width: 260,
	height: 230,
	colours: [Colour.DarkYellow, Colour.DarkYellow, Colour.DarkYellow],
	padding: 5,
	onTabChange: () => ui.tool?.cancel(),
	onUpdate: () => {
		const peep = model._selectedPeep.get();
		const guest = <Guest>peep;
		if (peep !== undefined) {
			if (peep.peepType !== "guest" && peep.peepType !== "staff") {
				ui.showError("Peep no longer", "available");
				model._reset();
			}
			else{
				hasItemArray = [];
				model._animation.set(peep.animation);
				model._animationFrame.set(peep.animationOffset);
				model._animationLength.set(peep.animationLength);
				if (peep.peepType === "guest")
				guestItemTypeList.forEach(item => {
					hasItemArray.push(guest.hasItem({type: item}));
				})
				model._hasItem.set(hasItemArray);
			}
		}
	},
	onOpen: () => model._open(),
	onClose: () => {
		ui.tool?.cancel();
		model._reset();
		model._dispose();
		multiplier = 1;
	},
	tabs: [
		tab({ //main tab
			image: lensIcon,
			width: { value: 260, max: 10_000 },
			height: { value: 230, max: 10_000 },
			content: [
				horizontal([
					viewport({
						padding: 0,
						target: compute(model._selectedPeep, p => (p) ? p.id : null)
					}),
					vertical({
						content: staticControls
					})
				]),
				label({
					text: "{BLACK}Manticore-007 © 2022-2024",
					padding: [-5, 0, 10, 0],
					alignment: "centred",
					height: 0
				})
			]
		}),
		tab({ //location
			image: mapIcon,
			height: "auto",
			spacing: 2,
			content: [
				horizontal([
					groupbox({
						text: "Kinematics",
						spacing: 0,
						content: [
							label({
								text: "Here you can set a peep's position on the map",
								alignment: "centred",
								visibility: compute(model._isPeepSelected, p => p ? "visible" : "none"),
							}),
							horizontal([
								label({
									text: "X position:",
									height: 13,
									padding: {top: 1, bottom: 1, left: 10},
									disabled: compute(model._isFrozen, f => !f),
									visibility: compute(model._isPeepSelected, p => !p ? "visible" : "none"),
								}),
								spinner({
									minimum: 0,
									value: model._x,
									height: 13,
									width: "55%",
									padding: {top: 1, right: 10,  bottom: 1},
									disabled: compute(model._isFrozen, f => !f),
									disabledMessage: "Not available",
									visibility: compute(model._isPeepSelected, p => !p ? "visible" : "none"),
									step: 1,
									onChange: (_, adjustment: number) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined)
										context.executeAction("pe-movepeep", movePeepExecuteArgs(peep.id, "x", (adjustment*multiplier)));
									}
								})
							]),
							horizontal([
								label({
									text: "Y position:",
									height: 13,
									padding: {top: 1, bottom: 1, left: 10},
									disabled: compute(model._isFrozen, f => !f),
									visibility: compute(model._isPeepSelected, p => !p ? "visible" : "none"),
								}),
								spinner({
									minimum: 0,
									value: model._y,
									height: 13,
									width: "55%",
									padding: {top: 1, right: 10,  bottom: 1},
									disabled: compute(model._isFrozen, f => !f),
									disabledMessage: "Not available",
									visibility: compute(model._isPeepSelected, p => !p ? "visible" : "none"),
									step: 1,
									onChange: (_, adjustment: number) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined)
										context.executeAction("pe-movepeep", movePeepExecuteArgs(peep.id, "y", (adjustment*multiplier)));
									}
								})
							]),
							horizontal([
								label({
									text: "Z position:",
									height: 13,
									padding: {top: 1, bottom: 1, left: 10},
									disabled: compute(model._isFrozen, f => !f),
									visibility: compute(model._isPeepSelected, p => !p ? "visible" : "none"),
								}),
								spinner({
									minimum: 0,
									value: model._z,
									height: 13,
									width: "55%",
									padding: {top: 1, right: 10,  bottom: 1},
									disabled: compute(model._isFrozen, f => !f),
									disabledMessage: "Not available",
									visibility: compute(model._isPeepSelected, p => !p ? "visible" : "none"),
									step: 1,
									onChange: (_, adjustment: number) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined)
										context.executeAction("pe-movepeep", movePeepExecuteArgs(peep.id, "z", (adjustment*multiplier)));
									}
								})
							]),
							horizontal([
								label({
									text: "Speed:",
									height: 13,
									padding: {top: 10, bottom: 5, left: 10},
									disabled: compute(model._isStaff, s => !s),
									visibility: compute(model._isPeepSelected, p => !p ? "visible" : "none"),
								}),
								spinner({
									minimum: 0,
									maximum: 255,
									wrapMode: "clamp",
									value: model._energy,
									height: 13,
									width: "55%",
									padding: {top: 10, right: 10, bottom: 5},
									disabled: compute(model._isStaff, s => !s),
									visibility: compute(model._isPeepSelected, p => !p ? "visible" : "none"),
									disabledMessage: "Not available",
									onChange: (_, adjustment: number) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined)
										context.executeAction("pe-speedpeep", speedPeepExecuteArgs(peep.id, (adjustment*multiplier)));
									}
								})
							]),
						]
					}),
				]),
				horizontal([
					label({
						text: "Multiplier:",
						height: 13,
						padding: [5, -20, 7, "1w"],
						visibility: compute(model._isPeepSelected, p => !p ? "visible" : "none"),
					}),
					dropdown({
						padding: [5, 15, 7, -20],
						width: "20%",
						height: 13,
						items: ["1x", "10x", "100x", "1000x"],
						visibility: compute(model._isPeepSelected, p => !p ? "visible" : "none"),
						onChange: (number: number) => {
							if (number === 0) { multiplier = 1};
							if (number === 1) { multiplier = 10};
							if (number === 2) { multiplier = 100};
							if (number === 3) { multiplier = 1000};
							debug(`Multiplier set to ${multiplier}`)
						}
					})
				]),
			]
		}),
		tab({ //appearance
			image: paintIcon,
			height: "auto",
			content: [
				groupbox({
					text: "Appearance",
					visibility: compute(model._isPeepSelected, p => p ? "visible" : "none"),
					content:[						
						label({
							text: "Here you can set how a a peep looks",
							alignment: "centred",
							visibility: compute(model._isPeepSelected, p => p ? "visible" : "none"),
						}),
					]
				}),
				groupbox({
					text: "Staff member appearance",
					spacing: 2,
					gap: {top: 16, bottom: 16},
					visibility: compute(model._isStaff, g => (g) ? "visible" : "none"),
					content: [
						horizontal([
							label({
								text: "Staff type:",
								height: 13,
								visibility: compute(model._isPeepSelected, model._isStaff, (p, s) => (!p &&s) ? "visible" : "none"),
								disabled: model._isPeepSelected,
								padding: { left: 10 },
							}),
							dropdown({
								height: 13,
								width: "55%",
								visibility: compute(model._isPeepSelected, model._isStaff, (p, s) => (!p &&s) ? "visible" : "none"),
								disabled: model._isPeepSelected,
								disabledMessage: "Not available",
								padding: { right: 10 },
								items: staffTypeList,
								selectedIndex: compute(model._staffType, t => staffType.indexOf(t)),
								onChange: (index) => {
									const staff = <Staff>model._selectedPeep.get();
									if (staff !== undefined){
										context.executeAction("pe-stafftype", staffTypeExecuteArgs(staff.id, staffType[index]));
									}
								}
							})
						]),
						horizontal([
							label({
								text: "Costume:",
								height: 13,
								visibility: compute(model._isPeepSelected, model._isEntertainer, (p, e) => (!p &&e) ? "visible" : "none"),
								disabled: model._isPeepSelected,
								padding: { left: 10 },
							}),
							dropdown({
								height: 13,
								width: "55%",
								visibility: compute(model._isPeepSelected, model._isEntertainer, (p, e) => (!p &&e) ? "visible" : "none"),
								disabled: model._isPeepSelected,
								disabledMessage: "Not available",
								padding: { right: 10 },
								items: costumeList,
								selectedIndex: compute(model._costume, c => model._availableCostumes.get().indexOf(c)),
								onChange: (index) => {
									const staff = <Staff>model._selectedPeep.get();
									if (staff !== undefined){
										context.executeAction("pe-staffcostume", staffCostumeExecuteArgs(staff.id, model._availableCostumes.get()[index]));
									}
								}
							})
						]),
						horizontal([
							label({
								text: "Uniform colour:",
								height: 13,
								visibility: compute(model._isPeepSelected, model._costume, model._isGuest, (p, c, g) => (!p && (c === "none" || c === "handyman" || c === "mechanic" || c === "security1" || c === "security2") && !g) ? "visible" : "none"),
								disabled: model._isPeepSelected,
								padding: { left: 10 },
							}),
							textbox({
								text: compute(model._colour, c => colourList[c] || ""),
								width: "51%",
								height: 13,
								visibility: compute(model._isPeepSelected, model._costume, model._isGuest, (p, c, g) => (!p && (c === "none" || c === "handyman" || c === "mechanic" || c === "security1" || c === "security2") && !g) ? "visible" : "none"),
								disabled: true,
							}),
							colourPicker({
								colour: compute(model._colour, c => (c) || 0),
								visibility: compute(model._isPeepSelected, model._costume, model._isGuest, (p, c, g) => (!p && (c === "none" || c === "handyman" || c === "mechanic" || c === "security1" || c === "security2") && !g) ? "visible" : "none"),
								disabled: model._isPeepSelected,
								padding: { right: 10 },
								onChange: (colour) => {
									const peep = model._selectedPeep.get();
									if (peep !== undefined) {
										context.executeAction("pe-colourpeep", colourPeepExecuteArgs(peep.id, colour));
									}
								}
							})
						]),
					]
				}),
				groupbox({
					text: "Guest appearance",
					spacing: 2,
					visibility: compute(model._isGuest, g => (g) ? "visible" : "none"),
					content: [
						horizontal([
							graphics({
								height: 16,
								width: 16,
								padding: { left: 10 },
								visibility: compute(model._isGuest, g => (g) ? "visible" : "none"),
								onDraw: function (g) { drawImage(g, 5081, "tshirtColour"); },
							}),
							colourPicker({
								colour: model._tshirtColour,
								visibility: compute(model._isGuest, g => (g) ? "visible" : "none"),
								onChange: (colour) => {
									const peep = model._selectedPeep.get();
									if (peep !== undefined) {
										context.executeAction("pe-colourpeep", colourPeepExecuteArgs(peep.id, colour, "tshirtColour"));
									}
								}
							}),
							graphics({
								height: 16,
								width: 16,
								padding: { top: -1, left: 10 },
								visibility: compute(model._isGuest, g => (g) ? "visible" : "none"),
								onDraw: function (g) { drawImage(g, customImageFor("trousers"), "trousersColour"); },
							}),
							colourPicker({
								colour: model._trousersColour,
								visibility: compute(model._isGuest, g => (g) ? "visible" : "none"),
								onChange: (colour) => {
									const peep = model._selectedPeep.get();
									if (peep !== undefined) {
										context.executeAction("pe-colourpeep", colourPeepExecuteArgs(peep.id, colour, "trousersColour"));
									}
								}
							}),
							graphics({
								height: 16,
								width: 16,
								padding: { left: 10 },
								disabled: compute(model._hasHat, h => !h),
								visibility: compute(model._isGuest, g => (g) ? "visible" : "none"),
								onDraw: function (g) { drawImage(g, 5079, "hatColour"); },
							}),
							colourPicker({
								colour: model._hatColour,
								disabled: compute(model._hasHat, h => !h),
								visibility: compute(model._isGuest, g => (g) ? "visible" : "none"),
								onChange: (colour) => {
									const peep = model._selectedPeep.get();
									if (peep !== undefined) {
										context.executeAction("pe-colourpeep", colourPeepExecuteArgs(peep.id, colour, "hatColour"));
									}
								}
							}),
							graphics({
								height: 16,
								width: 16,
								padding: { left: 10 },
								disabled: compute(model._hasBalloon, b => !b),
								visibility: compute(model._isGuest, g => (g) ? "visible" : "none"),
								onDraw: function (g) { drawImage(g, 5061, "balloonColour"); },
							}),
							colourPicker({
								colour: model._balloonColour,
								disabled: compute(model._hasBalloon, b => !b),
								visibility: compute(model._isGuest, g => (g) ? "visible" : "none"),
								onChange: (colour) => {
									const peep = model._selectedPeep.get();
									if (peep !== undefined) {
										context.executeAction("pe-colourpeep", colourPeepExecuteArgs(peep.id, colour, "balloonColour"));
									}
								}
							}),
							graphics({
								height: 16,
								width: 16,
								padding: { left: 10 },
								disabled: compute(model._hasUmbrella, u => !u),
								visibility: compute(model._isGuest, g => (g) ? "visible" : "none"),
								onDraw: function (g) { drawImage(g, 5065, "umbrellaColour"); },
							}),
							colourPicker({
								colour: model._umbrellaColour,
								disabled: compute(model._hasUmbrella, u => !u),
								visibility: compute(model._isGuest, g => (g) ? "visible" : "none"),
								padding: { right: 12 },
								onChange: (colour) => {
									const peep = model._selectedPeep.get();
									if (peep !== undefined) {
										context.executeAction("pe-colourpeep", colourPeepExecuteArgs(peep.id, colour, "umbrellaColour"));
									}
								}
							})
						]),
					]
				}),
				groupbox({
					text: "Animation",
					spacing: 2,
					gap: {top: 16, bottom: 16},
					visibility: compute(model._isPeepSelected, p => !p ? "visible" : "none"),
					content: [
						horizontal([
							label({
								text: "Animation:",
								height: 13,
								disabled: model._isPeepSelected,
								visibility: compute(model._isPeepSelected, p => !p ? "visible" : "none"),
								padding: { left: 10 },
							}),
							dropdown({	//No selection and Guest
								height: 13,
								width: "55%",
								disabled: model._isPeepSelected,
								disabledMessage: "Not available",
								padding: { right: 10, },
								visibility: compute(model._isPeepSelected, model._isGuest, (p, g) => (p || g)? "visible" : "none"),
								items: compute(model._availableAnimations, a => a.map(animationList)),
								selectedIndex: compute(model._animation, a => model._availableGuestAnimations.get().indexOf(<GuestAnimation>a)),
								onChange: (index) => {
									const peep = model._selectedPeep.get();
									if (peep !== undefined){
										context.executeAction("pe-animationpeep", animationPeepExecuteArgs(peep.id, model._availableAnimations.get()[index]));
									}
								}
							}),
							dropdown({ 	//Staff
								height: 13,
								width: "55%",
								disabled: model._isPeepSelected,
								disabledMessage: "Not available",
								padding: { right: 10, },
								visibility: compute(model._isStaff, s => (s)? "visible" : "none"),
								items: compute(model._availableAnimations, a => a.map(animationList)),
								selectedIndex: compute(model._animation, a => model._availableStaffAnimations.get().indexOf(<StaffAnimation>a)),
								onChange: (index) => {
									const peep = model._selectedPeep.get();
									if (peep !== undefined){
										context.executeAction("pe-animationpeep", animationPeepExecuteArgs(peep.id, model._availableAnimations.get()[index]));
									}
								}
							})
						]),
						horizontal([
							label({
								text: compute(model._animationLength, l => `Frame: (max: ${l-1})` || "Frame:"),
								height: 13,
								disabled: compute(model._isPeepSelected, model._isFrozen, (p,f) => p || !f),
								padding: { left: 10 },
							}),
							spinner({
								height: 13,
								width: "55%",
								disabled: compute(model._isPeepSelected, model._isFrozen, (p,f) => p || !f),
								disabledMessage: "Not available",
								padding: { right: 10 },
								value: model._animationFrame,
								minimum: 0,
								maximum: compute(model._animationLength, l => l-1),
								onChange: (value, adjustment) => {
									const peep = model._selectedPeep.get();
									if (peep !== undefined){
										context.executeAction("pe-animationframepeep", animationFramePeepExecuteArgs(peep.id, value, adjustment));
									}
								}
							})
						]),
					]
				}),
			]
		}),
		tab({
			image: pointingFingerIcon,
			height: "auto",
			content: [
				groupbox({
					text: "Options",
					visibility: compute(model._isPeepSelected, p => p ? "visible" : "none"),
					content: [
						label({
							text: "Here you can set staff orders or guest flags",
							alignment: "centred",
							visibility: compute(model._isPeepSelected, p => p ? "visible" : "none"),
						})
					]
				}),
				groupbox ({
					text: "Staff orders",
					spacing: 2,
					gap: {top: 16, bottom: 16},
					visibility: compute(model._isStaff, s => s ? "visible" : "none"),
					content: [
						checkbox({
							text: "{INLINE_SPRITE}{247}{19}{0}{0} Sweep foothpaths",
							visibility: compute(model._isHandyman, h => h ? "visible" : "none"),
							padding: {left: 10},
							isChecked: compute(model._orders, o => (o & (1 << 0)) !== 0),
							onChange: (checked) => {
								const peep = model._selectedPeep.get();
								if (peep !== undefined) {
									context.executeAction("pe-stafforders", staffOrdersExecuteArgs(peep.id, checked, (1 << 0)));
								}
							}
						}),
						checkbox({
							text: "{INLINE_SPRITE}{248}{19}{0}{0} Water gardens",
							visibility: compute(model._isHandyman, h => h ? "visible" : "none"),
							padding: {left: 10},
							isChecked: compute(model._orders, o => (o & (1 << 1)) !== 0),
							onChange: (checked) => {
								const peep = model._selectedPeep.get();
								if (peep !== undefined) {
									context.executeAction("pe-stafforders", staffOrdersExecuteArgs(peep.id, checked, (1 << 1)));
								}
							}
						}),
						checkbox({
							text: "{INLINE_SPRITE}{249}{19}{0}{0} Empty litter bins",
							visibility: compute(model._isHandyman, h => h ? "visible" : "none"),
							padding: {left: 10},
							isChecked: compute(model._orders, o => (o & (1 << 2)) !== 0),
							onChange: (checked) => {
								const peep = model._selectedPeep.get();
								if (peep !== undefined) {
									context.executeAction("pe-stafforders", staffOrdersExecuteArgs(peep.id, checked, (1 << 2)));
								}
							}
						}),
						checkbox({
							text: "{INLINE_SPRITE}{250}{19}{0}{0} Mow grass",
							visibility: compute(model._isHandyman, h => h ? "visible" : "none"),
							padding: {left: 10},
							isChecked: compute(model._orders, o => (o & (1 << 3)) !== 0),
							onChange: (checked) => {
								const peep = model._selectedPeep.get();
								if (peep !== undefined) {
									context.executeAction("pe-stafforders", staffOrdersExecuteArgs(peep.id, checked, (1 << 3)));
								}
							}
						}),
						checkbox({
							text: "{INLINE_SPRITE}{251}{19}{0}{0} Inspect rides",
							visibility: compute(model._isMechanic, m => m ? "visible" : "none"),
							padding: {left: 10},
							isChecked: compute(model._orders, o => (o & (1 << 0)) !== 0),
							onChange: (checked) => {
								const peep = model._selectedPeep.get();
								if (peep !== undefined) {
									context.executeAction("pe-stafforders", staffOrdersExecuteArgs(peep.id, checked, (1 << 0)));
								}
							}
						}),
						checkbox({
							text: "{INLINE_SPRITE}{252}{19}{0}{0} Fix Rides",
							visibility: compute(model._isMechanic, m => m ? "visible" : "none"),
							padding: {left: 10},
							isChecked: compute(model._orders, o => (o & (1 << 1)) !== 0),
							onChange: (checked) => {
								const peep = model._selectedPeep.get();
								if (peep !== undefined) {
									context.executeAction("pe-stafforders", staffOrdersExecuteArgs(peep.id, checked, (1 << 1)));
								}
							}
						}),
						checkbox({
							text: "{INLINE_SPRITE}{253}{19}{0}{0} Surveilling park",
							visibility: compute(model._isSecurity, s => s ? "visible" : "none"),
							padding: {left: 10},
							isChecked: twoway(securityOrders),
							onChange: (checked) => {
								if (!checked){
									securityOrders.set(true);
									ui.showError("Can't be turned off", "Security guards never take breaks");
								}
							}
						}),
						checkbox({
							text: "{INLINE_SPRITE}{116}{21}{0}{0} Keep guests happy",
							visibility: compute(model._isEntertainer, e => e ? "visible" : "none"),
							padding: {left: 10},
							isChecked: twoway(entertainerOrders),
							onChange: (checked) => {
								if (!checked){
									entertainerOrders.set(true);
									ui.showError("Can't be turned off", "Rule 7: have fun");
								}
							}
						}),
					]
				}),
				groupbox({
					text: "Guest flags",
					visibility: compute(model._isGuest, g => g ? "visible" : "none"),
					content: [
						horizontal([
							vertical([
								checkbox({
									text: "Leave park",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									padding: {bottom: -2, left: 10 },
									isChecked: compute(model._selectedPeep, p => (p?.getFlag("leavingPark"))? true : false),
									onChange: (checked) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined) {
											context.executeAction("pe-guestflags", guestFlagsExecuteArgs(peep.id, checked, "leavingPark"));
										}
									}
								}),
								checkbox({
									text: "Slow walk",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									padding: {top: -2, bottom: -2, left: 10 },
									isChecked: compute(model._selectedPeep, p => (p?.getFlag("slowWalk"))? true : false),
									onChange: (checked) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined) {
											context.executeAction("pe-guestflags", guestFlagsExecuteArgs(peep.id, checked, "slowWalk"));
										}
									}
								}),
								checkbox({
									text: "Tracking",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									padding: {top: -2, bottom: -2, left: 10 },
									isChecked: compute(model._selectedPeep, p => (p?.getFlag("tracking"))? true : false),
									onChange: (checked) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined) {
											context.executeAction("pe-guestflags", guestFlagsExecuteArgs(peep.id, checked, "tracking"));
										}
									}
								}),
								checkbox({
									text: "Waving",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									padding: {top: -2, bottom: -2, left: 10 },
									isChecked: compute(model._selectedPeep, p => (p?.getFlag("waving"))? true : false),
									onChange: (checked) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined) {
											context.executeAction("pe-guestflags", guestFlagsExecuteArgs(peep.id, checked, "waving"));
										}
									}
								}),
								checkbox({
									text: "Photo",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									padding: {top: -2, bottom: -2, left: 10 },
									isChecked: compute(model._selectedPeep, p => (p?.getFlag("photo"))? true : false),
									onChange: (checked) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined) {
											context.executeAction("pe-guestflags", guestFlagsExecuteArgs(peep.id, checked, "photo"));
										}
									}
								}),
								checkbox({
									text: "Painting",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									padding: {top: -2, bottom: -2, left: 10 },
									isChecked: compute(model._selectedPeep, p => (p?.getFlag("painting"))? true : false),
									onChange: (checked) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined) {
											context.executeAction("pe-guestflags", guestFlagsExecuteArgs(peep.id, checked, "painting"));
										}
									}
								}),
								checkbox({
									text: "Wow",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									padding: {top: -2, bottom: -2, left: 10 },
									isChecked: compute(model._selectedPeep, p => (p?.getFlag("wow"))? true : false),
									onChange: (checked) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined) {
											context.executeAction("pe-guestflags", guestFlagsExecuteArgs(peep.id, checked, "wow"));
										}
									}
								}),
								checkbox({
									text: "Litter",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									padding: {top: -2, bottom: -2, left: 10 },
									isChecked: compute(model._selectedPeep, p => (p?.getFlag("litter"))? true : false),
									onChange: (checked) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined) {
											context.executeAction("pe-guestflags", guestFlagsExecuteArgs(peep.id, checked, "litter"));
										}
									}
								}),
								checkbox({
									text: "Lost",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									padding: {top: -2, bottom: -2, left: 10 },
									isChecked: compute(model._selectedPeep, p => (p?.getFlag("lost"))? true : false),
									onChange: (checked) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined) {
											context.executeAction("pe-guestflags", guestFlagsExecuteArgs(peep.id, checked, "lost"));
										}
									}
								}),
								checkbox({
									text: "Hunger",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									padding: {top: -2, bottom: -2, left: 10 },
									isChecked: compute(model._selectedPeep, p => (p?.getFlag("hunger"))? true : false),
									onChange: (checked) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined) {
											context.executeAction("pe-guestflags", guestFlagsExecuteArgs(peep.id, checked, "hunger"));
										}
									}
								}),
								checkbox({
									text: "Toilet",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									padding: {top: -2, bottom: 10, left: 10 },
									isChecked: compute(model._selectedPeep, p => (p?.getFlag("toilet"))? true : false),
									onChange: (checked) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined) {
											context.executeAction("pe-guestflags", guestFlagsExecuteArgs(peep.id, checked, "toilet"));
										}
									}
								}),
							]),
							vertical([
								checkbox({
									text: "Crowded",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									padding: {bottom: -2},
									isChecked: compute(model._selectedPeep, p => (p?.getFlag("crowded"))? true : false),
									onChange: (checked) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined) {
											context.executeAction("pe-guestflags", guestFlagsExecuteArgs(peep.id, checked, "crowded"));
										}
									}
								}),
								checkbox({
									text: "Happiness",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									padding: {top: -2, bottom: -2},
									isChecked: compute(model._selectedPeep, p => (p?.getFlag("happiness"))? true : false),
									onChange: (checked) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined) {
											context.executeAction("pe-guestflags", guestFlagsExecuteArgs(peep.id, checked, "happiness"));
										}
									}
								}),
								checkbox({
									text: "Nausea",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									padding: {top: -2, bottom: -2},
									isChecked: compute(model._selectedPeep, p => (p?.getFlag("nausea"))? true : false),
									onChange: (checked) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined) {
											context.executeAction("pe-guestflags", guestFlagsExecuteArgs(peep.id, checked, "nausea"));
										}
									}
								}),
								checkbox({
									text: "Purple",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									padding: {top: -2, bottom: -2},
									isChecked: compute(model._selectedPeep, p => (p?.getFlag("purple"))? true : false),
									onChange: (checked) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined) {
											context.executeAction("pe-guestflags", guestFlagsExecuteArgs(peep.id, checked, "purple"));
										}
									}
								}),
								checkbox({
									text: "Pizza",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									padding: {top: -2, bottom: -2},
									isChecked: compute(model._selectedPeep, p => (p?.getFlag("pizza"))? true : false),
									onChange: (checked) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined) {
											context.executeAction("pe-guestflags", guestFlagsExecuteArgs(peep.id, checked, "pizza"));
										}
									}
								}),
								checkbox({
									text: "Explode",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									padding: {top: -2, bottom: -2},
									isChecked: compute(model._selectedPeep, p => (p?.getFlag("explode"))? true : false),
									onChange: (checked) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined) {
											context.executeAction("pe-guestflags", guestFlagsExecuteArgs(peep.id, checked, "explode"));
										}
									}
								}),
								checkbox({
									text: "Contagious",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									padding: {top: -2, bottom: -2},
									isChecked: compute(model._selectedPeep, p => (p?.getFlag("contagious"))? true : false),
									onChange: (checked) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined) {
											context.executeAction("pe-guestflags", guestFlagsExecuteArgs(peep.id, checked, "contagious"));
										}
									}
								}),
								checkbox({
									text: "Joy",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									padding: {top: -2, bottom: -2},
									isChecked: compute(model._selectedPeep, p => (p?.getFlag("joy"))? true : false),
									onChange: (checked) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined) {
											context.executeAction("pe-guestflags", guestFlagsExecuteArgs(peep.id, checked, "joy"));
										}
									}
								}),
								checkbox({
									text: "Angry",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									padding: {top: -2, bottom: -2},
									isChecked: compute(model._selectedPeep, p => (p?.getFlag("angry"))? true : false),
									onChange: (checked) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined) {
											context.executeAction("pe-guestflags", guestFlagsExecuteArgs(peep.id, checked, "angry"));
										}
									}
								}),
								checkbox({
									text: "Ice cream",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									padding: {top: -2, bottom: -2},
									isChecked: compute(model._selectedPeep, p => (p?.getFlag("iceCream"))? true : false),
									onChange: (checked) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined) {
											context.executeAction("pe-guestflags", guestFlagsExecuteArgs(peep.id, checked, "iceCream"));
										}
									}
								}),
								checkbox({
									text: "Here we are",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									padding: {top: -2, bottom: 10},
									isChecked: compute(model._selectedPeep, p => (p?.getFlag("hereWeAre"))? true : false),
									onChange: (checked) => {
										const peep = model._selectedPeep.get();
										if (peep !== undefined) {
											context.executeAction("pe-guestflags", guestFlagsExecuteArgs(peep.id, checked, "hereWeAre"));
										}
									}
								}),
							])
						])
					],
				})
			]
		}),
		tab({
			image: moodIcon,
			height: "auto",
			content: [
				groupbox({
					text: "Physiology",
					visibility: compute(model._isGuest, g => !g ? "visible" : "none"),
					content: [
						label({
							text: "All staff members are very happy,",
							alignment: "centred",
							padding: -2,
							visibility: compute(model._isStaff, s => s ? "visible" : "none"),
						}),
						label({
							text: "well fed and hydrated,",
							alignment: "centred",
							padding: -2,
							visibility: compute(model._isStaff, s => s ? "visible" : "none"),
						}),
						label({
							text: "and just had their toilet break.",
							alignment: "centred",
							padding: -2,
							visibility: compute(model._isStaff, s => s ? "visible" : "none"),
						}),
						label({
							text: "Here you can set a guest's mood",
							alignment: "centred",
							visibility: compute(model._isPeepSelected, p => p ? "visible" : "none"),
						}),
					]
				}),
				groupbox({
					text: "Physiology",
					visibility: compute(model._isGuest, g => g ? "visible" : "none"),
					content: [
						horizontal([
							label({
								text: "Happiness:",
								height: 13,
								width: "30%",
								padding: {top: 0, bottom: 0, left: 10},
								disabled: compute(model._isGuest, g => !g),
								visibility: compute(model._isGuest, g => g ? "visible" : "none"),
							}),
							progressBar({
								background: 19,
								percentFilled: compute(model._happiness, h => percentage(h, 255)),
								foreground: compute(compute(model._happiness, h => percentage(h, 255)), p => colourPogressBar(true, p)),
								visibility: compute(model._isGuest, g => g ? "visible" : "none"),
							}),
							spinner({
								minimum: 0,
								maximum: 255,
								value: model._happiness,
								height: 13,
								width: "25%",
								wrapMode: "clamp",
								padding: {top: 0, right: 10,  bottom: 0},
								disabled: compute(model._isGuest, g => !g),
								disabledMessage: "N/A",
								visibility: compute(model._isGuest, g => g ? "visible" : "none"),
								onChange: (_, adjustment: number) => {
									const peep = model._selectedPeep.get();
									if (peep !== undefined)
									context.executeAction("pe-guesthappiness", guestHappinessExecuteArgs(peep.id, (adjustment*multiplier)));
								}
							})
						]),
						horizontal([
							label({
								text: "Energy:",
								height: 13,
								width: "30%",
								padding: {top: 0, bottom: 0, left: 10},
								disabled: compute(model._isGuest, g => !g),
								visibility: compute(model._isGuest, g => g ? "visible" : "none"),
							}),
							progressBar({
								background: 19,
								percentFilled: compute(model._energy, h => percentage(h, 128)),
								foreground: compute(compute(model._energy, e => percentage(e, 128)), p => colourPogressBar(true, p)),
								visibility: compute(model._isGuest, g => g ? "visible" : "none"),
							}),
							spinner({
								minimum: 32,
								maximum: 128,
								wrapMode: "clamp",
								value: model._energy,
								height: 13,
								width: "25%",
								padding: {top: 0, right: 10, bottom: 0},
								disabled: compute(model._isGuest, g => !g),
								disabledMessage: "N/A",
								visibility: compute(model._isGuest, g => g ? "visible" : "none"),
								onChange: (_, adjustment: number) => {
									const peep = model._selectedPeep.get();
									if (peep !== undefined)
									context.executeAction("pe-speedpeep", speedPeepExecuteArgs(peep.id, (adjustment*multiplier)));
								}
							})
						]),
						horizontal([
							label({
								text: "Hunger:",
								height: 13,
								width: "30%",
								padding: {top: 0, bottom: 0, left: 10},
								disabled: compute(model._isGuest, g => !g),
								visibility: compute(model._isGuest, g => g ? "visible" : "none"),
							}),
							progressBar({
								background: 19,
								percentFilled: compute(model._hunger, h => 1-percentage(h, 255)),
								foreground: compute(compute(model._hunger, h => 1-percentage(h, 255)), p => colourPogressBar(false, p)),
								visibility: compute(model._isGuest, g => g ? "visible" : "none"),
							}),
							spinner({
								minimum: 0,
								maximum: 255,
								wrapMode: "clamp",
								value: compute(model._hunger, h => 255-h),
								height: 13,
								width: "25%",
								padding: {top: 0, right: 10, bottom: 0},
								disabled: compute(model._isGuest, g => !g),
								disabledMessage: "N/A",
								visibility: compute(model._isGuest, g => g ? "visible" : "none"),
								onChange: (_, adjustment: number) => {
									const peep = model._selectedPeep.get();
									if (peep !== undefined)
									context.executeAction("pe-guesthunger", guestHungerExecuteArgs(peep.id, (adjustment*multiplier)));
								}
							})
						]),
						horizontal([
							label({
								text: "Thirst:",
								height: 13,
								width: "30%",
								padding: {top: 0, bottom: 0, left: 10},
								disabled: compute(model._isGuest, g => !g),
								visibility: compute(model._isGuest, g => g ? "visible" : "none"),
							}),
							progressBar({
								background: 19,
								percentFilled: compute(model._thirst, t => 1-percentage(t, 255)),
								foreground: compute(compute(model._thirst, t => 1-percentage(t, 255)), p => colourPogressBar(false, p)),
								visibility: compute(model._isGuest, g => g ? "visible" : "none"),
							}),
							spinner({
								minimum: 0,
								maximum: 255,
								wrapMode: "clamp",
								value: compute(model._thirst, t => 255-t),
								height: 13,
								width: "25%",
								padding: {top: 0, right: 10, bottom: 0},
								disabled: compute(model._isGuest, g => !g),
								disabledMessage: "N/A",
								visibility: compute(model._isGuest, g => g ? "visible" : "none"),
								onChange: (_, adjustment: number) => {
									const peep = model._selectedPeep.get();
									if (peep !== undefined)
									context.executeAction("pe-guestthirst", guestThirstExecuteArgs(peep.id, (adjustment*multiplier)));
								}
							})
						]),
						horizontal([
							label({
								text: "Nausea:",
								height: 13,
								width: "30%",
								padding: {top: 0, bottom: 0, left: 10},
								disabled: compute(model._isGuest, g => !g),
								visibility: compute(model._isGuest, g => g ? "visible" : "none"),
							}),
							progressBar({
								background: 19,
								percentFilled: compute(model._nausea, n => percentage(n, 255)),
								foreground: compute(compute(model._nausea, n => percentage(n, 255)), p => colourPogressBar(false, p)),
								visibility: compute(model._isGuest, g => g ? "visible" : "none"),
							}),
							spinner({
								minimum: 0,
								maximum: 255,
								wrapMode: "clamp",
								value: model._nausea,
								height: 13,
								width: "25%",
								padding: {top: 0, right: 10, bottom: 0},
								disabled: compute(model._isGuest, g => !g),
								disabledMessage: "N/A",
								visibility: compute(model._isGuest, g => g ? "visible" : "none"),
								onChange: (_, adjustment: number) => {
									const peep = model._selectedPeep.get();
									if (peep !== undefined)
									context.executeAction("pe-guestnausea", guestNauseaExecuteArgs(peep.id, (adjustment*multiplier)));
								}
							})
						]),
						horizontal([
							label({
								text: "Toilet:",
								height: 13,
								width: "30%",
								padding: {top: 0, bottom: 0, left: 10},
								disabled: compute(model._isGuest, g => !g),
								visibility: compute(model._isGuest, g => g ? "visible" : "none"),
							}),
							progressBar({
								background: 19,
								percentFilled: compute(model._toilet, t => percentage(t, 255)),
								foreground: compute(compute(model._toilet, t => percentage(t, 255)), p => colourPogressBar(false, p)),
								visibility: compute(model._isGuest, g => g ? "visible" : "none"),
							}),
							spinner({
								minimum: 0,
								maximum: 255,
								wrapMode: "clamp",
								value: model._toilet,
								height: 13,
								width: "25%",
								padding: {top: 0, right: 10, bottom: 0},
								disabled: compute(model._isGuest, g => !g),
								disabledMessage: "N/A",
								visibility: compute(model._isGuest, g => g ? "visible" : "none"),
								onChange: (_, adjustment: number) => {
									const peep = model._selectedPeep.get();
									if (peep !== undefined)
									context.executeAction("pe-guesttoilet", guestToiletExecuteArgs(peep.id, (adjustment*multiplier)));
								}
							})
						]),
						horizontal([
							label({
								text: "Mass:",
								height: 13,
								width: "30%",
								padding: {top: 0, bottom: 0, left: 10},
								disabled: compute(model._isGuest, g => !g),
								visibility: compute(model._isGuest, g => g ? "visible" : "none"),
							}),
							progressBar({
								background: 19,
								percentFilled: compute(model._mass, m => percentage(m, 255)),
								foreground: compute(compute(model._mass, m => percentage(m, 255)), p => colourPogressBar(false, p)),
								visibility: compute(model._isGuest, g => g ? "visible" : "none"),
							}),
							spinner({
								minimum: 0,
								maximum: 255,
								wrapMode: "clamp",
								value: model._mass,
								height: 13,
								width: "25%",
								padding: {top: 0, right: 10, bottom: 0},
								disabled: compute(model._isGuest, g => !g),
								disabledMessage: "N/A",
								visibility: compute(model._isGuest, g => g ? "visible" : "none"),
								onChange: (_, adjustment: number) => {
									const peep = model._selectedPeep.get();
									if (peep !== undefined)
									context.executeAction("pe-guestmass", guestMassExecuteArgs(peep.id, (adjustment*multiplier)));
								}
							})
						]),
					]
				}),
				horizontal([
					label({
						text: "Multiplier:",
						height: 13,
						padding: [5, -20, 7, "1w"],
						visibility: compute(model._isGuest, g => g ? "visible" : "none"),
					}),
					dropdown({
						padding: [5, 15, 7, -20],
						width: "20%",
						height: 13,
						items: ["1x", "10x", "100x"],
						visibility: compute(model._isGuest, g => g ? "visible" : "none"),
						onChange: (number: number) => {
							if (number === 0) { multiplier = 1};
							if (number === 1) { multiplier = 10};
							if (number === 2) { multiplier = 100};
							debug(`Multiplier set to ${multiplier}`)
						}
					})
				]),
			]
		}),		
		tab({
			height: "auto",
			image: itemsIcon,
			spacing: 0,
			content: [
				groupbox({
					spacing: 0,
					padding: { bottom: 4 },
					text: "Carrying",
					content: [
						label({
							text: "Organise a guest's inventory",
							alignment: "centred",
							visibility: compute(model._isGuest, g => !g ? "visible" : "none"),
						})
					].concat(carryingItems())
				}),
				horizontal([
					label({
						text: "Item:",
						height: 13,
						visibility: compute(model._isGuest, g => g ? "visible" : "none"),
						padding: {bottom: 4},
					}),
					dropdown({
						items: itemList(),
						height: 13,
						width: "75%",
						padding: {bottom: 4},
						visibility: compute(model._isGuest, g => g ? "visible" : "none"),
						onChange: (idx) => {
							const item = guestItemTypeList[idx];
							model._item.set(item)
						}
					}),
				]),
				horizontal([
					label({
						text: "Voucher:",
						height: 13,
						visibility: compute(model._item, i => (i === "voucher") ? "visible" : "none"),
						padding: {bottom: 4},
					}),
					dropdown({
						items: ["Free entry", "Half-priced entry", "Free food/drink", "Free ride"],
						height: 13,
						width: "75%",
						padding: {bottom: 4},
						visibility: compute(model._item, i => (i === "voucher") ? "visible" : "none"),
						onChange: (idx) => {
							switch (idx) {
								case 0: model._voucher.set(<Voucher>{type: "voucher", voucherType: "entry_free"});model._voucherType.set("entry_free"); break;
								case 1: model._voucher.set(<Voucher>{type: "voucher", voucherType: "entry_half_price"});model._voucherType.set("entry_half_price"); break;
								case 2: model._voucherType.set("food_drink_free"); model._voucher.set(<FoodDrinkVoucher>{type: "voucher", voucherType: model._voucherType.get(), item: model._voucherItem.get()}); break;
								case 3: model._voucher.set(<RideVoucher>{type: "voucher", voucherType: "ride_free", rideId: model._rideId.get()});model._voucherType.set("ride_free"); break;
							}
						}
					}),
				]),
				horizontal([
					label({
						text: "Ride:",
						height: 13,
						padding: {bottom: 4},
						visibility: compute(model._item, model._voucherType, (i, v) => (i === "photo1" || i === "photo2" || i === "photo3" || i === "photo4" || (i === "voucher" && v === "ride_free")) ? "visible" : "none"),
					}),
					dropdown({
						items: compute(rideList, c => c.map(r => r._ride().name)),
						height: 13,
						width: "75%",
						padding: {bottom: 4},
						visibility: compute(model._item, model._voucherType, (i, v) => (i === "photo1" || i === "photo2" || i === "photo3" || i === "photo4" || (i === "voucher" && v === "ride_free")) ? "visible" : "none"),
						onChange: (idx) => {
							const rideId = compute(rideList, c => c.map(r => r._ride().id));
							model._rideId.set(rideId.get()[idx]);
							model._voucher.set(<RideVoucher>{type: "voucher", voucherType: "ride_free", rideId: model._rideId.get()});
						}
					}),
				]),
				horizontal([
					label({
						text: "Free item:",
						height: 13,
						visibility: compute(model._item, model._voucherType, (i, v) => (v === "food_drink_free" && i === "voucher") ? "visible" : "none"),
						padding: {bottom: 4},
					}),
					dropdown({
						items: itemList(),
						height: 13,
						width: "75%",
						padding: {bottom: 4},
						visibility: compute(model._item, model._voucherType, (i, v) => (v === "food_drink_free" && i === "voucher") ? "visible" : "none"),
						onChange: (idx) => {
							const item = guestItemTypeList[idx];
							model._voucherItem.set(item);
							model._voucher.set(<FoodDrinkVoucher>{type: "voucher", voucherType: "food_drink_free", item: model._voucherItem.get()});
						}
					}),
				]),
				horizontal([
					label({
						text: "",
						height: 13,
						visibility: compute(model._isGuest, g => g ? "visible" : "none"),
						padding: {top: 2, bottom: 4},
					}),
					button({
						text: `Add item`,
						visibility: compute(model._isGuest, g => g ? "visible" : "none"),
						padding: {top: 2, bottom: 4},
						height: 13,
						width: "25%",
						onClick: () => {
							const guest = <Guest>model._selectedPeep.get();
							const item = model._item.get();
							if (guest.hasItem({type: item}) && item !== "voucher" && item !== "photo1" && item !== "photo2" && item !== "photo3" && item !== "photo4"){
								ui.showError("Guest already", "has this item");
								return;
							}
							switch (model._item.get()) {
								case "voucher": guest.giveItem(model._voucher.get()); break;
								case "photo1": guest.giveItem(<GuestPhoto>{type: "photo1", rideId: model._rideId.get()}); break;
								case "photo2": guest.giveItem(<GuestPhoto>{type: "photo2", rideId: model._rideId.get()}); break;
								case "photo3": guest.giveItem(<GuestPhoto>{type: "photo3", rideId: model._rideId.get()}); break;
								case "photo4": guest.giveItem(<GuestPhoto>{type: "photo4", rideId: model._rideId.get()}); break;
								default: guest.giveItem({type: item})
							}
							//
						}
					})
				])
			]
		}),
		tab({
			image: infoIcon,
			content: [
				label({
					text: "Peep Editor, a plugin for OpenRCT2",
					alignment: "centred",
					padding: [4, 0, 8, 0]
				}),
				horizontal([
					label({
						text: "Version:",
						width: "25%"
					}),
					label({
						text: versionString(),
					}),
				]),
				horizontal([
					label({
						text: "Author:",
						width: "25%"
					}),
					label({
						text: `{BLACK}Manticore-007`,
					}),
				]),
				horizontal([
					label({
						text: "UI:",
						width: "25%"
					}),
					label({
						text: `{BLACK}FlexUI by Basssiiie`,
					}),
				]),
				horizontal([
					label({
						text: "Special\nThanks:",
						width: "25%"
					}),
					label({
						text: `{BLACK}Basssiiie, Gymnasiast, ItsSmitty\nSpacek531, AaronVanGeffen`,
					}),
				]),
				horizontal([
					label({
						text: "",
						width: "25%",
						padding: {top: 2}
					}),
					label({
						text: `{BLACK}Sadret, mrmagic2020, Isoitiro\nand Enox`,
						padding: {top: 2}
					}),
				]),
				label({
					text: "https://github.com/Manticore-007\n/OpenRCT2-PeepEditor",
					padding: ["90%", 0, 0, 0],
					alignment: "centred"
				})
			]
		}),
	]
});


function peepTypeQuery(): string {
	const peep = model._selectedPeep.get();
	if (peep !== undefined && peep.type === "guest") {
		return "Enter name for this guest:"
	}
	else if (peep !== undefined && peep.type === "staff") {
		return "Enter name for this member of staff:"
	}
	else return "";
}

export function openWindowRemovePeep(peep: Staff | Guest): void {
	const removePeepWindow = window({
		onClose: () => {
			ui.tool?.cancel();
		},
		title: "Remove peep",
		width: 200,
		height: 100,
		position: { x: ui.width / 2 - 100, y: ui.height / 2 - 50 },
		colours: [Colour.BordeauxRed, Colour.BordeauxRed],
		content: [
			label({
				width: 200,
				alignment: "centred",
				text: textRemovePeep(peep),
				padding: [25, 0, 17, 0]
			}),
			horizontal([
				button({
					border: true,
					width: 85,
					height: 14,
					text: "Yes",
					padding: [0, 4],
					onClick: () => {
						if (peep !== undefined)
							context.executeAction("pe-removepeep", removePeepExecuteArgs(peep.id));
						removePeepWindow.close();
						model._selectedPeep.set(undefined);
					}
				}),
				button({
					border: true,
					width: 85,
					height: 14,
					text: "Cancel",
					padding: [0, 4],
					onClick: () => {
						removePeepWindow.close();
					}
				}),
			])
		]
	});
	removePeepWindow.open();
}

export function openWindowRemoveItem(item: GuestItemType): void {
	const removeItemWindow = window({
		onClose: () => {
			ui.tool?.cancel();
		},
		title: "Remove item",
		width: 200,
		height: 100,
		position: { x: ui.width / 2 - 100, y: ui.height / 2 - 50 },
		colours: [Colour.BordeauxRed, Colour.BordeauxRed],
		content: [
			label({
				width: 200,
				alignment: "centred",
				text: `Are you sure you want to remove\n${itemName(item)}\nfrom this guest?`,
				padding: [25, 0, 17, 0]
			}),
			horizontal([
				button({
					border: true,
					width: 85,
					height: 14,
					text: "Yes",
					padding: [0, 4],
					onClick: () => {
						const guest = <Guest>model._selectedPeep.get();
						context.executeAction("pe-guestitemremove", guestItemRemoveExecuteArgs(guest.id, item));
						removeItemWindow.close();
					}
				}),
				button({
					border: true,
					width: 85,
					height: 14,
					text: "Cancel",
					padding: [0, 4],
					onClick: () => {
						removeItemWindow.close();
					}
				}),
			])
		]
	});
	removeItemWindow.open();
}

function textRemovePeep(peep: Guest | Staff): string {
	if (peep.type === "guest") {
		return `{WHITE}Are you sure you want to remove\n${peep.name}?`;
	}
	else if (peep.type === "staff") {
		return `{WHITE}Are you sure you want to sack\n${peep.name}?`;
	}
	else return "";
}

function textInputTitle(peep: Guest | Staff): string {
	if (peep.type === "guest") {
		return `{WHITE}Guest's name`;
	}
	else if (peep.type === "staff") {
		return `{WHITE}Staff member name`;
	}
	else return "";
}

function versionString(): string
{
    if (isDevelopment) {
        return `{BLACK}${pluginVersion} {BABYBLUE}[DEBUG]`;
    }
    else return `{BLACK}${pluginVersion}`;
}

function drawImage(g: GraphicsContext, image: number, property?: keyof Guest): void
{
    const img = g.getImage(image);
    const guest = <Guest>model._selectedPeep.get();
    if (property === "tshirtColour" || property === "trousersColour" || (property === "hatColour" && guest.hasItem({type: "hat"})) || (property === "umbrellaColour" && guest.hasItem({type: "umbrella"})) || (property === "balloonColour" && guest.hasItem({type: "balloon"})))
    {
        const colour = guest[property];
        if (img) {
            g.paletteId = colour;
            g.image(img.id, 0, 0);
        }
    }
    else
    if (img) {
        g.paletteId = Colour.Void;
		g.tertiaryColour = Colour.Yellow;
        g.image(img.id, 0, 0);
    }
}

function createWidget(item: GuestItemType): WidgetCreator<FlexiblePosition, Parsed<FlexiblePosition>> {
			return (
				horizontal([
					graphics({
						height: 16,
						width: 16,
						padding: {top: -2, bottom: -2},
						visibility: visibilityCheck(item),
						onDraw: function (g) { itemImage(item, g); },
					}),
					label({
						text: `{BLACK}${itemName(item)}`,
						padding: {top: -2, bottom: -2},
						visibility: visibilityCheck(item),
					}),
					button({
						text: `{RED}x`,
						height: 10,
						width: 10,
						border: true,
						padding: {top: 0, bottom: -2},
						visibility: visibilityCheck(item),
						onClick: () => {
							openWindowRemoveItem(item);
						}
					})
				])
			);
}

function itemImage(item: GuestItemType, g: GraphicsContext): void {
	switch (item) {
		case "balloon": return drawImage(g, 5061, "balloonColour");
		case "beef_noodles": return drawImage(g, 5097);
		case "burger": return drawImage(g, 5067);
		case "candyfloss": return drawImage(g, 5070);
		case "chicken": return drawImage(g, 5085);
		case "chips": return drawImage(g, 5068);
		case "chocolate": return drawImage(g, 5093);
		case "coffee": return drawImage(g, 5083);
		case "cookie": return drawImage(g, 5105);
		case "doughnut": return drawImage(g, 5082);
		case "drink": return drawImage(g, 5066);
		case "empty_bottle": return drawImage(g, 5088);
		case "empty_bowl_blue": return drawImage(g, 5110);
		case "empty_bowl_red": return drawImage(g, 5106);
		case "empty_box": return drawImage(g, 5087);
		case "empty_drink_carton": return drawImage(g, 5107);
		case "empty_burger_box": return drawImage(g, 5073);
		case "empty_can": return drawImage(g, 5071);
		case "empty_cup": return drawImage(g, 5084);
		case "empty_juice_cup": return drawImage(g, 5108);
		case "fried_rice_noodles": return drawImage(g, 5098);
		case "fruit_juice": return drawImage(g, 5101);
		case "funnel_cake": return drawImage(g, 5095);
		case "hat": return drawImage(g, 5079, "hatColour");
		case "hot_dog": return drawImage(g, 5077);
		case "ice_cream": return drawImage(g, 5069);
		case "iced_tea": return drawImage(g, 5094);
		case "lemonade": return drawImage(g, 5086);
		case "map": return drawImage(g, 5063);
		case "meatball_soup": return drawImage(g, 5100);
		case "photo1": return drawImage(g, 5064);
		case "photo2": return drawImage(g, 5089);
		case "photo3": return drawImage(g, 5090);
		case "photo4": return drawImage(g, 5091);
		case "pizza": return drawImage(g, 5074);
		case "popcorn": return drawImage(g, 5076);
		case "pretzel": return drawImage(g, 5092);
		case "roast_sausage": return drawImage(g, 5109);
		case "rubbish": return drawImage(g, 5072);
		case "soybean_milk": return drawImage(g, 5102);
		case "sub_sandwich": return drawImage(g, 5104);
		case "sujeonggwa": return drawImage(g, 5103);
		case "sunglasses": return drawImage(g, 5096);
		case "tentacle": return drawImage(g, 5078);
		case "toffee_apple": return drawImage(g, 5080);
		case "toy": return drawImage(g, 5062);
		case "tshirt": return drawImage(g, 5081, "tshirtColour");
		case "umbrella": return drawImage(g, 5065, "umbrellaColour");
		case "voucher": return drawImage(g, 5075);
		case "wonton_soup": return drawImage(g, 5099);
	}
}

function itemName(item: GuestItemType): string {
	switch (item) {
		case "balloon": return `“${park.name}” Balloon`;
		case "beef_noodles": return `Beef Noodles`;
		case "burger": return `Burger`;
		case "candyfloss": return `Candyfloss`;
		case "chicken": return `Fried Chicken`;
		case "chips": return `Chips`;
		case "chocolate": return `Hot Chocolate`;
		case "coffee": return `Coffee`;
		case "cookie": return `Cookie`;
		case "doughnut": return `Doughnut`;
		case "drink": return `Drink`;
		case "empty_bottle": return `Empty Bottle`;
		case "empty_bowl_blue": return `Empty Bowl`;
		case "empty_bowl_red": return `Empty Bowl`;
		case "empty_box": return `Empty Box`;
		case "empty_drink_carton": return `Empty Drink Carton`;
		case "empty_burger_box": return `Empty Burger Box`;
		case "empty_can": return `Empty Can`;
		case "empty_cup": return `Empty Cup`;
		case "empty_juice_cup": return `Empty Juice Cup`;
		case "fried_rice_noodles": return `Fried Rice Noodles`;
		case "fruit_juice": return `Fruit Juice`;
		case "funnel_cake": return `Funnel Cake`;
		case "hat": return `“${park.name}” Hat`;
		case "hot_dog": return `Hot Dog`;
		case "ice_cream": return `Ice Cream`;
		case "iced_tea": return `Iced Tea`;
		case "lemonade": return `Lemonade`;
		case "map": return `Map of ${park.name}`;
		case "meatball_soup": return `Meatball Soup`;
		case "photo1": return `On-ride Photo 1`;
		case "photo2": return `On-ride Photo 2`;
		case "photo3": return `On-ride Photo 3`;
		case "photo4": return `On-ride Photo 4`;
		case "pizza": return `Pizza`;
		case "popcorn": return `Popcorn`;
		case "pretzel": return `Pretzel`;
		case "roast_sausage": return `Roast Sausage`;
		case "rubbish": return `Rubbish`;
		case "soybean_milk": return `Soy Bean Milk`;
		case "sub_sandwich": return `Sub Sandwich`;
		case "sujeonggwa": return `Sujeonggwa`;
		case "sunglasses": return `Sunglasses`;
		case "tentacle": return `Tentacle`;
		case "toffee_apple": return `Toffee Apple`;
		case "toy": return `“${park.name}” Cuddly Toy`;
		case "tshirt": return `“${park.name}” T-shirt`;
		case "umbrella": return `“${park.name}” Umbrella`;
		case "voucher": return `Voucher`;
		case "wonton_soup": return `Wonton Soup`;
	}
}

function visibilityCheck(item: GuestItemType): Bindable<ElementVisibility> {
		return compute(model._selectedPeep, model._hasItem, (p, h) => p && h[guestItemTypeList.indexOf(item)] ? "visible" : "none")
}

function carryingItems(): WidgetCreator<FlexiblePosition>[] {
	const guest = <Guest>model._selectedPeep.get();
	if (guest !== undefined && guest.items.length === 0) {
		return [label({ text: "Nothing", alignment: "centred" })]
	}
	else {
		let widgetArray: WidgetCreator<FlexiblePosition>[] = []
		guestItemTypeList.forEach(item => widgetArray.push(createWidget(item)))
		return widgetArray;
	}
}
function itemList(): string[] {
	let itemNameArray: string[] = []
	guestItemTypeList.forEach(item => itemNameArray.push(itemName(item)))
	return itemNameArray;
}