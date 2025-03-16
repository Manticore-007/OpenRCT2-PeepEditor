
/// <reference path="../../lib/openrct2.d.ts" />

import { button, horizontal, label, tab, tabwindow, vertical, twoway, compute, Colour, window, groupbox, spinner, dropdown, textbox, colourPicker, graphics, checkbox, store, WidgetCreator, FlexiblePosition, Parsed, Bindable, ElementVisibility, Padding } from "openrct2-flexui";
import { model } from "../viewmodel/peepViewModel";
import { debug } from "../helpers/logger";
import { movePeepExecuteArgs } from "../actions/peepMover";
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
import { percentage, progressBar, ProgressBarColour } from "../helpers/progressBar";
import { guestItemTypeList } from "../helpers/guestItemTypes";
import { guestItemRemoveExecuteArgs } from "../actions/guestItemRemove";
import { peepRotateExecuteArgs } from "../actions/peepRotater";
import { getWindow } from "../helpers/getWindow";
import { getColour } from "../helpers/settings";
import { guestConditionExecuteArgs } from "../actions/guestCondition";

const securityOrders = store<boolean>(true);
const entertainerOrders = store<boolean>(true);

const pointingFingerIcon: ImageAnimation = { frameBase: 5318, frameCount: 8, frameDuration: 2, };
const mapIcon: ImageAnimation = { frameBase: context.getIcon("map"), frameCount: 1, frameDuration: 4, offset: { x: 4, y: 1 }};
const eyeIcon: ImageAnimation = { frameBase: context.getIcon("view"), frameCount: 1, frameDuration: 4, offset: { x: 1, y: -1 }};

const itemsIcon: number = 5326;
const moodIcon: number = 5288;

const copyPasteButtons: WidgetCreator<FlexiblePosition> =	
	vertical({
		content: [
			button({	//copy
				height: 24,
				width: 24,
				image: "copy",
				padding: { top: 2, left: -2, bottom: -2, right: -2 },
				disabled: true
			}),
			button({	//paste
				height: 24,
				width: 24,
				image: "paste",
				padding: { top: 0, left: -2, bottom: -2, right: -2 },
				disabled: true
			})
		]
	});

let main: Window | undefined;
let side: Window | undefined;

let multiplier: number = 1;

export const sideWindowColour = {
    primary: store<Colour>(getColour("pe.side.primary", Colour.DarkYellow)),
    secondary: store<Colour>(getColour("pe.side.secondary", Colour.DarkYellow)),
    tertiary: store<Colour>(Colour.DarkYellow),
};

