/// <reference path="../../lib/openrct2.d.ts" />

import { button, horizontal, label, tab, tabwindow, vertical,
		twoway, compute, Colour, window, groupbox, spinner, dropdown,
		textbox, colourPicker, graphics, checkbox, store, WidgetCreator,
		FlexiblePosition, Bindable, ElementVisibility, Padding,
		WritableStore, 
		Parsed} from "openrct2-flexui";
import { model } from "../viewmodel/PeepViewModel";
import { movePeepExecuteArgs } from "../actions/peepMover";
import { colourPeepExecuteArgs } from "../actions/peepColour";
import { colourList, GuestColours } from "../helpers/colours";
import { staffType, staffTypeList } from "../helpers/staffTypes";
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
import { img, multiplier, windowMain, windowSide } from "./windowConsts";
import { widgetMultiplier } from "./UtilityControls";
import { photo1RideName, photo2RideName, photo3RideName, photo4RideName, rideId, rideList, selectedRide } from "../helpers/rides";

export const colourWindow =
{
	primary: store<Colour>(getColour("pe.side.primary", Colour.DarkYellow)),
	secondary: store<Colour>(getColour("pe.side.secondary", Colour.DarkYellow)),
	tertiary: store<Colour>(Colour.DarkYellow),
};

export const templateWindowSide = tabwindow({
	title: "Properties",
	width: 260,
	height: 230,
	colours: [colourWindow.primary.get(), colourWindow.secondary.get(), colourWindow.tertiary.get()],
	padding: 5,
	tabs: [
		tab({	//location
			image: img.map,
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
									onChange: (_, adjustment: number) => model._allGuests.get().forEach(guest => context.executeAction("pe-movepeep",movePeepExecuteArgs(guest.id, "x", (adjustment * multiplier.get()))))
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
									onChange: (_, adjustment: number) => model._allGuests.get().forEach(guest => context.executeAction("pe-movepeep", movePeepExecuteArgs(guest.id, "y", (adjustment * multiplier.get()))))
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
									onChange: (_, adjustment: number) => model._allGuests.get().forEach(guest => context.executeAction("pe-movepeep", movePeepExecuteArgs(guest.id, "z", (adjustment * multiplier.get()))))
								})
							]),
							horizontal([
								label({
									text: "Speed:",
									height: 13,
									padding: {top: 10, bottom: 5, left: 10},
									disabled: model._isStatic,
									visibility: model._isVisibleWhen(model._isGuest, "inverted"),
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
									visibility: model._isVisibleWhen(model._isGuest, "inverted"),
									disabledMessage: "Peep not moving",
									onChange: (_, adjustment: number) =>
									{
										const peep = model._selectedPeep.get();
										if (peep) context.executeAction("pe-guestkeys", guestKeysExecuteArgs(peep.id, (adjustment * multiplier.get()), "energy"));
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
				widgetMultiplier()
			]
		}),
		tab({ //appearance
			image: img.eye,
			height: "inherit",
			content: [
				horizontal([
					vertical([
						groupbox({
							text: "Staff member appearance",
							spacing: 2,
							gap: {top: 16, bottom: 16},
							visibility: model._isVisibleWhen(model._isGuest, "inverted"),
							content: [
								horizontal([
									label({
										text: "Staff type:",
										height: 13,
										visibility: model._isVisibleWhen(model._isGuest, "inverted"),
										padding: { left: 10 },
									}),
									dropdown({
										height: 13,
										width: "55%",
										visibility: model._isVisibleWhen(model._isGuest, "inverted"),
										disabledMessage: "Not available",
										padding: { right: 10 },
										items: staffTypeList,
										selectedIndex: twoway(model._staffTypeIndex),
										onChange: (index) =>
										{
											const staff = <BaseStaff>model._selectedPeep.get();
											if (staff !== null) context.executeAction("pe-stafftype", staffTypeExecuteArgs(staff.id, staffType[index]));
										}
									})
								]),
								horizontal([
									label({
										text: "Costume:",
										height: 13,
										visibility: model._isVisibleWhen(model._isEntertainer),
										padding: { left: 10 },
									}),
									dropdown({
										height: 13,
										width: "55%",
										visibility: model._isVisibleWhen(model._isEntertainer),
										disabledMessage: "Not available",
										padding: { right: 10 },
										items: model._availableCostumeStrings,
										selectedIndex: twoway(model._costumeIndex),
										onChange: (index) =>
										{
											const staff = <BaseStaff>model._selectedPeep.get();
											if (staff !== null) context.executeAction("pe-staffcostume", staffCostumeExecuteArgs(staff.id, model._availableCostumes.get()[index]));
										}
									})
								]),
								horizontal([
									label({
										text: "Uniform colour:",
										height: 13,
										visibility: model._isVisibleWhen(model._isEntertainer, "inverted"),
										padding: { left: 10 },
									}),
									textbox({
										text: compute(model._colour, c => colourList[c] || ""),
										width: "51%",
										height: 13,
										visibility: model._isVisibleWhen(model._isEntertainer, "inverted"),
										disabled: true,
									}),
									colourPicker({
										colour: twoway(model._colour),
										visibility: model._isVisibleWhen(model._isEntertainer, "inverted"),
										padding: { right: 10 },
										onChange: (colour) =>
										{
											const peep = model._selectedPeep.get();
											if (peep !== null) context.executeAction("pe-colourpeep", colourPeepExecuteArgs(peep.id, colour));
										}
									})
								]),
							]
						}),
						groupbox({
							text: "Guest appearance",
							spacing: 1,
							visibility: model._isVisibleWhen(model._isGuest),
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
										visibility: model._isVisibleWhen(model._isGuest),
										items: model._animationItems,
										selectedIndex: twoway(model._animationIndex),
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
										visibility: model._isVisibleWhen(model._isGuest, "inverted"),
										items: model._animationItems,
										selectedIndex: twoway(model._animationIndex),
										onChange: (index) =>
										{
											const peep = model._selectedPeep.get();
											if (peep !== null)
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
											if (peep !== null)
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
			image: img.pointingFinger,
			height: "inherit",
			spacing: 0,
			content: [
				horizontal([
					groupbox ({
						text: "Staff orders",
						spacing: 2,
						gap: {top: 16, bottom: 16},
						visibility: model._isVisibleWhen(model._isGuest, "inverted"),
						content: [
							createStaffOrdersWidget(StaffOrderLabel.SweepFootpaths, model._isVisibleWhen(model._isHandyman), StaffOrders.SweepFootpaths),
							createStaffOrdersWidget(StaffOrderLabel.WaterGardens, model._isVisibleWhen(model._isHandyman), StaffOrders.WaterGardens),
							createStaffOrdersWidget(StaffOrderLabel.EmptyLitterBins, model._isVisibleWhen(model._isHandyman), StaffOrders.EmptyLitterBins),
							createStaffOrdersWidget(StaffOrderLabel.MowGrass, model._isVisibleWhen(model._isHandyman), StaffOrders.MowGrass),
							createStaffOrdersWidget(StaffOrderLabel.InspectRides, model._isVisibleWhen(model._isMechanic), StaffOrders.InspectRides),
							createStaffOrdersWidget(StaffOrderLabel.FixRides, model._isVisibleWhen(model._isMechanic), StaffOrders.FixRides),
							checkbox({
								text: "{INLINE_SPRITE}{253}{19}{0}{0} Surveilling park",
								visibility: model._isVisibleWhen(model._isSecurity),
								padding: {left: 10},
								isChecked: twoway(model._securityOrders),
								onChange: (checked) =>
								{
									if (!checked)
									{
										model._securityOrders.set(true);
										ui.showError("Can't be turned off", "Security guards never take breaks");
									}
								}
							}),
							checkbox({
								text: "{INLINE_SPRITE}{116}{21}{0}{0} Keep guests happy",
								visibility: model._isVisibleWhen(model._isEntertainer),
								padding: {left: 10},
								isChecked: twoway(model._entertainerOrders),
								onChange: (checked) =>
								{
									if (!checked)
									{
										model._entertainerOrders.set(true);
										ui.showError("Can't be turned off", "Rule 7: have fun");
									}
								}
							}),
						]
					}),
					groupbox({
						text: "Guest flags",
						visibility: model._isVisibleWhen(model._isGuest),
						content: [
							horizontal([
								vertical([
									createFlagCheckboxWidget("leavingPark", {bottom: -3, left: 10 }),
									createFlagCheckboxWidget("slowWalk", {top: -2, bottom: -3, left: 10 }),
									createFlagCheckboxWidget("tracking", {top: -2, bottom: -3, left: 10 }),
									createFlagCheckboxWidget("wow", {top: -2, bottom: -3, left: 10 }),
									createFlagCheckboxWidget("litter", {top: -2, bottom: -3, left: 10 }),
									createFlagCheckboxWidget("lost", {top: -2, bottom: -3, left: 10 }),
								]),
								vertical([
									createFlagCheckboxWidget("crowded", {bottom: -3}),
									createFlagCheckboxWidget("explode", {top: -2, bottom: -3}),
									createFlagCheckboxWidget("contagious", {top: -2, bottom: -3}),
									createFlagCheckboxWidget("joy", {top: -2, bottom: -3}),
									createFlagCheckboxWidget("hereWeAre", {top: -2, bottom: 5}),
								])
							])
						],
					})
				])
			]
		}),
		tab({
			image: img.mood,
			height: "inherit",
			spacing: 0,
			content: [
				horizontal([
					groupbox({
						text: "Physiology",
						visibility: model._isVisibleWhen(model._isGuest, "inverted"),
						content: [
							label({
								text: "All staff members are very happy,",
								alignment: "centred",
								padding: -2,
								visibility: model._isVisibleWhen(model._isGuest, "inverted"),
							}),
							label({
								text: "well fed and hydrated,",
								alignment: "centred",
								padding: -2,
								visibility: model._isVisibleWhen(model._isGuest, "inverted"),
							}),
							label({
								text: "and just had their toilet break.",
								alignment: "centred",
								padding: -2,
								visibility: model._isVisibleWhen(model._isGuest, "inverted"),
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
						visibility: model._isVisibleWhen(model._isGuest),
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
			widgetMultiplier()
			]
		}),		
		tab({
			height: "inherit",
			image: img.items,
			spacing: 0,
			content: [
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
					visibility: model._isVisibleWhen(model._isGuest),
					content: createItemWidget()
					
				}),
				horizontal([
					label({
						text: "Item:",
						height: 13,
						visibility: model._isVisibleWhen(model._isGuest),
						padding: {bottom: 4},
					}),
					dropdown({
						items: itemList(),
						height: 13,
						width: "75%",
						padding: {bottom: 4},
						visibility: model._isVisibleWhen(model._isGuest),
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
								case 3: model._voucher.set(<RideVoucher>{type: "voucher", voucherType: "ride_free", rideId: rideId.get()});model._voucherType.set("ride_free"); break;
							}
						}
					})
				]),
				horizontal([
					label({
						text: "Ride:",
						height: 13,
						padding: {bottom: 4},
						visibility: model._visibleRideDropdown,
					}),
					dropdown({
						items: compute(rideList, c => c.map(r => r._ride().name)),
						selectedIndex: compute(selectedRide, r => r ? r[1] : 0),
						disabledMessage: "No rides in this park",
						autoDisable: "empty",
						height: 13,
						padding: {bottom: 4},
						width: "75%",
						visibility: model._visibleRideDropdown,
						onChange: (idx) =>
						{
							const id = compute(rideList, c => c.map(r => r._ride().id));
							rideId.set(id.get()[idx]);
							model._voucher.set(<RideVoucher>{type: "voucher", voucherType: "ride_free", rideId: rideId.get()});							
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
						visibility: model._isVisibleWhen(model._isGuest),
					}),
					button({
						text: `Give item`,
						visibility: model._isVisibleWhen(model._isGuest),
						height: 13,
						width: "25%",
						onClick: () =>
						{
							const guest = <Guest>model._selectedPeep.get();
							const item = model._item.get();
							const voucher = model._voucher.get();
							const id = rideId.get();
							if (guest.hasItem({type: item}) && item !== "voucher" && item !== "photo1" && item !== "photo2" && item !== "photo3" && item !== "photo4")
							{
								ui.showError("Guest already", "has this item");
								return;
							}
							if (map.getRide(id) === null && (item === "photo1" || item === "photo2" || item === "photo3" || item === "photo4" || model._voucherType.get() === "ride_free"))
							{
								ui.showError("There are no rides", "in your park!");
								return;
							}
							switch (model._item.get())
							{
								case "voucher": guest.giveItem(voucher); break;
								case "photo1": guest.giveItem(<GuestPhoto>{type: "photo1", rideId: rideId.get()}); photo1RideName.set(map.getRide(rideId.get()).name); break;
								case "photo2": guest.giveItem(<GuestPhoto>{type: "photo2", rideId: rideId.get()}); photo2RideName.set(map.getRide(rideId.get()).name); break;
								case "photo3": guest.giveItem(<GuestPhoto>{type: "photo3", rideId: rideId.get()}); photo3RideName.set(map.getRide(rideId.get()).name); break;
								case "photo4": guest.giveItem(<GuestPhoto>{type: "photo4", rideId: rideId.get()}); photo4RideName.set(map.getRide(rideId.get()).name); break;
								default: guest.giveItem({type: item});
							}
						}
					})
				])
			]
		})
	],
	onOpen: () =>
	{
		windowMain.set(getWindow(model._name.get()));
		windowSide.set(getWindow("Properties"));
	},
	onClose: () =>
	{
		ui.tool?.cancel();
        model._close();
	},
	onUpdate: () =>
	{
		const side = windowSide.get();
		isSideWindowSticky();
		if (side) side.colours = [colourWindow.primary.get(), colourWindow.secondary.get(), colourWindow.tertiary.get()];
	},
	onTabChange: () => ui.tool?.cancel(),
});

export function openSideWindow(): void
{
	templateWindowSide.open();
}
export function closeSideWindow(): void
{
	templateWindowSide.close();
}

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

function createFlagCheckboxWidget(flag: PeepFlags, padding?: Padding | undefined): WidgetCreator<FlexiblePosition>
{
	const capitalizedFlag = flag.charAt(0).toUpperCase() + flag.slice(1);
	const splitFlag = capitalizedFlag.replace(/([A-Z])/g, ' $1');
	return checkbox({
		text: splitFlag,
		visibility: model._isVisibleWhen(model._isGuest),
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

function createItemWidget(): WidgetCreator<FlexiblePosition, Parsed<FlexiblePosition>>[]
{
	const array: WidgetCreator<FlexiblePosition, Parsed<FlexiblePosition>>[] = []
	guestItemTypeList.forEach(item =>
	{
	const visibility = compute(model._items, i => i.some(el => el.type === item) ? "visible" : "none");
	const name = `{BLACK}${itemName[guestItemTypeList.indexOf(item)]}`;
	const text = compute(photo1RideName, photo2RideName, photo3RideName, photo4RideName, (p1, p2, p3, p4) =>
	{
		if (item === "photo1" || item === "photo2" || item === "photo3" || item === "photo4")
		{
			switch (item)
			{
				case "photo1":
				{
					return `${name} ${p1}`
				}
				case "photo2":
				{
					return `${name} ${p2}`
				}
				case "photo3":
				{
					return `${name} ${p3}`
				}
				case "photo4":
				{
					return `${name} ${p4}`
				}
				default:
				{
					return name;
				}
			}
		}
		return name;
	});
		array.push(
			horizontal([
				graphics({
					height: 16,
					width: 16,
					padding: {top: -2, bottom: -2},
					visibility: visibility,
					onDraw: function (g) { itemImage(item, g); },
				}),
				label({
					text: text,
					padding: {top: -2, bottom: -2},
					visibility: visibility,
				}),
				button({
					text: `{RED}x`,
					height: 10,
					width: 10,
					border: true,
					padding: {top: 0, bottom: -2},
					visibility: visibility,
					onClick: () => openWindowRemoveItem(item)
				})
			])
		)
	})
	return array;
}

function itemList(): string[]
{
	const itemNameArray: string[] = [];
	guestItemTypeList.forEach(item => itemNameArray.push(itemName[guestItemTypeList.indexOf(item)]));
	return itemNameArray;
}

function isSideWindowSticky(): void
{
	const main = windowMain.get();
	const side = windowSide.get();
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
	let colour = store<number>(getColour("pe.side.secondary", Colour.LightBrown));
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
				colour = colourWindow.secondary;
				break;
			}
	}
	return (
		horizontal([
			graphics({
				height: 16,
				width: 16,
				padding: { left: 10 },
				visibility: model._isVisibleWhen(model._isGuest),
				onDraw: (g) => callback(g),
			}),
			colourPicker({
				colour: compute(colour, c => c),
				visibility: model._isVisibleWhen(model._isGuest),
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
				visibility: model._isVisibleWhen(model._isGuest),
			}),
			progressBar({
				background: ProgressBarColour.background,
				percentFilled: bar,
				isPositive: isPositive,
				foreground: bar,
				visibility: model._isVisibleWhen(model._isGuest),
			}),
			spinner({
				minimum: compute(energy, e => e === "energy" ? 32 : 0),
				maximum: maximum,
				wrapMode: "clamp",
				value: value,
				height: 13,
				width: "25%",
				visibility: model._isVisibleWhen(model._isGuest),
				onChange: (_, adjustment: number) => model._modifyGuestKey(adjustment, key)
			})
		])
	)
}