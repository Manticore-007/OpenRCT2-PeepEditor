/// <reference path="../../lib/openrct2.d.ts" />

import {
	button, horizontal, label, tab, tabwindow, vertical,
	twoway, compute, Colour, window, groupbox, spinner, dropdown,
	textbox, colourPicker, graphics, checkbox, store, WidgetCreator,
	FlexiblePosition, Bindable, ElementVisibility, Padding,
	WritableStore,
	Store,
	WindowTemplate
} from "openrct2-flexui";

import { model, PeepDirection } from "../viewmodel/PeepViewModel";
import { colourList, GuestColours } from "../helpers/colours";
import { staffTypeList } from "../helpers/staffTypes";
import { guestFlagsExecuteArgs } from "../actions/guestFlags";
import { percentage, progressBar, ProgressBarColour } from "../helpers/progressBar";
import { guestItemTypeList, itemImage, itemName } from "../helpers/guestItemTypes";
import { getWindow } from "../helpers/getWindow";
import { getColour, theme } from "../helpers/settings";
import { GuestKey } from "../actions/guestKeys";
import { customImageFor, drawImage } from "../helpers/customImages";
import { StaffOrderLabel, StaffOrders } from "../helpers/staffOrders";
import { buttonSize, img, multiplierIndex, windowMain, windowSide, windowTitle } from "./windowConsts";
import { photo1RideName, photo2RideName, photo3RideName, photo4RideName, rideId, rideList, selectedRide } from "../helpers/rides";