export const sideWindow = tabwindow({
	title: "Properties",
	width: 260,
	height: 230,
	colours: [sideWindowColour.primary.get(), sideWindowColour.secondary.get(), sideWindowColour.tertiary.get()],
	padding: 5,
	onTabChange: () => ui.tool?.cancel(),
	onUpdate: () => {
		isSideWindowSticky();
		if (side) {side.colours = [sideWindowColour.primary.get(), sideWindowColour.secondary.get(), sideWindowColour.tertiary.get()];}
	},
	onOpen: () => {
		main = getWindow(model._name.get());
		side = getWindow("Properties");
		model._open();
	},
	onClose: () => {
		ui.tool?.cancel();
		model._reset();
		multiplier = 1;
	},
	tabs: [
		tab({	//location
			image: mapIcon,
			height: "inherit",
			spacing: 0,
			content: [
				horizontal([
					groupbox({
						text: "Kinematics",
						spacing: 0,
						content: [
							horizontal([
								label({
									text: "X position:",
									height: 13,
									padding: {top: 1, bottom: 1, left: 10},
									disabled: compute(model._isFrozen, model._isStatic, (f, s) => !f && !s),
								}),
								spinner({
									minimum: compute(model._allGuestsSelected, a => a ? -(2^31) : 0 ),
									value: model._x,
									height: 13,
									width: "55%",
									padding: {top: 1, right: 10,  bottom: 1},
									disabled: compute(model._isFrozen, model._isStatic, (f, s) => !f && !s),
									disabledMessage: "Peep not static",
									onChange: (_, adjustment: number) => {
										model._allGuests.get().forEach(guest => {
										if (guest !== undefined)
										context.executeAction("pe-movepeep", movePeepExecuteArgs(guest.id, "x", (adjustment*multiplier)));
									});
								}
								})
							]),
							horizontal([
								label({
									text: "Y position:",
									height: 13,
									padding: {top: 1, bottom: 1, left: 10},
									disabled: compute(model._isFrozen, model._isStatic, (f, s) => !f && !s),
								}),
								spinner({
									minimum: compute(model._allGuestsSelected, a => a ? -(2^31) : 0 ),
									value: model._y,
									height: 13,
									width: "55%",
									padding: {top: 1, right: 10,  bottom: 1},
									disabled: compute(model._isFrozen, model._isStatic, (f, s) => !f && !s),
									disabledMessage: "Peep not static",
									onChange: (_, adjustment: number) => {
										model._allGuests.get().forEach(guest => {
										if (guest !== undefined)
										context.executeAction("pe-movepeep", movePeepExecuteArgs(guest.id, "y", (adjustment*multiplier)));
									});
								}
								})
							]),
							horizontal([
								label({
									text: "Z position:",
									height: 13,
									padding: {top: 1, bottom: 1, left: 10},
									disabled: compute(model._isFrozen, model._isStatic, (f, s) => !f && !s),
								}),
								spinner({
									minimum: compute(model._allGuestsSelected, a => a ? -(2^31) : 0 ),
									value: model._z,
									height: 13,
									width: "55%",
									padding: {top: 1, right: 10,  bottom: 1},
									disabled: compute(model._isFrozen, model._isStatic, (f, s) => !f && !s),
									disabledMessage: "Peep not static",
									onChange: (_, adjustment: number) => {
										model._allGuests.get().forEach(guest => {
										if (guest !== undefined)
										context.executeAction("pe-movepeep", movePeepExecuteArgs(guest.id, "z", (adjustment*multiplier)));
									});
									}
								})
							]),
							horizontal([
								label({
									text: "Speed:",
									height: 13,
									padding: {top: 10, bottom: 5, left: 10},
									disabled: model._isStatic,
									visibility: compute(model._isStaff, s => s ? "visible" : "none"),
								}),
								spinner({
									minimum: 32,
									maximum: 128,
									wrapMode: "clamp",
									value: model._energy,
									height: 13,
									width: "55%",
									padding: {top: 10, right: 10, bottom: 5},
									disabled: model._isStatic,
									visibility: compute(model._isStaff, s => s ? "visible" : "none"),
									disabledMessage: "Peep not moving",
									onChange: (_, adjustment: number) => {
										const peep = model._selectedPeep.get();
										if (peep)
											context.executeAction("pe-guestcondition", guestConditionExecuteArgs(peep.id, (adjustment * multiplier), "energy"));
									}
								})
							]),
							button({ //rotate peep
								height: 24,
								width: 24,
								padding: {left: "1w", top: 5},
								border: false,
								image: "rotate_arrow",
								tooltip: "Rotate a static peep",
								disabled: compute(model._isStatic, s => !s),
								onClick: () => context.executeAction("pe-peeprotate", peepRotateExecuteArgs())
							}),
						]
					}),
					copyPasteButtons
				]),
				horizontal([
					label({
						text: "Multiplier:",
						height: 13,
						padding: ["1w", 0, 7, "1w"],
					}),
					dropdown({
						padding: ["1w", 15, 7, -10],
						width: "25%",
						height: 13,
						items: ["1x", "10x", "100x", "1000x"],
						onChange: (number: number) => {
							if (number === 0) multiplier = 1;
							if (number === 1) multiplier = 10;
							if (number === 2) multiplier = 100;
							if (number === 3) multiplier = 1000;
							debug(`Multiplier set to ${multiplier}`);
						}
					})
				]),
			]
		}),
		tab({ //appearance
			image: eyeIcon,
			height: "inherit",
			content: [
				horizontal([
				vertical([
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
								visibility: compute(model._isStaff, s => s ? "visible" : "none"),
								padding: { left: 10 },
							}),
							dropdown({
								height: 13,
								width: "55%",
								visibility: compute(model._isStaff, s => s ? "visible" : "none"),
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
								visibility: compute(model._isEntertainer, e => e ? "visible" : "none"),
								padding: { left: 10 },
							}),
							dropdown({
								height: 13,
								width: "55%",
								visibility: compute(model._isEntertainer, e => e ? "visible" : "none"),
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
								visibility: compute(model._isStaff, s => s ? "visible" : "none"),
								padding: { left: 10 },
							}),
							textbox({
								text: compute(model._colour, c => colourList[c] || ""),
								width: "51%",
								height: 13,
								visibility: compute(model._isStaff, s => s ? "visible" : "none"),
								disabled: true,
							}),
							colourPicker({
								colour: compute(model._colour, c => (c) || 0),
								visibility: compute(model._isStaff, s => s ? "visible" : "none"),
								padding: { right: 10 },
								onChange: (colour) => {
									const peep = model._selectedPeep.get();
									if (peep) {
										context.executeAction("pe-colourpeep", colourPeepExecuteArgs(peep.id, colour));
									}
								}
							})
						]),
					]
				}),
				groupbox({
					text: "Guest appearance",
					spacing: 1,
					visibility: compute(model._isGuest, model._allGuestsSelected, (g, a) => g || a ? "visible" : "none"),
					content: [
						horizontal([
							graphics({
								height: 16,
								width: 16,
								padding: { left: 9 },
								visibility: compute(model._isGuest, model._allGuestsSelected, (g, a) => g || a ? "visible" : "none"),
								onDraw: function (g) { drawImage(g, 5081, "tshirtColour"); },
							}),
							colourPicker({
								colour: model._tshirtColour,
								visibility: compute(model._isGuest, model._allGuestsSelected, (g, a) => g || a ? "visible" : "none"),
								onChange: (colour) => {
									const allGuests = model._allGuests.get();
									if (allGuests !== undefined) {
										allGuests.forEach( guest => {
										context.executeAction("pe-colourpeep", colourPeepExecuteArgs(guest.id, colour, "tshirtColour"));
										});
									}
								}
							}),
							graphics({
								height: 16,
								width: 16,
								padding: { top: -1, left: 5 },
								visibility: compute(model._isGuest, model._allGuestsSelected, (g, a) => g || a ? "visible" : "none"),
								onDraw: function (g) { drawImage(g, customImageFor("trousers"), "trousersColour"); },
							}),
							colourPicker({
								colour: model._trousersColour,
								visibility: compute(model._isGuest, model._allGuestsSelected, (g, a) => g || a ? "visible" : "none"),
								onChange: (colour) => {
									const allGuests = model._allGuests.get();
									if (allGuests !== undefined) {
										allGuests.forEach( guest => {
										context.executeAction("pe-colourpeep", colourPeepExecuteArgs(guest.id, colour, "trousersColour"));
										});
									}
								}
							}),
							graphics({
								height: 16,
								width: 16,
								padding: { left: 5 },
								disabled: compute(model._hasHat, model._allGuestsSelected, (h, a) => !h || !a),
								visibility: compute(model._isGuest, model._allGuestsSelected, (g, a) => g || a ? "visible" : "none"),
								onDraw: function (g) { drawImage(g, 5079, "hatColour"); },
							}),
							colourPicker({
								colour: model._hatColour,
								disabled: compute(model._hasHat, model._allGuestsSelected, (h, a) => !h && !a),
								visibility: compute(model._isGuest, model._allGuestsSelected, (g, a) => g || a ? "visible" : "none"),
								onChange: (colour) => {
									const allGuests = model._allGuests.get();
									if (allGuests !== undefined) {
										allGuests.forEach( guest => {
										context.executeAction("pe-colourpeep", colourPeepExecuteArgs(guest.id, colour, "hatColour"));
									});
								}
								}
							}),
							graphics({
								height: 16,
								width: 16,
								padding: { left: 5 },
								disabled: compute(model._hasBalloon, model._allGuestsSelected, (b, a) => !b && !a),
								visibility: compute(model._isGuest, model._allGuestsSelected, (g, a) => g || a ? "visible" : "none"),
								onDraw: function (g) { drawImage(g, 5061, "balloonColour"); },
							}),
							colourPicker({
								colour: model._balloonColour,
								disabled: compute(model._hasBalloon, model._allGuestsSelected, (b, a) => !b && !a),
								visibility: compute(model._isGuest, model._allGuestsSelected, (g, a) => g || a ? "visible" : "none"),
								onChange: (colour) => {
									const allGuests = model._allGuests.get();
									if (allGuests !== undefined) {
										allGuests.forEach( guest => {
										context.executeAction("pe-colourpeep", colourPeepExecuteArgs(guest.id, colour, "balloonColour"));
									});
								}
								}
							}),
							graphics({
								height: 16,
								width: 16,
								padding: { left: 5 },
								disabled: compute(model._hasUmbrella, model._allGuestsSelected, (u, a) => !u && !a),
								visibility: compute(model._isGuest, model._allGuestsSelected, (g, a) => g || a ? "visible" : "none"),
								onDraw: function (g) { drawImage(g, 5065, "umbrellaColour"); },
							}),
							colourPicker({
								colour: model._umbrellaColour,
								disabled: compute(model._hasUmbrella, model._allGuestsSelected, (u, a) => !u && !a),
								visibility: compute(model._isGuest, model._allGuestsSelected, (g, a) => g || a ? "visible" : "none"),
								padding: { right: 9 },
								onChange: (colour) => {
									const allGuests = model._allGuests.get();
									if (allGuests !== undefined) {
										allGuests.forEach( guest => {
										context.executeAction("pe-colourpeep", colourPeepExecuteArgs(guest.id, colour, "umbrellaColour"));
									});
								}
								}
							})
						]),
					]
				}),
				groupbox({
					text: "Animation",
					content: [
						horizontal([
							label({
								text: "Animation:",
								height: 13,
								padding: { left: 10 },
							}),
							dropdown({	//Guest
								height: 13,
								width: "55%",
								padding: { right: 10, },
								visibility: compute(model._isGuest, model._allGuestsSelected, (g, a) => g || a ? "visible" : "none"),
								items: compute(model._availableAnimations, a => a.map(animationList)),
								selectedIndex: compute(model._animation, a => model._availableGuestAnimations.get().indexOf(<GuestAnimation>a)),
								onChange: (index) => {
									const allGuests = model._allGuests.get();
									if (allGuests !== undefined) {
										allGuests.forEach( guest => {
										context.executeAction("pe-animationpeep", animationPeepExecuteArgs(guest.id, model._availableAnimations.get()[index]));
									});
								}
								}
							}),
							dropdown({ 	//Staff
								height: 13,
								width: "55%",
								padding: { right: 10, },
								visibility: compute(model._isStaff, s => (s)? "visible" : "none"),
								items: compute(model._availableAnimations, a => a.map(animationList)),
								selectedIndex: compute(model._animation, a => model._availableStaffAnimations.get().indexOf(<StaffAnimation>a)),
								onChange: (index) => {
									const peep = model._selectedPeep.get();
									if (peep){
										context.executeAction("pe-animationpeep", animationPeepExecuteArgs(peep.id, model._availableAnimations.get()[index]));
									}
								}
							})
						]),
						horizontal([
							label({
								text: compute(model._animationLength, l => `Frame: (max: ${l-1})` || "Frame:"),
								height: 13,
								disabled: compute(model._isFrozen, f => !f),
								padding: { left: 10 },
							}),
							spinner({
								height: 13,
								width: "55%",
								disabled: compute(model._isFrozen, f => !f),
								disabledMessage: "Peep not frozen",
								padding: { right: 10 },
								value: model._animationFrame,
								maximum: compute(model._animationLength, l => l-1),
								wrapMode: "wrap",
								onChange: (value, adjustment) => {
									const peep = model._selectedPeep.get();
									if (peep){
										context.executeAction("pe-animationframepeep", animationFramePeepExecuteArgs(peep.id, value, adjustment));
									}
								}
							})
						]),
					]
				}),
			]),
			copyPasteButtons
		])
			]
		}),
		tab({
			image: pointingFingerIcon,
			height: "inherit",
			spacing: 0,
			content: [
				horizontal([
				groupbox ({
					text: "Staff orders",
					spacing: 2,
					gap: {top: 16, bottom: 16},
					visibility: compute(model._isStaff, s => s ? "visible" : "none"),
					content: [
						checkbox({
							text: "{INLINE_SPRITE}{247}{19}{0}{0} Sweep foothpaths",
							visibility: compute(model._isHandyman, model._isStaff, (h, s) => h && s ? "visible" : "none"),
							padding: {left: 10},
							isChecked: compute(model._orders, o => (o & (1 << 0)) !== 0),
							onChange: (checked) => {
								const peep = model._selectedPeep.get();
								if (peep) {
									context.executeAction("pe-stafforders", staffOrdersExecuteArgs(peep.id, checked, (1 << 0)));
								}
							}
						}),
						checkbox({
							text: "{INLINE_SPRITE}{248}{19}{0}{0} Water gardens",
							visibility: compute(model._isHandyman, model._isStaff, (h, s) => h && s ? "visible" : "none"),
							padding: {left: 10},
							isChecked: compute(model._orders, o => (o & (1 << 1)) !== 0),
							onChange: (checked) => {
								const peep = model._selectedPeep.get();
								if (peep) {
									context.executeAction("pe-stafforders", staffOrdersExecuteArgs(peep.id, checked, (1 << 1)));
								}
							}
						}),
						checkbox({
							text: "{INLINE_SPRITE}{249}{19}{0}{0} Empty litter bins",
							visibility: compute(model._isHandyman, model._isStaff, (h, s) => h && s ? "visible" : "none"),
							padding: {left: 10},
							isChecked: compute(model._orders, o => (o & (1 << 2)) !== 0),
							onChange: (checked) => {
								const peep = model._selectedPeep.get();
								if (peep) {
									context.executeAction("pe-stafforders", staffOrdersExecuteArgs(peep.id, checked, (1 << 2)));
								}
							}
						}),
						checkbox({
							text: "{INLINE_SPRITE}{250}{19}{0}{0} Mow grass",
							visibility: compute(model._isHandyman, model._isStaff, (h, s) => h && s ? "visible" : "none"),
							padding: {left: 10},
							isChecked: compute(model._orders, o => (o & (1 << 3)) !== 0),
							onChange: (checked) => {
								const peep = model._selectedPeep.get();
								if (peep) {
									context.executeAction("pe-stafforders", staffOrdersExecuteArgs(peep.id, checked, (1 << 3)));
								}
							}
						}),
						checkbox({
							text: "{INLINE_SPRITE}{251}{19}{0}{0} Inspect rides",
							visibility: compute(model._isMechanic, model._isStaff, (m, s) => m && s ? "visible" : "none"),
							padding: {left: 10},
							isChecked: compute(model._orders, o => (o & (1 << 0)) !== 0),
							onChange: (checked) => {
								const peep = model._selectedPeep.get();
								if (peep) {
									context.executeAction("pe-stafforders", staffOrdersExecuteArgs(peep.id, checked, (1 << 0)));
								}
							}
						}),
						checkbox({
							text: "{INLINE_SPRITE}{252}{19}{0}{0} Fix Rides",
							visibility: compute(model._isMechanic, model._isStaff, (m, s) => m && s ? "visible" : "none"),
							padding: {left: 10},
							isChecked: compute(model._orders, o => (o & (1 << 1)) !== 0),
							onChange: (checked) => {
								const peep = model._selectedPeep.get();
								if (peep) {
									context.executeAction("pe-stafforders", staffOrdersExecuteArgs(peep.id, checked, (1 << 1)));
								}
							}
						}),
						checkbox({
							text: "{INLINE_SPRITE}{253}{19}{0}{0} Surveilling park",
							visibility: compute(model._isSecurity, model._isStaff, (sc, s) => sc && s ? "visible" : "none"),
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
							visibility: compute(model._isEntertainer, model._isStaff, (e, s) => e && s ? "visible" : "none"),
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
					visibility: compute(model._isGuest, model._allGuestsSelected, (g, a) => g || a ? "visible" : "none"),
					content: [
						horizontal([
							vertical([
								createFlagCheckboxWidget("leavingPark", {bottom: -3, left: 10 }),
								createFlagCheckboxWidget("slowWalk", {top: -2, bottom: -3, left: 10 }),
								createFlagCheckboxWidget("tracking", {top: -2, bottom: -3, left: 10 }),
								createFlagCheckboxWidget("waving", {top: -2, bottom: -3, left: 10 }),
								createFlagCheckboxWidget("photo", {top: -2, bottom: -3, left: 10 }),
								createFlagCheckboxWidget("painting", {top: -2, bottom: -3, left: 10 }),
								createFlagCheckboxWidget("wow", {top: -2, bottom: -3, left: 10 }),
								createFlagCheckboxWidget("litter", {top: -2, bottom: -3, left: 10 }),
								createFlagCheckboxWidget("lost", {top: -2, bottom: -3, left: 10 }),
								createFlagCheckboxWidget("hunger", {top: -2, bottom: -3, left: 10 }),
								createFlagCheckboxWidget("toilet", {top: -2, bottom: 5, left: 10 }),
							]),
							vertical([
								createFlagCheckboxWidget("crowded", {bottom: -3}),
								createFlagCheckboxWidget("happiness", {top: -2, bottom: -3}),
								createFlagCheckboxWidget("nausea", {top: -2, bottom: -3}),
								createFlagCheckboxWidget("purple", {top: -2, bottom: -3}),
								createFlagCheckboxWidget("pizza", {top: -2, bottom: -3}),
								createFlagCheckboxWidget("explode", {top: -2, bottom: -3}),
								createFlagCheckboxWidget("contagious", {top: -2, bottom: -3}),
								createFlagCheckboxWidget("joy", {top: -2, bottom: -3}),
								createFlagCheckboxWidget("angry", {top: -2, bottom: -3}),
								createFlagCheckboxWidget("iceCream", {top: -2, bottom: -3}),
								createFlagCheckboxWidget("hereWeAre", {top: -2, bottom: 5}),
							])
						])
					],
				}),
				copyPasteButtons
			])
			]
		}),
		tab({
			image: moodIcon,
			height: "inherit",
			spacing: 0,
			content: [
				horizontal([
					groupbox({
						text: "Physiology",
						visibility: compute(model._isGuest, model._allGuestsSelected, (g, a) => !g && !a ? "visible" : "none"),
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
						]
					}),
					groupbox({
						text: "Physiology",
						visibility: compute(model._allGuestsSelected, a => a ? "visible" : "none"),
						content: [
							label({
								text: `{BLACK}Under Construction`,
								alignment: "centred",
								visibility: compute(model._allGuestsSelected, a => a ? "visible" : "none"),
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
									padding: { top: 0, bottom: 0, left: 5 },
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
								}),
								progressBar({
									background: ProgressBarColour.background,
									percentFilled: compute(model._happiness, h => percentage(h, 255)),
									isPositive: true,
									foreground: compute(model._happiness, h => percentage(h, 255)),
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
								}),
								spinner({
									minimum: 0,
									maximum: 255,
									value: compute(model._happiness, h => h),
									height: 13,
									width: "25%",
									wrapMode: "clamp",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									onChange: (_, adjustment: number) => {
										const peep = model._selectedPeep.get();
										if (peep)
											context.executeAction("pe-guestcondition", guestConditionExecuteArgs(peep.id, (adjustment * multiplier), "happiness"));
									}
								})
							]),
							horizontal([
								label({
									text: "Energy:",
									height: 13,
									width: "30%",
									padding: { top: 0, bottom: 0, left: 5 },
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
								}),
								progressBar({
									background: ProgressBarColour.background,
									percentFilled: compute(model._energy, h => percentage(h, 128)),
									isPositive: true,
									foreground: compute(model._energy, e => percentage(e, 128)),
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
								}),
								spinner({
									minimum: 32,
									maximum: 128,
									wrapMode: "clamp",
									value: compute(model._energy, e => e),
									height: 13,
									width: "25%",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									onChange: (_, adjustment: number) => {
										const peep = model._selectedPeep.get();
										if (peep)
											context.executeAction("pe-guestcondition", guestConditionExecuteArgs(peep.id, (adjustment * multiplier), "energy"));
									}
								})
							]),
							horizontal([
								label({
									text: "Hunger:",
									height: 13,
									width: "30%",
									padding: { top: 0, bottom: 0, left: 5 },
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
								}),
								progressBar({
									background: ProgressBarColour.background,
									percentFilled: compute(model._hunger, h => 1 - percentage(h, 255)),
									isPositive: false,
									foreground: compute(model._hunger, h => 1 - percentage(h, 255)),
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
								}),
								spinner({
									minimum: 0,
									maximum: 255,
									wrapMode: "clamp",
									value: compute(model._hunger, h => 255 - h),
									height: 13,
									width: "25%",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									onChange: (_, adjustment: number) => {
										const peep = model._selectedPeep.get();
										if (peep)
											context.executeAction("pe-guestcondition", guestConditionExecuteArgs(peep.id, (adjustment * multiplier), "hunger"));
									}
								})
							]),
							horizontal([
								label({
									text: "Thirst:",
									height: 13,
									width: "30%",
									padding: { top: 0, bottom: 0, left: 5 },
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
								}),
								progressBar({
									background: ProgressBarColour.background,
									percentFilled: compute(model._thirst, t => 1 - percentage(t, 255)),
									isPositive: false,
									foreground: compute(model._thirst, t => 1 - percentage(t, 255)),
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
								}),
								spinner({
									minimum: 0,
									maximum: 255,
									wrapMode: "clamp",
									value: compute(model._thirst, t => 255 - t),
									height: 13,
									width: "25%",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									onChange: (_, adjustment: number) => {
										const peep = model._selectedPeep.get();
										if (peep)
											context.executeAction("pe-guestcondition", guestConditionExecuteArgs(peep.id, (adjustment * multiplier), "thirst"));
									}
								})
							]),
							horizontal([
								label({
									text: "Nausea:",
									height: 13,
									width: "30%",
									padding: { top: 0, bottom: 0, left: 5 },
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
								}),
								progressBar({
									background: ProgressBarColour.background,
									percentFilled: compute(model._nausea, n => percentage(n, 255)),
									isPositive: false,
									foreground: (compute(model._nausea, n => percentage(n, 255))),
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
								}),
								spinner({
									minimum: 0,
									maximum: 255,
									wrapMode: "clamp",
									value: compute(model._nausea, n => n),
									height: 13,
									width: "25%",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									onChange: (_, adjustment: number) => {
										const peep = model._selectedPeep.get();
										if (peep)
											context.executeAction("pe-guestcondition", guestConditionExecuteArgs(peep.id, (adjustment * multiplier), "nausea"));
									}
								})
							]),
							horizontal([
								label({
									text: "Toilet:",
									height: 13,
									width: "30%",
									padding: { top: 0, bottom: 0, left: 5 },
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
								}),
								progressBar({
									background: ProgressBarColour.background,
									percentFilled: compute(model._toilet, t => percentage(t, 255)),
									isPositive: false,
									foreground: compute(model._toilet, t => percentage(t, 255)),
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
								}),
								spinner({
									minimum: 0,
									maximum: 255,
									wrapMode: "clamp",
									value: compute(model._toilet, t => t),
									height: 13,
									width: "25%",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									onChange: (_, adjustment: number) => {
										const peep = model._selectedPeep.get();
										if (peep)
											context.executeAction("pe-guestcondition", guestConditionExecuteArgs(peep.id, (adjustment * multiplier), "toilet"));
									}
								})
							]),
							horizontal([
								label({
									text: "Mass:",
									height: 13,
									width: "30%",
									padding: { top: 0, bottom: 0, left: 5 },
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
								}),
								progressBar({
									background: ProgressBarColour.background,
									percentFilled: compute(model._mass, m => percentage(m, 255)),
									isPositive: false,
									foreground: (compute(model._mass, m => percentage(m, 255))),
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
								}),
								spinner({
									minimum: 0,
									maximum: 255,
									wrapMode: "clamp",
									value: compute(model._mass, m => m),
									height: 13,
									width: "25%",
									visibility: compute(model._isGuest, g => g ? "visible" : "none"),
									onChange: (_, adjustment: number) => {
										const peep = model._selectedPeep.get();
										if (peep)
											context.executeAction("pe-guestcondition", guestConditionExecuteArgs(peep.id, (adjustment * multiplier), "mass"));
									}
								})
							]),
						]
					}),
				copyPasteButtons
			]),
				horizontal([
					label({
						text: "Multiplier:",
						height: 13,
						padding: ["1w", -20, 7, "1w"],
						visibility: compute(model._isGuest, g => g ? "visible" : "none"),
					}),
					dropdown({
						padding: ["1w", 15, 7, -20],
						width: "20%",
						height: 13,
						items: ["1x", "10x", "100x"],
						visibility: compute(model._isGuest, g => g ? "visible" : "none"),
						onChange: (number: number) => {
							if (number === 0) multiplier = 1;
							if (number === 1) multiplier = 10;
							if (number === 2) multiplier = 100;
							debug(`Multiplier set to ${multiplier}`);
						}
					})
				]),
			]
		}),		
		tab({
			height: "inherit",
			image: itemsIcon,
			spacing: 0,
			content: [
				groupbox({
					text: "Items",
					visibility: compute(model._isPeepSelected, model._allGuestsSelected, (p, a) => !p && !a ? "visible" : "none"),
					content: [
						label({
							text: "Organise a guest's inventory",
							alignment: "centred",
							visibility: compute(model._isPeepSelected, model._allGuestsSelected, (p, a) => !p && !a ? "visible" : "none"),
						})
					]
				}),
				groupbox({
					text: "Items",
					visibility: compute(model._isStaff, model._allGuestsSelected, (s, a) => s || a ? "visible" : "none"),
					content: [
						label({
							text: `{BLACK}Under Construction`,
							alignment: "centred",
							visibility: compute(model._isStaff, model._allGuestsSelected, (s, a) => s || a ? "visible" : "none"),
						}),
					]
				}),
				groupbox({
					text: "Carrying",
					padding: {bottom: 4},
					spacing: 0,
					visibility: compute(model._isGuest, model._isPeepSelected, (g, p) => g && p ? "visible" : "none"),
					content: carryingItems()
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
							model._item.set(item);
						}
					}),
				]),
				horizontal([
					label({
						text: "Voucher:",
						height: 13,
						padding: {bottom: 4},
						visibility: compute(model._item, i => (i === "voucher") ? "visible" : "none"),
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
						items: compute(model._rideList, c => c.map(r => r._ride().name)),
						selectedIndex: compute(model._selectedRide, r => r ? r[1] : 0),
						disabledMessage: "No rides in this park",
						autoDisable: "empty",
						height: 13,
						padding: {bottom: 4},
						width: "75%",
						visibility: compute(model._item, model._voucherType, (i, v) => (i === "photo1" || i === "photo2" || i === "photo3" || i === "photo4" || (i === "voucher" && v === "ride_free")) ? "visible" : "none"),
						onChange: (idx) => {
							const rideId = compute(model._rideList, c => c.map(r => r._ride().id));
							model._rideId.set(rideId.get()[idx]);
							model._voucher.set(<RideVoucher>{type: "voucher", voucherType: "ride_free", rideId: model._rideId.get()});
						}
					}),
				]),
				horizontal([
					label({
						text: "Free item:",
						height: 13,
						padding: {bottom: 4},
						visibility: compute(model._item, model._voucherType, (i, v) => (v === "food_drink_free" && i === "voucher") ? "visible" : "none"),
					}),
					dropdown({
						items: itemList(),
						height: 13,
						padding: {bottom: 4},
						width: "75%",
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
					}),
					button({
						text: `Add item`,
						visibility: compute(model._isGuest, g => g ? "visible" : "none"),
						height: 13,
						width: "25%",
						onClick: () => {
							const guest = <Guest>model._selectedPeep.get();
							const item = model._item.get();
							const rideId = model._rideId.get();
							if (guest.hasItem({type: item}) && item !== "voucher" && item !== "photo1" && item !== "photo2" && item !== "photo3" && item !== "photo4"){
								ui.showError("Guest already", "has this item");
								return;
							}
							if (map.getRide(rideId) === null && (item === "photo1" || item === "photo2" || item === "photo3" || item === "photo4" || model._voucherType.get() === "ride_free")) {
								ui.showError("There are no rides", "in your park!");
								return;
							}
							switch (model._item.get()) {
								case "voucher": guest.giveItem(model._voucher.get()); break;
								case "photo1": guest.giveItem(<GuestPhoto>{type: "photo1", rideId: model._rideId.get()}); break;
								case "photo2": guest.giveItem(<GuestPhoto>{type: "photo2", rideId: model._rideId.get()}); break;
								case "photo3": guest.giveItem(<GuestPhoto>{type: "photo3", rideId: model._rideId.get()}); break;
								case "photo4": guest.giveItem(<GuestPhoto>{type: "photo4", rideId: model._rideId.get()}); break;
								default: guest.giveItem({type: item});
							}
							//
						}
					})
				])
			]
		}),
	]
});

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
					onClick: () => removeItemWindow.close()
				}),
			])
		]
	});
	removeItemWindow.open();
}

