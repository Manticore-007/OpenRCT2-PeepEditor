
/// <reference path="../../lib/openrct2.d.ts" />

import { button, horizontal, label, tab, tabwindow, vertical, viewport, toggle, twoway, compute, Colour, window, groupbox, spinner, dropdown } from "openrct2-flexui";
import { togglePeepPicker } from "../services/peepPicker";
import { peepViewModel } from "../viewmodel/peepViewModel";
import { locate } from "../services/peepLocator";

const model = new peepViewModel;

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

const staticControls = [
	toggle({
		width: 24,
		height: 24,
		image: "eyedropper",
		isPressed: twoway(model._isPicking),
		padding: {top: 1},
		onChange: pressed => togglePeepPicker(pressed, p => {model._select(p); model._tabImage(p)}, () => model._isPicking.set(false))
	}),
	toggle({
		height: 24,
		width: 24,
		image: flagsIcon,
		disabled: model._isPeepSelected,
		isPressed: model._isFrozen,
		padding: {top: 1},
		onChange: pressed => {
			model._freeze(pressed);
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
						{text}
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
	title: "Peep Editor FlexUI",
	width: 260,
	height: 230,
	colours: [Colour.DarkYellow, Colour.DarkYellow, Colour.DarkYellow],
	padding: 5,
	onOpen: () => model._open(),
	onClose: () => model._close(),
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
			content: [
				horizontal([
					groupbox({
						text: "{WHITE}Kinematics",
						spacing: 2,
						content: [
							horizontal([
								label({
									text: "X position:",
									width: "40%",
									padding: {top: 10, bottom: 2, left: 10},
								}),
								spinner({
									padding: {top: 10, right: 10,  bottom: 2},
								})
							]),
							horizontal([
								label({
									text: "Y position:",
									width: "40%",
									padding: {top: 2, bottom: 2, left: 10},
								}),
								spinner({
									padding: {top: 2, right: 10,  bottom: 2},
								})
							]),
							horizontal([
								label({
									text: "Z position:",
									width: "40%",
									padding: {top: 2, bottom: 2, left: 10},
								}),
								spinner({
									padding: {top: 2, right: 10,  bottom: 2},
								})
							]),
							horizontal([
								label({
									text: "Speed:",
									width: "40%",
									padding: {top: 20, bottom: 10, left: 10},
								}),
								spinner({
									padding: {top: 20, right: 10, bottom: 10},
								})
							]),
						]
					}),
					vertical({
						content: staticControls
					})
				]),
				horizontal([
					label({
						text: "Mulitplier:",
						width: "40%",
						padding: ["1w", 10, 7, 10],
					}),
					dropdown({
						padding: ["1w", 45, 7, 0],
						items: ["1x", "10x", "100x"],
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
							spinner({
								padding: {top: 10, right: 10,  bottom: 2},
							})
						]),
						horizontal([
							label({
								text: "Costume:",
								width: "40%",
								padding: {top: 2, bottom: 2, left: 10},
							}),
							spinner({
								padding: {top: 2, right: 10,  bottom: 2},
							})
						]),
						horizontal([
							label({
								text: "Z position:",
								width: "40%",
								padding: {top: 2, bottom: 2, left: 10},
							}),
							spinner({
								padding: {top: 2, right: 10,  bottom: 2},
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
						text: `{WHITE}24.4.28\n\n{WHITE}Manticore-007\n\n{WHITE}FlexUI by Basssiiie\n\n{WHITE}Basssiiie, Gymnasiast, ItsSmitty\nSpacek531, AaronVanGeffen\nSadret and Enox`,
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
							{}
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