let axis = {
	x: { lineColour: 172, line: { x1: 21, y1: 45, x2: 50, y2: 30 }, textColour: Colour.SaturatedRed, text: { text: "x", x: 5, y: 40 } },
	y: { lineColour: 102, line: { x1: 50, y1: 30, x2: 79, y2: 45 }, textColour: Colour.SaturatedGreen, text: { text: "y", x: 85, y: 40 } },
	z: { lineColour: 135, line: { x1: 50, y1: 30, x2: 50, y2: 5 }, textColour: Colour.DarkBlue, text: { text: "z", x: 40, y: 0 } }
}

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
	colours: [colourWindow.primary.get(), colourWindow.secondary.get(), colourWindow.primary.get()],
	padding: 5,
	tabs: [
		tab({	//location
			image: img.map,
			height: "inherit",
			content: [
				horizontal([
					groupbox({
						text: "Position",
						content: [
							horizontal([
								graphics({
									height: 56,
									onDraw(g) {
										// background
										g.colour = 55;
										g.well(0, 0, 100, 56);

										// axes: x (red), y (green), z (blue)
										[axis.x, axis.y, axis.z].forEach(axis => {
											g.stroke = axis.lineColour;
											g.line(axis.line.x1, axis.line.y1, axis.line.x2, axis.line.y2);

											g.colour = axis.textColour;
											g.text(axis.text.text, axis.text.x, axis.text.y);
										});
									}
								}),
								vertical([
									createPositionWidget("x", model._x),
									createPositionWidget("y", model._y),
									createPositionWidget("z", model._z)
								])
							])
						]
					}),
					freezeWidgets()
				]),
				horizontal([
					groupbox({
						text: "Direction",
						width: "45%",
						content: [
							horizontal([
								vertical([
									horizontal([
										createRotateButton("NW"),
										createRotateButton("NE"),
									]),
									horizontal([
										createRotateButton("SW"),
										createRotateButton("SE"),
									])
								]),
							]),
						]
					}),
					groupbox({
						text: "Speed",
						width: "44%",
						content: [
							vertical([
								spinner({
									minimum: 32,
									maximum: 128,
									wrapMode: "clamp",
									value: model._energy,
									height: 13,
									width: "73%",
									padding: { top: 5, right: 10, bottom: 5, left: "1w" },
									disabled: model._isStatic,
									disabledMessage: "N/A",
									onChange: (_, adjustment: number) => model._setGuestKey(adjustment, "energy")
								}),
								button({
									text: "Reset",
									height: 14,
									width: "73%",
									padding: { top: 5, right: 10, bottom: 6, left: "1w" },
									disabled: model._isStatic,
									onClick: () => model._setGuestKey(96 - model._energy.get(), "energy")
								})
							])
						]
					})
				]),
				widgetMultiplier(["1w", 28, 3, "1w"])
			],
		}),
		tab({ //appearance
			image: img.eye,
			height: "inherit",
			content: [
				groupbox({
					text: "Staff member appearance",
					spacing: 2,
					gap: { top: 16, bottom: 16 },
					visibility: compute(model._isStaff, s => s ? "visible" : "none"),
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
								selectedIndex: twoway(model._staffTypeIndex),
								onChange: (index) => model._setStaffType(index)
							})
						]),
						horizontal([
							label({
								text: "Costume:",
								height: 13,
								visibility: compute(model._isStaff, model._isEntertainer, (s, e) => s && e ? "visible" : "none"),
								padding: { left: 10 },
							}),
							dropdown({
								height: 13,
								width: "55%",
								visibility: compute(model._isStaff, model._isEntertainer, (s, e) => s && e ? "visible" : "none"),
								disabledMessage: "Not available",
								padding: { right: 10 },
								items: model._availableCostumeStrings,
								selectedIndex: twoway(model._costumeIndex),
								onChange: (index) => model._setCostume(index)
							})
						]),
						horizontal([
							label({
								text: "Uniform colour:",
								height: 13,
								visibility: compute(model._isStaff, model._isEntertainer, (s, e) => s && !e ? "visible" : "none"),
								padding: { left: 10 },
							}),
							textbox({
								text: compute(model._colour, c => colourList[c] || ""),
								width: "51%",
								height: 13,
								visibility: compute(model._isStaff, model._isEntertainer, (s, e) => s && !e ? "visible" : "none"),
								disabled: true,
							}),
							colourPicker({
								colour: twoway(model._colour),
								visibility: compute(model._isStaff, model._isEntertainer, (s, e) => s && !e ? "visible" : "none"),
								padding: { right: 10, top: -1 },
								onChange: (colour) => model._setColour(colour)
							})
						]),
					]
				}),
				groupbox({
					text: "Guest appearance",
					width: "1w",
					spacing: 1,
					visibility: compute(model._isGuest, g => g ? "visible" : "none"),
					content: [
						horizontal([
							createColourPickerWidget(g => drawImage(g, 5081, "tshirtColour"), "tshirtColour"),
							createColourPickerWidget(g => drawImage(g, customImageFor("trousers"), "trousersColour"), "trousersColour"),
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
							dropdown({
								height: 13,
								width: "55%",
								padding: { right: 10, },
								items: model._animationItems,
								selectedIndex: model._animationIndex,
								onChange: (index) => {
									model._animationIndex.set(index);
									if (!model._isSwitchingPeep.get()) {
										model._setAnimation(index);
									}
								}
							})
						]),
						horizontal([
							label({
								text: compute(model._animationLength, l => `Frame: (max: ${l - 1})` || "Frame:"),
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
								maximum: compute(model._animationLength, l => l - 1),
								wrapMode: "wrap",
								onChange: (value, adjustment) => model._setFrame(value, adjustment)
							})
						]),
					]
				}),
			]
		}),
		tab({
			image: img.pointingFinger,
			height: "inherit",
			spacing: 0,
			content: [
				horizontal([
					groupbox({
						text: "Staff orders",
						spacing: 2,
						gap: { top: 16, bottom: 16 },
						visibility: compute(model._isStaff, s => s ? "visible" : "none"),
						content: [
							createStaffOrdersWidget(StaffOrderLabel.SweepFootpaths, model._isVisibleWhen(compute(model._staffType, type => type === "handyman")), StaffOrders.SweepFootpaths),
							createStaffOrdersWidget(StaffOrderLabel.WaterGardens, model._isVisibleWhen(compute(model._staffType, type => type === "handyman")), StaffOrders.WaterGardens),
							createStaffOrdersWidget(StaffOrderLabel.EmptyLitterBins, model._isVisibleWhen(compute(model._staffType, type => type === "handyman")), StaffOrders.EmptyLitterBins),
							createStaffOrdersWidget(StaffOrderLabel.MowGrass, model._isVisibleWhen(compute(model._staffType, type => type === "handyman")), StaffOrders.MowGrass),
							createStaffOrdersWidget(StaffOrderLabel.InspectRides, model._isVisibleWhen(compute(model._staffType, type => type === "mechanic")), StaffOrders.InspectRides),
							createStaffOrdersWidget(StaffOrderLabel.FixRides, model._isVisibleWhen(compute(model._staffType, type => type === "mechanic")), StaffOrders.FixRides),
							checkbox({
								text: "{INLINE_SPRITE}{253}{19}{0}{0} Surveilling park",
								visibility: model._isVisibleWhen(compute(model._staffType, type => type === "security")),
								padding: { left: 10 },
								isChecked: twoway(model._securityOrders),
								onChange: (checked) => {
									if (!checked) {
										model._securityOrders.set(true);
										ui.showError("Can't be turned off", "Security guards never take breaks");
									}
								}
							}),
							checkbox({
								text: "{INLINE_SPRITE}{116}{21}{0}{0} Keep guests happy",
								visibility: compute(model._isStaff, model._isEntertainer, (s, e) => s && e ? "visible" : "none"),
								padding: { left: 10 },
								isChecked: twoway(model._entertainerOrders),
								onChange: (checked) => {
									if (!checked) {
										model._entertainerOrders.set(true);
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
									createFlagCheckboxWidget("leavingPark", { bottom: -3, left: 10 }),
									createFlagCheckboxWidget("slowWalk", { top: -2, bottom: -3, left: 10 }),
									createFlagCheckboxWidget("litter", { top: -2, bottom: -3, left: 10 }),
									createFlagCheckboxWidget("explode", { top: -2, bottom: -3, left: 10 }),
									createFlagCheckboxWidget("contagious", { top: -2, bottom: -3, left: 10 }),
								]),
							])
						],
					})
				])
			]
		}),
		tab({
			image: img.mood,
			height: "inherit",
			content: [
				horizontal([
					groupbox({
						text: "Physiology",
						visibility: compute(model._isStaff, s => s ? "visible" : "none"),
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
						visibility: compute(model._isGuest, g => g ? "visible" : "none"),
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
				widgetMultiplier(["1w", 5, 3, "1w"])
			]
		}),
		tab({
			height: "inherit",
			image: img.items,
			spacing: 0,
			content: [
				groupbox({
					text: "Carrying",
					padding: { bottom: 4 },
					spacing: 0,
					visibility: compute(model._isGuest, g => g ? "visible" : "none"),
					content: createItemWidget().concat(
						label({
							text: "{BLACK}Nothing",
							visibility: compute(model._items, i => i.length === 0 ? "visible" : "none"),
							padding: { top: -2, bottom: -2 }
						})
					)							
				}),
				horizontal([
					label({
						text: "Item:",
						height: 13,
						visibility: compute(model._isGuest, g => g ? "visible" : "none"),
						padding: { bottom: 4 },
					}),
					dropdown({
						items: itemList(),
						height: 13,
						width: "75%",
						padding: { bottom: 4 },
						visibility: compute(model._isGuest, g => g ? "visible" : "none"),
						onChange: (index) => {
							const item = guestItemTypeList[index];
							model._item.set(item);
						}
					}),
				]),
				horizontal([
					label({
						text: "Voucher:",
						height: 13,
						padding: { bottom: 4 },
						visibility: compute(model._item, i => (i === "voucher") ? "visible" : "none"),
					}),
					dropdown({
						items: ["Free entry", "Half-priced entry", "Free food/drink", "Free ride"],
						height: 13,
						width: "75%",
						padding: { bottom: 4 },
						visibility: compute(model._item, i => (i === "voucher") ? "visible" : "none"),
						onChange: (index) => {
							switch (index) {
								case 0: model._voucher.set(<Voucher>{ type: "voucher", voucherType: "entry_free" }); model._voucherType.set("entry_free"); break;
								case 1: model._voucher.set(<Voucher>{ type: "voucher", voucherType: "entry_half_price" }); model._voucherType.set("entry_half_price"); break;
								case 2: model._voucherType.set("food_drink_free"); model._voucher.set(<FoodDrinkVoucher>{ type: "voucher", voucherType: model._voucherType.get(), item: model._voucherItem.get() }); break;
								case 3: model._voucher.set(<RideVoucher>{ type: "voucher", voucherType: "ride_free", rideId: rideId.get() }); model._voucherType.set("ride_free"); break;
							}
						}
					})
				]),
				horizontal([
					label({
						text: "Ride:",
						height: 13,
						padding: { bottom: 4 },
						visibility: model._visibleRideDropdown,
					}),
					dropdown({
						items: compute(rideList, c => c.map(r => r._ride().name)),
						selectedIndex: compute(selectedRide, r => r ? r[1] : 0),
						disabledMessage: "No rides in this park",
						autoDisable: "empty",
						height: 13,
						padding: { bottom: 4 },
						width: "75%",
						visibility: model._visibleRideDropdown,
						onChange: (index) => {
							const id = compute(rideList, c => c.map(r => r._ride().id));
							rideId.set(id.get()[index]);
							model._voucher.set(<RideVoucher>{ type: "voucher", voucherType: "ride_free", rideId: rideId.get() });
						}
					})
				]),
				horizontal([
					label({
						text: "Free item:",
						height: 13,
						padding: { bottom: 4 },
						visibility: compute(model._item, model._voucherType, (i, v) => (v === "food_drink_free" && i === "voucher") ? "visible" : "none"),
					}),
					dropdown({
						items: itemList(),
						height: 13,
						padding: { bottom: 4 },
						width: "75%",
						visibility: compute(model._item, model._voucherType, (i, v) => (v === "food_drink_free" && i === "voucher") ? "visible" : "none"),
						onChange: (index) => {
							const item = guestItemTypeList[index];
							model._voucherItem.set(item);
							model._voucher.set(<FoodDrinkVoucher>{ type: "voucher", voucherType: "food_drink_free", item: model._voucherItem.get() });
						}
					})
				]),
					button({
						text: `Give item`,
						visibility: compute(model._isGuest, g => g ? "visible" : "none"),
						height: 13,
						padding: {left: "1w"},
						width: "25%",
						onClick: () => model._giveItem(model._item.get())
					})
			]
		})
	],
	onOpen: () => {
		windowMain.set(getWindow(model._name.get()));
		windowSide.set(getWindow("Properties"));
	},
	onClose: () => {
		model._name.set(windowTitle);
		ui.tool?.cancel();
		model._close();
	},
	onUpdate: () => {
		const side = windowSide.get();
		isSideWindowSticky();
		checkMapRotation();
		if (side) side.colours = [colourWindow.primary.get(), colourWindow.secondary.get(), colourWindow.tertiary.get()];
	},
	onTabChange: () => ui.tool?.cancel(),
});

// export function openedSideWindow(): OpenWindow {
// 	return templateWindowSide.open()
// };

// export function closeSideWindow(): void {
// 	openedSideWindow().close();
// }

function openWindowRemoveItem(item: GuestItemType): void {
	const removeItemWindow: WindowTemplate = window({
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
					onClick: () => {
						model._removeItem(item);
						templateWindowSide.close();
					}
				}),
				button({
					border: true,
					width: 85,
					height: 14,
					text: "Cancel",
					padding: [0, 4],
					onClick: () => templateWindowSide.close()
				}),
			])
		],
		onClose: () => ui.tool?.cancel(),
	});
	removeItemWindow.open();
}

