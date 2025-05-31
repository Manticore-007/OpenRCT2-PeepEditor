
/// <reference path="../../lib/openrct2.d.ts" />

import { button, horizontal, label, tab, tabwindow, vertical,
		twoway, compute, Colour, window, groupbox, spinner, dropdown,
		textbox, colourPicker, graphics, checkbox, store, WidgetCreator,
		FlexiblePosition, Bindable, ElementVisibility, Padding,
		Store, WritableStore, 
		Parsed} from "openrct2-flexui";
import { model } from "../viewmodel/peepViewModel";
import { movePeepExecuteArgs } from "../actions/peepMover";
import { colourPeepExecuteArgs } from "../actions/peepColour";
import { colourList, GuestColours } from "../helpers/colours";
import { staffType, staffTypeList } from "../helpers/staffTypes";
import { costumeList } from "../helpers/costumes";
import { staffTypeExecuteArgs } from "../actions/staffSetType";
import { staffCostumeExecuteArgs } from "../actions/staffSetCostume";
import { animationPeepExecuteArgs } from "../actions/peepAnimation";
import { animationFramePeepExecuteArgs } from "../actions/peepAnimationFrame";
import { guestFlagsExecuteArgs } from "../actions/guestFlags";
import { percentage, progressBar, ProgressBarColour } from "../helpers/progressBar";
import { guestItemTypeList, itemImage, itemName } from "../helpers/guestItemTypes";
import { guestItemRemoveExecuteArgs } from "../actions/guestItemRemove";
import { peepRotateExecuteArgs } from "../actions/peepRotater";
import { getWindow } from "../helpers/getWindow";
import { getColour } from "../helpers/settings";
import { GuestKey, guestKeysExecuteArgs } from "../actions/guestKeys";
import { customImageFor, drawImage } from "../helpers/customImages";
import { StaffOrderLabel, StaffOrders } from "../helpers/staffOrders";
import { multiplier } from "./UtilityControls";

let main: Window | undefined;
let side: Window | undefined;

const pointingFingerIcon: ImageAnimation = { frameBase: 5318, frameCount: 8, frameDuration: 2, };
const mapIcon: ImageAnimation = { frameBase: context.getIcon("map"), frameCount: 1, frameDuration: 4, offset: { x: 4, y: 1 }};
const eyeIcon: ImageAnimation = { frameBase: context.getIcon("view"), frameCount: 1, frameDuration: 4, offset: { x: 1, y: -1 }};

const itemsIcon: number = 5326;
const moodIcon: number = 5288;

