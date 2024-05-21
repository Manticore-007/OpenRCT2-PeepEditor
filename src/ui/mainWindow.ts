
/// <reference path="../../lib/openrct2.d.ts" />

import { button, horizontal, label, tab, tabwindow, vertical, viewport, toggle, twoway, compute, Colour, window, groupbox, spinner, dropdown } from "openrct2-flexui";
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
		isPressed: twoway(model._isPicking),
		padding: {top: 1},
		onChange: pressed => togglePeepPicker(pressed, p => {
			model._select(p); model._tabImage(p);
			model._name.set(p.name); model._availableAnimations.set(p.availableAnimations);
			debug(`Frames: ${p.animationLength}`);
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
		disabled: model._isPeepSelected,
		isPressed: twoway(model._isFrozen),
		padding: {top: 1},
		onChange: () => {
			const peep = model._selectedPeep.get();
			if (peep !== undefined)
			context.executeAction("pe-freezepeep", freezePeepExecuteArgs(peep.id));
		}
	}),
	button({
		height: 24,
		width: 24,
		image: nameIcon,
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
									disabled: model._isPeepSelected,
								}),
								spinner({
									minimum: 0,
									value: model._x,
									height: 13,
									padding: {top: 0, right: 10,  bottom: 0},
									disabled: model._isPeepSelected,
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
									disabled: model._isPeepSelected,
								}),
								spinner({
									minimum: 0,
									value: model._y,
									height: 13,
									padding: {top: 0, right: 10,  bottom: 0},
									disabled: model._isPeepSelected,
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
									disabled: model._isPeepSelected,
								}),
								spinner({
									minimum: 0,
									value: model._z,
									height: 13,
									padding: {top: 0, right: 10,  bottom: 0},
									disabled: model._isPeepSelected,
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
									disabled: model._isPeepSelected,
								}),
								spinner({
									minimum: 0,
									maximum: 255,
									value: model._energy,
									height: 13,
									padding: {top: 10, right: 10, bottom: 5},
									disabled: model._isPeepSelected,
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
					// vertical({
					// 	content: staticControls
					// })
				]),
				horizontal([
					label({
						text: "Mulitplier:",
						//width: "70%",
						height: 13,
						padding: [5, -20, 7, "1w"],
					}),
					dropdown({
						padding: [5, 15, 7, -20],
						width: "20%",
						height: 13,
						items: ["1x", "10x", "100x", "1000x"],
						onChange: (number: number) => {
							if (number === 0) {multiplier = 1};
							if (number === 1) { multiplier =10};
							if (number === 2) { multiplier =100};
							if (number === 3) { multiplier =1000};
							debug(`Multiplier set to ${multiplier}`)
						}
					})
				]),
			]
		}),
		tab({ //appearance
			image: paintIcon,
			content: [
				horizontal([
					groupbox({
					text: "{WHITE}Appearance",
					spacing: 2,
					content: [
						horizontal([
							label({
								text: "Staff type:",
								width: "40%",
								padding: {top: 10, bottom: 2, left: 10},
							}),
							dropdown({
								padding: {top: 10, right: 10,  bottom: 2},
								items: []
							})
						]),
						horizontal([
							label({
								text: "Costume:",
								width: "40%",
								padding: {top: 2, bottom: 2, left: 10},
							}),
							dropdown({
								padding: {top: 2, right: 10,  bottom: 2},
								items: model._availableCostumes,
								onChange: (index) => {
									const peep = model._selectedPeep.get();
									const staff = <Staff>peep;
									const availableCostumes = model._availableCostumes.get()
									availableCostumes[index]
									if (staff !== undefined){
									staff.costume = availableCostumes[index];
									}
								}
							})
						]),
						horizontal([
							label({
								text: "Animation:",
								width: "40%",
								padding: {top: 2, bottom: 2, left: 10},
							}),
							dropdown({
								padding: {top: 2, right: 10,  bottom: 2},
								items: model._availableAnimations,
								onChange: (index) => {
									const peep = model._selectedPeep.get();
									const availableAnimations = model._availableAnimations.get()
									availableAnimations[index]
									if (peep !== undefined){
									peep.animation = availableAnimations[index];
									}
								}

							})
						]),
						horizontal([
							label({
								text: "Animation frame:",
								width: "40%",
								padding: {top: 20, bottom: 10, left: 10},
							}),
							spinner({
								padding: {top: 20, right: 10, bottom: 10},
								value: model._animationFrame,
								step: 1,
								onChange: (_, adj) => {
									const peep = model._selectedPeep.get();
									if (peep !== undefined){
										debug(`Frame: ${peep.animationOffset}`);
										model._animationFrame.set(peep.animationOffset);
										peep.animationOffset += adj;
									}
								}
							})
						]),
					]
				}),
				vertical({
					content: staticControls
				})
			])
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