function createPositionWidget(axis: "x" | "y" | "z", store: Store<number>) {
	return horizontal([
		label({
			text: `${axis}:`,
			height: 13,
			padding: { top: 1, bottom: 1, left: 10 },
			disabled: model._isPositionDisabled,
		}),
		spinner({
			minimum: compute(model._allGuests, a => a.length > 1 ? -(2 ** 31) : 0),
			value: store,
			height: 13,
			width: "80%",
			padding: { top: 1, right: 10, bottom: 1 },
			disabled: model._isPositionDisabled,
			disabledMessage: "N/A",
			onChange: (_, adjustment: number) => model._SetPosition(axis, adjustment)
		})
	]);
}

function createFlagCheckboxWidget(flag: PeepFlags, padding?: Padding | undefined): WidgetCreator<FlexiblePosition> {
	const capitalizedFlag = flag.charAt(0).toUpperCase() + flag.slice(1);
	const splitFlag = capitalizedFlag.replace(/([A-Z])/g, ' $1');
	return checkbox({
		text: splitFlag,
		visibility: compute(model._isGuest, g => g ? "visible" : "none"),
		padding: padding,
		isChecked: compute(model._selectedPeep, p => (p?.getFlag(flag)) ? true : false),
		onChange: (checked) => {
			model._allGuests.get().forEach(guest => {
				if (guest !== null) context.executeAction("pe-guestflags", guestFlagsExecuteArgs(guest.id, checked, flag));
			});
		}
	});
}