const securityOrders = store<boolean>(true);
const entertainerOrders = store<boolean>(true);

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
	onUpdate: () =>
	{
		isSideWindowSticky();
		if (side) side.colours = [sideWindowColour.primary.get(), sideWindowColour.secondary.get(), sideWindowColour.tertiary.get()];
	},
	onOpen: () =>
	{
		main = getWindow(model._name.get());
		side = getWindow("Properties");
		model._open();
	},
	onClose: () =>
	{
		ui.tool?.cancel();
		model._close();
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
									disabled: model._isPositionDisabled,
								}),
								spinner({
									minimum: compute(model._allGuestsSelected, a => a ? -(2^31) : 0 ),
									value: model._x,
									height: 13,
									width: "55%",
									padding: {top: 1, right: 10,  bottom: 1},
									disabled: model._isPositionDisabled,
									disabledMessage: "Peep not static",
									onChange: (_, adjustment: number) => model._allGuests.get().forEach(guest => context.executeAction("pe-movepeep",movePeepExecuteArgs(guest.id, "x", (adjustment * model._multiplier.get()))))
								})
							]),
							horizontal([
								label({
									text: "Y position:",
									height: 13,
									padding: {top: 1, bottom: 1, left: 10},
									disabled: model._isPositionDisabled,
								}),
								spinner({
									minimum: compute(model._allGuestsSelected, a => a ? -(2^31) : 0 ),
									value: model._y,
									height: 13,
									width: "55%",
									padding: {top: 1, right: 10,  bottom: 1},
									disabled: model._isPositionDisabled,
									disabledMessage: "Peep not static",
									onChange: (_, adjustment: number) => model._allGuests.get().forEach(guest => context.executeAction("pe-movepeep", movePeepExecuteArgs(guest.id, "y", (adjustment * model._multiplier.get()))))
								})
							]),
							horizontal([
								label({
									text: "Z position:",
									height: 13,
									padding: {top: 1, bottom: 1, left: 10},
									disabled: model._isPositionDisabled,
								}),
								spinner({
									minimum: compute(model._allGuestsSelected, a => a ? -(2^31) : 0 ),
									value: model._z,
									height: 13,
									width: "55%",
									padding: {top: 1, right: 10,  bottom: 1},
									disabled: model._isPositionDisabled,
									disabledMessage: "Peep not static",
									onChange: (_, adjustment: number) => model._allGuests.get().forEach(guest => context.executeAction("pe-movepeep", movePeepExecuteArgs(guest.id, "z", (adjustment * model._multiplier.get()))))
								})
							]),
							horizontal([
								label({
									text: "Speed:",
									height: 13,
									padding: {top: 10, bottom: 5, left: 10},
									disabled: model._isStatic,
									visibility: model._visibleWhenStaff,
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
									visibility: model._visibleWhenStaff,
									disabledMessage: "Peep not moving",
									onChange: (_, adjustment: number) =>
									{
										const peep = model._selectedPeep.get();
										if (peep) context.executeAction("pe-guestkeys", guestKeysExecuteArgs(peep.id, (adjustment * model._multiplier.get()), "energy"));
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
					})
				]),
				multiplier()
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
							visibility: model._visibleWhenStaff,
							content: [
								horizontal([
									label({
										text: "Staff type:",
										height: 13,
										visibility: model._visibleWhenStaff,
										padding: { left: 10 },
									}),
									dropdown({
										height: 13,
										width: "55%",
										visibility: model._visibleWhenStaff,
										disabledMessage: "Not available",
										padding: { right: 10 },
										items: staffTypeList,
										selectedIndex: compute(model._staffType, t => staffType.indexOf(t)),
										onChange: (index) =>
										{
											const staff = <Staff>model._selectedPeep.get();
											if (staff !== undefined) context.executeAction("pe-stafftype", staffTypeExecuteArgs(staff.id, staffType[index]));
										}
									})
								]),
								horizontal([
									label({
										text: "Costume:",
										height: 13,
										visibility: compute(model._isEntertainer, model._isGuest, (e, g) => e && !g ? "visible" : "none"),
										padding: { left: 10 },
									}),
									dropdown({
										height: 13,
										width: "55%",
										visibility: compute(model._isEntertainer, model._isGuest, (e, g) => e && !g ? "visible" : "none"),
										disabledMessage: "Not available",
										padding: { right: 10 },
										items: costumeList,
										selectedIndex: compute(model._costume, c => model._availableCostumes.get().indexOf(c)),
										onChange: (index) =>
										{
											const staff = <Staff>model._selectedPeep.get();
											if (staff !== undefined) context.executeAction("pe-staffcostume", staffCostumeExecuteArgs(staff.id, model._availableCostumes.get()[index]));
										}
									})
								]),
								horizontal([
									label({
										text: "Uniform colour:",
										height: 13,
										visibility: model._visibleWhenStaff,
										padding: { left: 10 },
									}),
									textbox({
										text: compute(model._colour, c => colourList[c] || ""),
										width: "51%",
										height: 13,
										visibility: model._visibleWhenStaff,
										disabled: true,
									}),
									colourPicker({
										colour: compute(model._colour, c => (c) || 0),
										visibility: model._visibleWhenStaff,
										padding: { right: 10 },
										onChange: (colour) =>
										{
											const peep = model._selectedPeep.get();
											if (peep) context.executeAction("pe-colourpeep", colourPeepExecuteArgs(peep.id, colour));
										}
									})
								]),
							]
						}),
						groupbox({
							text: "Guest appearance",
							spacing: 1,
							visibility: model._visibleWhenNotStaff,
							content: [
								horizontal([
									createColourPickerWidget(g => drawImage(g, 5081, "tshirtColour"), "tshirtColour"),
									createColourPickerWidget(g => drawImage(g , customImageFor("trousers"), "trousersColour"), "trousersColour"),
									createColourPickerWidget(g => drawImage(g, 5079, "hatColour"), "hatColour"),
									createColourPickerWidget(g => drawImage(g, 5061, "balloonColour"), "balloonColour"),
									createColourPickerWidget(g => drawImage(g, 5065, "umbrellaColour"), "umbrellaColour"),
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
										visibility: model._visibleWhenNotStaff,
										items: model._animationItems,
										selectedIndex: compute(model._animation, a => model._availableGuestAnimations.get().indexOf(<GuestAnimation>a)),
										onChange: (index) =>
										{
											const allGuests = model._allGuests.get();
											if (allGuests !== undefined)
											{
												allGuests.forEach( guest => context.executeAction("pe-animationpeep", animationPeepExecuteArgs(guest.id, model._availableAnimations.get()[index])));
											}
										}
									}),
									dropdown({ 	//Staff
										height: 13,
										width: "55%",
										padding: { right: 10, },
										visibility: model._visibleWhenStaff,
										items: model._animationItems,
										selectedIndex: compute(model._animation, a => model._availableStaffAnimations.get().indexOf(<StaffAnimation>a)),
										onChange: (index) =>
										{
											const peep = model._selectedPeep.get();
											if (peep)
											{
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
										onChange: (value, adjustment) =>
										{
											const peep = model._selectedPeep.get();
											if (peep)
											{
												context.executeAction("pe-animationframepeep", animationFramePeepExecuteArgs(peep.id, value, adjustment));
											}
										}
									})
								]),
							]
						}),
					])
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
						visibility: model._visibleWhenStaff,
						content: [
							createStaffOrdersWidget(StaffOrderLabel.SweepFootpaths, model._visibleWhenHandyman, StaffOrders.SweepFootpaths),
							createStaffOrdersWidget(StaffOrderLabel.WaterGardens, model._visibleWhenHandyman, StaffOrders.WaterGardens),
							createStaffOrdersWidget(StaffOrderLabel.EmptyLitterBins, model._visibleWhenHandyman, StaffOrders.EmptyLitterBins),
							createStaffOrdersWidget(StaffOrderLabel.MowGrass, model._visibleWhenHandyman, StaffOrders.MowGrass),
							createStaffOrdersWidget(StaffOrderLabel.InspectRides, model._visibleWhenMechanic, StaffOrders.InspectRides),
							createStaffOrdersWidget(StaffOrderLabel.FixRides, model._visibleWhenMechanic, StaffOrders.FixRides),
							checkbox({
								text: "{INLINE_SPRITE}{253}{19}{0}{0} Surveilling park",
								visibility: compute(model._isSecurity, model._isGuest, (sc, g) => sc && !g ? "visible" : "none"),
								padding: {left: 10},
								isChecked: twoway(securityOrders),
								onChange: (checked) =>
								{
									if (!checked)
									{
										securityOrders.set(true);
										ui.showError("Can't be turned off", "Security guards never take breaks");
									}
								}
							}),
							checkbox({
								text: "{INLINE_SPRITE}{116}{21}{0}{0} Keep guests happy",
								visibility: compute(model._isEntertainer, model._isGuest, (e, g) => e && !g ? "visible" : "none"),
								padding: {left: 10},
								isChecked: twoway(entertainerOrders),
								onChange: (checked) =>
								{
									if (!checked)
									{
										entertainerOrders.set(true);
										ui.showError("Can't be turned off", "Rule 7: have fun");
									}
								}
							}),
						]
					}),
					groupbox({
						text: "Guest flags",
						visibility: model._visibleWhenNotStaff,
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
					})
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
						visibility: model._visibleWhenStaff,
						content: [
							label({
								text: "All staff members are very happy,",
								alignment: "centred",
								padding: -2,
								visibility: model._visibleWhenStaff,
							}),
							label({
								text: "well fed and hydrated,",
								alignment: "centred",
								padding: -2,
								visibility: model._visibleWhenStaff,
							}),
							label({
								text: "and just had their toilet break.",
								alignment: "centred",
								padding: -2,
								visibility: model._visibleWhenStaff,
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
						visibility: model._visibleWhenSingleGuest,
						content: [
							createGuestKeysWidget("happiness", 255, true, model._happiness),
							createGuestKeysWidget("energy", 128, true, model._energy),
							createGuestKeysWidget("hunger", 255, false, model._hunger),
							createGuestKeysWidget("thirst", 255, false, model._thirst),
							createGuestKeysWidget("nausea", 255, false, model._nausea),
							createGuestKeysWidget("toilet", 255, false, model._toilet),
							createGuestKeysWidget("mass", 255, false, model._mass),
						]
					})
			]),
			multiplier()
			]
		}),		
		tab({
			height: "inherit",
			image: itemsIcon,
			spacing: 0,
			content: [
				groupbox({
					text: "Items",
					visibility: model._visibleWhenNoPeepSelected,
					content: [
						label({
							text: "Organise a guest's inventory",
							alignment: "centred",
							visibility: model._visibleWhenNoPeepSelected,
						})
					]
				}),
				groupbox({
					text: "Items",
					visibility: compute(model._isGuest, model._allGuestsSelected, (g, a) => !g || a ? "visible" : "none"),
					content: [
						label({
							text: `{BLACK}Under Construction`,
							alignment: "centred",
							visibility: compute(model._isGuest, model._allGuestsSelected, (g, a) => !g || a ? "visible" : "none"),
						}),
					]
				}),
				groupbox({
					text: "Carrying",
					padding: {bottom: 4},
					spacing: 0,
					visibility: compute(model._isGuest, model._isPeepSelected, (g, p) => g && p ? "visible" : "none"),
					content: []
					
				}),
				horizontal([
					label({
						text: "Item:",
						height: 13,
						visibility: model._visibleWhenSingleGuest,
						padding: {bottom: 4},
					}),
					dropdown({
						items: itemList(),
						height: 13,
						width: "75%",
						padding: {bottom: 4},
						visibility: model._visibleWhenSingleGuest,
						onChange: (idx) => 
						{
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
						onChange: (idx) =>
						{
							switch (idx) {
								case 0: model._voucher.set(<Voucher>{type: "voucher", voucherType: "entry_free"});model._voucherType.set("entry_free"); break;
								case 1: model._voucher.set(<Voucher>{type: "voucher", voucherType: "entry_half_price"});model._voucherType.set("entry_half_price"); break;
								case 2: model._voucherType.set("food_drink_free"); model._voucher.set(<FoodDrinkVoucher>{type: "voucher", voucherType: model._voucherType.get(), item: model._voucherItem.get()}); break;
								case 3: model._voucher.set(<RideVoucher>{type: "voucher", voucherType: "ride_free", rideId: model._rideId.get()});model._voucherType.set("ride_free"); break;
							}
						}
					})
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
						onChange: (idx) =>
						{
							const rideId = compute(model._rideList, c => c.map(r => r._ride().id));
							model._rideId.set(rideId.get()[idx]);
							model._voucher.set(<RideVoucher>{type: "voucher", voucherType: "ride_free", rideId: model._rideId.get()});
						}
					})
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
						onChange: (idx) =>
						{
							const item = guestItemTypeList[idx];
							model._voucherItem.set(item);
							model._voucher.set(<FoodDrinkVoucher>{type: "voucher", voucherType: "food_drink_free", item: model._voucherItem.get()});
						}
					})
				]),
				horizontal([
					label({
						text: "",
						height: 13,
						visibility: model._visibleWhenSingleGuest,
					}),
					button({
						text: `Add item`,
						visibility: model._visibleWhenSingleGuest,
						height: 13,
						width: "25%",
						onClick: () =>
						{
							const guest = model._selectedGuest.get();
							const item = model._item.get();
							const rideId = model._rideId.get();
							if (guest.hasItem({type: item}) && item !== "voucher" && item !== "photo1" && item !== "photo2" && item !== "photo3" && item !== "photo4")
							{
								ui.showError("Guest already", "has this item");
								return;
							}
							if (map.getRide(rideId) === null && (item === "photo1" || item === "photo2" || item === "photo3" || item === "photo4" || model._voucherType.get() === "ride_free"))
							{
								ui.showError("There are no rides", "in your park!");
								return;
							}
							switch (model._item.get())
							{
								case "voucher": guest.giveItem(model._voucher.get()); break;
								case "photo1": guest.giveItem(<GuestPhoto>{type: "photo1", rideId: model._rideId.get()}); break;
								case "photo2": guest.giveItem(<GuestPhoto>{type: "photo2", rideId: model._rideId.get()}); break;
								case "photo3": guest.giveItem(<GuestPhoto>{type: "photo3", rideId: model._rideId.get()}); break;
								case "photo4": guest.giveItem(<GuestPhoto>{type: "photo4", rideId: model._rideId.get()}); break;
								default: guest.giveItem({type: item});
							}
						}
					})
				])
			]
		})
	]
});

