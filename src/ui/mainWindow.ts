
/// <reference path="../../lib/openrct2.d.ts" />

import { button, horizontal, label, tab, tabwindow, vertical, viewport, toggle, twoway, compute, Colour, window, groupbox, spinner, dropdown, textbox, colourPicker, graphics } from "openrct2-flexui";
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
import { colour, colourList } from "../helpers/colours";
import { customImageFor } from "../helpers/customImages";
import { staffType, staffTypeList } from "../helpers/staffTypes";
import { costumeList } from "../helpers/costumes";
import { animationList } from "../helpers/animations";
import { staffTypeExecuteArgs } from "../actions/staffSetType";
import { staffCostumeExecuteArgs } from "../actions/staffSetCostume";
import { animationPeepExecuteArgs } from "../actions/peepAnimation";
import { animationFramePeepExecuteArgs } from "../actions/peepAnimationFrame";

const pointingFingerIcon: ImageAnimation = { frameBase: 5318, frameCount: 8, frameDuration: 2, };
const paperIcon: ImageAnimation = { frameBase: 5277, frameCount: 7, frameDuration: 4, };
const infoIcon: ImageAnimation = { frameBase: 5367, frameCount: 8, frameDuration: 4, };
const gearIcon: ImageAnimation = { frameBase: 5201, frameCount: 4, frameDuration: 4, };
const paintIcon: ImageAnimation = { frameBase: 5221, frameCount: 8, frameDuration: 4, };
const mapIcon: ImageAnimation = { frameBase: 5192, frameCount: 1, frameDuration: 4, offset: { x: 4, y: 1 }};
const lensIcon: ImageAnimation = {frameBase: 29401, frameCount: 1, frameDuration: 4, offset: {x: 4, y: 1}};

const deleteIcon: number = 5165;
const locateIcon: number = 5167;
const nameIcon: number = 5168;
const flagsIcon: number = 5182;
const allGuestsIcon: number = 5193;
const itemsIcon: number = 5326;

let multiplier: number = 1;

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
	button({
		height: 24,
		width: 24,
		image: allGuestsIcon,
		tooltip: "Select all guests on the map",
		padding: {top: 1},
	})
]

export const windowPeepEditor = tabwindow({
	title: model._name,
	width: 260,
	height: 230,
	colours: [Colour.DarkYellow, Colour.DarkYellow, Colour.DarkYellow],
	padding: 5,
	onTabChange: () => ui.tool?.cancel(),
	onOpen: () => model._open(),
	onClose: () => {
		ui.tool?.cancel();
		model._close();
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
			content: [
				horizontal([
					groupbox({
						text: "Kinematics",
						spacing: 2,
						content: [
							horizontal([
								label({
									text: "X position:",
									height: 13,
									padding: {top: 0, bottom: 0, left: 10},
									disabled: compute(model._isFrozen, f => !f),
								}),
								spinner({
									minimum: 0,
									value: model._x,
									height: 13,
									width: "55%",
									padding: {top: 0, right: 10,  bottom: 0},
									disabled: compute(model._isFrozen, f => !f),
									disabledMessage: "Not available",
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
									height: 12,
									padding: {top: 0, bottom: 0, left: 10},
									disabled: compute(model._isFrozen, f => !f),
								}),
								spinner({
									minimum: 0,
									value: model._y,
									height: 13,
									width: "55%",
									padding: {top: 0, right: 10,  bottom: 0},
									disabled: compute(model._isFrozen, f => !f),
									disabledMessage: "Not available",
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
									padding: {top: 0, bottom: 0, left: 10},
									disabled: compute(model._isFrozen, f => !f),
								}),
								spinner({
									minimum: 0,
									value: model._z,
									height: 13,
									width: "55%",
									padding: {top: 0, right: 10,  bottom: 0},
									disabled: compute(model._isFrozen, f => !f),
									disabledMessage: "Not available",
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
					}),
					dropdown({
						padding: [5, 15, 7, -20],
						width: "20%",
						height: 13,
						items: ["1x", "10x", "100x", "1000x"],
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
					text: "Staff member appearance",
					spacing: 2,
					gap: {top: 16, bottom: 16},
					visibility: compute(model._isStaff, g => (g) ? "visible" : "none"),
					content: [
						horizontal([
							label({
								text: "Staff type:",
								height: 13,
								visibility: compute(model._isStaff, g => (g) ? "visible" : "none"),
								disabled: model._isPeepSelected,
								padding: { left: 10 },
							}),
							dropdown({
								height: 13,
								width: "55%",
								visibility: compute(model._isStaff, g => (g) ? "visible" : "none"),
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
								visibility: compute(model._isEntertainer, e => (e) ? "visible" : "none"),
								disabled: model._isPeepSelected,
								padding: { left: 10 },
							}),
							dropdown({
								height: 13,
								width: "55%",
								visibility: compute(model._isEntertainer, e => (e) ? "visible" : "none"),
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
								visibility: compute(model._costume, model._isGuest, (c, g) => ((c === "none" || c === "handyman" || c === "mechanic" || c === "security1" || c === "security2") && !g) ? "visible" : "none"),
								disabled: model._isPeepSelected,
								padding: { left: 10 },
							}),
							textbox({
								text: compute(model._colour, c => colourList[c] || ""),
								width: "51%",
								height: 13,
								visibility: compute(model._costume, model._isGuest, (c, g) => ((c === "none" || c === "handyman" || c === "mechanic" || c === "security1" || c === "security2") && !g) ? "visible" : "none"),
								disabled: true,
							}),
							colourPicker({
								colour: compute(model._colour, c => (c) || 0),
								visibility: compute(model._costume, model._isGuest, (c, g) => ((c === "none" || c === "handyman" || c === "mechanic" || c === "security1" || c === "security2") && !g) ? "visible" : "none"),
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
					content: [
						horizontal([
							label({
								text: "Animation:",
								height: 13,
								disabled: model._isPeepSelected,
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
			content: [
				label({
					text: "{WHITE}Options / Flags",
					alignment: "centred",
					padding: [3, 0]
				})
			]
		}),
		tab({
			image: itemsIcon,
			content: [
				label({
					text: "{WHITE}Items",
					alignment: "centred",
					padding: [3, 0]
				})
			]
		}),
		tab({
			image: paperIcon,
			content: [
				label({
					text: "{WHITE}Statistics",
					alignment: "centred",
					padding: [3, 0]
				})
			]
		}),
		tab({
			image: gearIcon,
			content: [
				label({
					text: "{WHITE}Debug Stuff",
					alignment: "centred",
					padding: [3, 0]
				})
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
						text: "Version:\n\nAuthor:\n\nUI:\n\nSpecial\nThanks:",
						width: "25%"
					}),
					label({
						text: versionString()+`\n\n{WHITE}Manticore-007\n\n{WHITE}FlexUI by Basssiiie\n\n{WHITE}Basssiiie, Gymnasiast, ItsSmitty\nSpacek531, AaronVanGeffen\nSadret and Enox`,
					}),
				]),
				label({
					text: "https://github.com/Manticore-007\n/OpenRCT2-PeepEditor",
					padding: ["95%", 0, 0, 0],
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
        return `{WHITE}${pluginVersion} {BABYBLUE}[DEBUG]`;
    }
    else return `{WHITE}${pluginVersion}`;
}

function drawImage(g: GraphicsContext, image: number, property: keyof Guest): void
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
        g.paletteId = colour["Void"];
        g.image(img.id, 0, 0);
    }
}