function createItemWidget(): WidgetCreator<FlexiblePosition>[] {
	return guestItemTypeList.map((item, index) => {
		const visibility = compute(model._items, i => i.some(el => el.type === item) ? "visible" : "none");
		const name = `{BLACK}${itemName[index]}`;
		const text = compute(photo1RideName, photo2RideName, photo3RideName, photo4RideName, (p1, p2, p3, p4) => {
			const photoNames: Record<string, string> = { photo1: p1, photo2: p2, photo3: p3, photo4: p4 };
			return photoNames[item] ? `${name} ${photoNames[item]}` : name;
		});
		return horizontal([
			graphics({
				height: 16,
				width: 16,
				padding: { top: -2, bottom: -2 },
				visibility,
				onDraw: g => itemImage(item, g),
			}),
			label({
				text,
				padding: { top: -2, bottom: -2 },
				visibility,
			}),
			button({
				text: `{RED}x`,
				height: 10,
				width: 10,
				border: true,
				padding: { top: 0, bottom: -2 },
				visibility,
				onClick: () => openWindowRemoveItem(item)
			})
		]);
	});
}

function itemList(): string[] {
	const itemNameArray: string[] = [];
	guestItemTypeList.forEach(item => itemNameArray.push(itemName[guestItemTypeList.indexOf(item)]));
	return itemNameArray;
}