function openWindowRemoveItem(item: GuestItemType): void
{
	const removeItemWindow = window({
		onClose: () => ui.tool?.cancel(),
		title: "Remove item",
		width: 200,
		height: 100,
		position: { x: ui.width / 2 - 100, y: ui.height / 2 - 50 },
		colours: [Colour.BordeauxRed, Colour.BordeauxRed],
		content: [
			label({
				width: 200,
				alignment: "centred",
				text: `Are you sure you want to remove\n${itemName[guestItemTypeList.indexOf(item)]}\nfrom this guest?`,
				padding: [25, 0, 17, 0]
			}),
			horizontal([
				button({
					border: true,
					width: 85,
					height: 14,
					text: "Yes",
					padding: [0, 4],
					onClick: () =>
					{
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

function createFlagCheckboxWidget(flag: PeepFlags, padding?: Padding | undefined): WidgetCreator<FlexiblePosition> {
	const capitalizedFlag = flag.charAt(0).toUpperCase() + flag.slice(1);
	const splitFlag = capitalizedFlag.replace(/([A-Z])/g, ' $1');
	return checkbox({
		text: splitFlag,
		visibility: model._visibleWhenNotStaff,
		padding: padding,
		isChecked: compute(model._selectedPeep, p => (p?.getFlag(flag)) ? true : false),
		onChange: (checked) =>
		{
			model._allGuests.get().forEach(guest =>
			{
				if (guest !== undefined) context.executeAction("pe-guestflags", guestFlagsExecuteArgs(guest.id, checked, flag));
			});
		}
	});
}

function createItemWidget(item: GuestItem): WidgetCreator<FlexiblePosition, Parsed<FlexiblePosition>>
	{
		//const visibleWhenGuestHasItem = compute(model._selectedGuest, model._items, g => g && g.hasItem({type: item}) ? "visible" : "none");
		const name = `{BLACK}${itemName[guestItemTypeList.indexOf(item.type)]}`;
		const text = compute(model._selectedGuest, model._photo1RideName, model._photo2RideName, model._photo3RideName, model._photo4RideName, (g, p1, p2, p3, p4) =>
		{
			if (g && item.type === "photo1" || g && item.type === "photo2" || g && item.type === "photo3" || g && item.type === "photo4")
			{
				switch (item.type)
				{
					case "photo1":
					{
						return `${name}${p1}`
					}
					case "photo2":
					{
						return `${name}${p2}`
					}
					case "photo3":
					{
						return `${name}${p3}`
					}
					case "photo4":
					{
						return `${name}${p4}`
					}
					default:
					{
						return name;
					}
				}
			}
			return name;
		});
		return(
			horizontal([
				graphics({
					height: 16,
					width: 16,
					padding: {top: -2, bottom: -2},
					//visibility: visibility,
					onDraw: function (g) { itemImage(item.type, g); },
				}),
				label({
					text: text,
					padding: {top: -2, bottom: -2},
					//visibility: visibility,
				}),
				button({
					text: `{RED}x`,
					height: 10,
					width: 10,
					border: true,
					padding: {top: 0, bottom: -2},
					//visibility: visibility,
					onClick: () => openWindowRemoveItem(item.type)
				})
			])
		)
}

function itemList(): string[] {
	const itemNameArray: string[] = [];
	guestItemTypeList.forEach(item => itemNameArray.push(itemName[guestItemTypeList.indexOf(item)]));
	return itemNameArray;
}

function isSideWindowSticky(): void {
	if (context.sharedStorage.get("pe.sticky"))
	{
		if (main && side)
		{
			side.x = main.x + main.width;
			side.y = main.y;
		}
		else return;
	}
}

function createColourPickerWidget(callback: (g: GraphicsContext) => void, key: GuestColours): WidgetCreator<FlexiblePosition>
{
	let colour: Store<number>;
	switch (key)
	{
		case "tshirtColour":
			{
				colour = model._tshirtColour;
				break;
			}
		case "trousersColour":
			{
				colour = model._trousersColour;
				break;
			}
		case "hatColour":
			{
				colour = model._hatColour;
				break;
			}
		case "balloonColour":
			{
				colour = model._balloonColour;
				break;
			}
		case "umbrellaColour":
			{
				colour = model._umbrellaColour;
				break;
			}
		default:
			{
				colour = sideWindowColour.secondary;
				break;
			}
	}
	return (
		horizontal([
			graphics({
				height: 16,
				width: 16,
				padding: { left: 10 },
				visibility: model._visibleWhenNotStaff,
				onDraw: (g) => callback(g),
			}),
			colourPicker({
				colour: colour,
				visibility: model._visibleWhenNotStaff,
				onChange: (colour) =>
				{
					if (model._allGuestsSelected.get()) model._getAllGuests();
					model._setItemColour(colour, key);
				}
			})
		])
	)
}

function createStaffOrdersWidget(text: string, visibility: Bindable<ElementVisibility>, orders: number): WidgetCreator<FlexiblePosition>
{
	return checkbox({
		text: text,
		visibility: visibility,
		padding: {left: 10},
		isChecked: model._setStafforders(orders),
		onChange: (check) => model._modifyStaffOrders(check, orders)
	})
}

function createGuestKeysWidget(key: GuestKey, maximum: number, isPositive: boolean, keyStore: WritableStore<number>): WidgetCreator<FlexiblePosition>
{
	const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
	const energy = store<GuestKey>(key);

	let bar: WritableStore<number>;
	let value: WritableStore<number>;

	if (key === "hunger" || key === "thirst")
	{	bar = compute(keyStore, b => 1 - percentage(b, maximum))
		value = compute(keyStore, b => 255 - b);
	}
	else
	{	bar = compute(keyStore, b => percentage(b, maximum))
		value = compute(keyStore, b => b);
	}
	return(
		horizontal([
			label({
				text: capitalizedKey,
				height: 13,
				width: "30%",
				padding: { top: 0, bottom: 0, left: 5 },
				visibility: model._visibleWhenSingleGuest,
			}),
			progressBar({
				background: ProgressBarColour.background,
				percentFilled: bar,
				isPositive: isPositive,
				foreground: bar,
				visibility: model._visibleWhenSingleGuest,
			}),
			spinner({
				minimum: compute(energy, e => e === "energy" ? 32 : 0),
				maximum: maximum,
				wrapMode: "clamp",
				value: value,
				height: 13,
				width: "25%",
				visibility: model._visibleWhenSingleGuest,
				onChange: (_, adjustment: number) => model._modifyGuestKey(adjustment, key)
			})
		])
	)
}