function drawImage(g: GraphicsContext, image: number, property?: keyof Guest): void
{
    const img = g.getImage(image);
    const guest = <Guest>model._selectedPeep.get();
	if (model._allGuestsSelected.get())
	{
		if (img) {
			g.paletteId = Colour.Yellow;
			g.tertiaryColour = Colour.Yellow;
			g.image(img.id, 0, 0);
		}
	}
    else if (property === "tshirtColour" || property === "trousersColour" || (property === "hatColour" && guest.hasItem({type: "hat"})) || (property === "umbrellaColour" && guest.hasItem({type: "umbrella"})) || (property === "balloonColour" && guest.hasItem({type: "balloon"})))
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

function createFlagCheckboxWidget(flag: PeepFlags, padding?: Padding | undefined): WidgetCreator<FlexiblePosition> {
	const capitalizedFlag = flag.charAt(0).toUpperCase() + flag.slice(1);
	const splitFlag = capitalizedFlag.replace(/([A-Z])/g, ' $1');
	return checkbox({
		text: splitFlag,
		visibility: compute(model._isGuest, model._allGuestsSelected, (g, a) => g || a ? "visible" : "none"),
		padding: padding,
		isChecked: compute(model._selectedPeep, p => (p?.getFlag(flag)) ? true : false),
		onChange: (checked) => {
			model._allGuests.get().forEach(guest => {
				if (guest !== undefined) context.executeAction("pe-guestflags", guestFlagsExecuteArgs(guest.id, checked, flag));
			});
		}
	});
}

function createItemWidget(item: GuestItemType): WidgetCreator<FlexiblePosition, Parsed<FlexiblePosition>> {
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
		return compute(model._selectedPeep, model._hasItem, (p, h) => p && h[guestItemTypeList.indexOf(item)] ? "visible" : "none");
}

function carryingItems(): WidgetCreator<FlexiblePosition>[] {
	const widgetArray: WidgetCreator<FlexiblePosition>[] = [];
	guestItemTypeList.forEach(item => widgetArray.push(createItemWidget(item)));
	return widgetArray;
}

function itemList(): string[] {
	const itemNameArray: string[] = [];
	guestItemTypeList.forEach(item => itemNameArray.push(itemName(item)));
	return itemNameArray;
}

function isSideWindowSticky(): void {
	if (context.sharedStorage.get("pe.sticky"))
		if (main && side) {
			side.x = main.x + main.width;
			side.y = main.y;
		}
		else return;
}