function isSideWindowSticky(): void {
	const main = windowMain.get();
	const side = windowSide.get();
	if (context.sharedStorage.get("pe.sticky")) {
		if (main && side) {
			side.x = main.x + main.width;
			side.y = main.y;
		}
		else return;
	}
}

function createColourPickerWidget(callback: (g: GraphicsContext) => void, key: GuestColours): WidgetCreator<FlexiblePosition> {
	let colour = store<number>(getColour("pe.side.secondary", Colour.LightBrown));
	switch (key) {
		case "tshirtColour": { colour = model._tshirtColour; break; }
		case "trousersColour": { colour = model._trousersColour; break; }
		case "hatColour": { colour = model._hatColour; break; }
		case "balloonColour": { colour = model._balloonColour; break; }
		case "umbrellaColour": { colour = model._umbrellaColour; break; }
		default: { colour = colourWindow.secondary; break; }
	}
	return (
		horizontal([
			graphics({
				height: 16,
				width: 16,
				padding: { left: 10 },
				visibility: compute(model._isGuest, g => g ? "visible" : "none"),
				onDraw: (g) => callback(g),
			}),
			colourPicker({
				colour: compute(colour, c => c),
				visibility: compute(model._isGuest, g => g ? "visible" : "none"),
				onChange: (colour) => model._setColour(colour, key)
			})
		])
	)
}

function widgetMultiplier(padding: Padding): WidgetCreator<FlexiblePosition> {
	return horizontal({
		padding: padding,
		content: [
			label({
				text: "Multiplier:",
				height: 13,
				width: "55%",
				padding: { left: "1w" },
			}),
			dropdown({
				width: "45%",
				height: 13,
				items: ["1x", "10x", "100x"],
				selectedIndex: twoway(multiplierIndex)
			})
		]
	})
}

function createStaffOrdersWidget(text: string, visibility: Bindable<ElementVisibility>, orders: number): WidgetCreator<FlexiblePosition> {
	return checkbox({
		text: text,
		visibility: visibility,
		padding: { left: 10 },
		isChecked: model._checkStaffOrders(orders),
		onChange: (check) => model._setStaffOrders(check, orders)
	})
}

function createGuestKeysWidget(key: GuestKey, maximum: number, isPositive: boolean, keyStore: WritableStore<number>): WidgetCreator<FlexiblePosition> {
	const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
	const energy = store<GuestKey>(key);

	let bar: WritableStore<number>;
	let value: WritableStore<number>;

	if (key === "hunger" || key === "thirst") {
		bar = compute(keyStore, b => 1 - percentage(b, maximum))
		value = compute(keyStore, b => 255 - b);
	}
	else {
		bar = compute(keyStore, b => percentage(b, maximum))
		value = compute(keyStore, b => b);
	}
	return (
		horizontal([
			label({
				text: "{BLACK}" + capitalizedKey,
				height: 13,
				width: "30%",
				padding: { top: 0, bottom: 0, left: 5 },
				visibility: compute(model._isGuest, g => g ? "visible" : "none"),
			}),
			progressBar({
				background: ProgressBarColour.background,
				percentFilled: bar,
				isPositive: isPositive,
				foreground: bar,
				visibility: compute(model._isGuest, g => g ? "visible" : "none"),
			}),
			spinner({
				minimum: compute(energy, e => e === "energy" ? 32 : 0),
				maximum: maximum,
				wrapMode: "clamp",
				value: value,
				height: 13,
				width: "25%",
				visibility: compute(model._isGuest, g => g ? "visible" : "none"),
				onChange: (_, adjustment: number) => model._setGuestKey(adjustment, key)
			})
		])
	)
}

function freezeWidgets(): WidgetCreator<FlexiblePosition> {
	const buttonSizeSmall = 14;
	return vertical({
		padding: { top: 5 },
		content: [
			button({	//red traffic light
				width: buttonSizeSmall,
				height: buttonSizeSmall,
				image: compute(model._isFrozen, model._isStatic, (f, s) => f && s ? "rct1_close_on" : "rct1_close_off"),
				tooltip: "Completely stop a peep from moving",
				padding: { top: 0, right: 6, bottom: -2, left: 4 },
				border: true,
				visibility: compute(theme, t => t === "rct1" ? "visible" : "none"),
				onClick: () => model._setMotion("frozen")
			}),
			button({	//yellow traffic light
				width: buttonSizeSmall,
				height: buttonSizeSmall,
				image: compute(model._isFrozen, model._isStatic, (f, s) => !f && s ? "rct1_test_on" : "rct1_test_off"),
				tooltip: "Stop a peep in place, animation still works",
				padding: { top: -2, right: 6, bottom: -2, left: 4 },
				border: true,
				visibility: compute(theme, t => t === "rct1" ? "visible" : "none"),
				onClick: () => model._setMotion("static")
			}),
			button({	//green traffic light
				width: buttonSizeSmall,
				height: buttonSizeSmall,
				image: compute(model._isFrozen, model._isStatic, (f, s) => !f && !s ? "rct1_open_on" : "rct1_open_off"),
				tooltip: "Let the peep roam freely around",
				padding: { top: -2, right: 6, bottom: -2, left: 4 },
				border: true,
				visibility: compute(theme, t => t === "rct1" ? "visible" : "none"),
				onClick: () => model._setMotion("moving")
			}),
			button({
				image: compute(model._isFrozen, model._isStatic, (f, s) => flagButtonImage(f, s)),
				width: buttonSize,
				height: buttonSize,
				padding: { top: 0 },
				visibility: compute(theme, t => t === "rct2" ? "visible" : "none"),
				onClick: () => {
					const isFrozen = model._isFrozen.get();
					const isStatic = model._isStatic.get();

					if (!isFrozen && !isStatic) model._setMotion("frozen");
					else if (isFrozen && isStatic) model._setMotion("static");
					else model._setMotion("moving");
				}
			}),
		]
	})
}

function flagButtonImage(f: boolean, s: boolean): IconName {
	if (f && s) return "closed";
	if (!f && s) return "testing";
	if (!f && !s) return "open";
	return "closed";
}

function createRotateButton(dir: PeepDirection) {
	// If direction ends with 'W' (West/Left), use left padding. Otherwise, use right padding.
	const pad: Padding = dir.endsWith("W") ? [-2, -2, -2, "1w"] : [-2, "1w", -2, -2];

	return button({
		height: 28,
		width: 48,
		padding: pad,
		border: false,
		image: img.arrow[dir],
		tooltip: "Rotate a static peep",
		disabled: compute(model._isStatic, s => !s),
		onClick: () => model._setDirection(dir)
	});
};

function checkMapRotation(): void {
	const orientation = ui.mainViewport.rotation;
	if (orientation === 1 || orientation === 3) {
		axis.x.line = { x1: 50, y1: 30, x2: 79, y2: 45 };
		axis.x.text = { text: "x", x: 85, y: 40 };
		axis.y.line = { x1: 21, y1: 45, x2: 50, y2: 30 };
		axis.y.text = { text: "y", x: 5, y: 40 };
	}
	else {
		axis.x.line = { x1: 21, y1: 45, x2: 50, y2: 30 };
		axis.x.text = { text: "x", x: 5, y: 40 }
		axis.y.line = { x1: 50, y1: 30, x2: 79, y2: 45 };
		axis.y.text = { text: "y", x: 85, y: 40 };
	}
}