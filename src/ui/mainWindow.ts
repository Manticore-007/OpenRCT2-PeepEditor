import { debug } from "../helpers/logger";
import { windowId, widgetLineHeight, windowWidth, windowColour, margin, btnSize, toolbarHeight } from "../helpers/windowProperties";
import { setPeepNameExecuteArgs } from "../gameActions/peepSetName";
import { freezeStaffExecuteArgs } from "../gameActions/staffFreeze";
import { removePeep } from "../gameActions/peepRemove";
import { peepSelect } from "../helpers/peepSelection";
import { disableUpdateViewport, resetViewport } from "../helpers/resetViewport";
import { activateAllGuests } from "../helpers/allGuestsSelection";
import { openSideWindow, sideWindow } from "./sideWindow";
import { selectedPeep } from "../helpers/selectedPeep";

const groupboxName: GroupBoxDesc = {
	type: "groupbox",
	name: "groupbox-name",
	text: "Name",
	x: margin,
	y: toolbarHeight + widgetLineHeight / 2,
	height: widgetLineHeight * 2.5,
	width: windowWidth - margin * 2,
};
const labelPeepName: LabelDesc = {
	type: "label",
	name: "label-peep-name",
	x: groupboxName.x + margin,
	y: groupboxName.y + groupboxName.height / 2.5,
	height: widgetLineHeight,
	width: groupboxName.width - margin * 2 - widgetLineHeight,
	text: `{RED} No peep selected`,
	textAlign: "centred",
};

const viewportPeep: ViewportDesc = {
	type: "viewport",
	name: "viewport-peep",
	x: margin,
	y: groupboxName.y + groupboxName.height + margin,
	height: btnSize * 6,
	width: windowWidth - btnSize - margin * 2,
};

const btnPicker: ButtonDesc = {
	type: "button",
	name: "button-picker",
	x: viewportPeep.x +viewportPeep.width,
	y: viewportPeep.y,
	height: btnSize,
	width: btnSize,
	image: context.getIcon("eyedropper"),
	isPressed: false,
	tooltip: "Select a peep to modify",
	onClick: () => peepSelect(),
};

const btnFreeze: ButtonDesc = {
	type: "button",
	name: "button-freeze",
	x: btnPicker.x,
	y: btnPicker.y + btnPicker.height,
	height: btnSize,
	width: btnSize,
	image: 5182, //red-green flag
	border: false,
	isDisabled: true,
	tooltip: "(Un)freeze staff member",
	onClick: () => context.executeAction("pe_freezestaff", freezeStaffExecuteArgs(<Staff>selectedPeep)),
};

const btnName: ButtonDesc = {
	type: "button",
	name: "button-peep-name",
	x: btnPicker.x,
	y: btnFreeze.y + btnFreeze.height,
	height: btnSize,
	width: btnSize,
	image: 5168, //name tag
	border: false,
	isDisabled: true,
	tooltip: "Rename peep with longer name",
	onClick: () => context.executeAction("pe_peepname", setPeepNameExecuteArgs(selectedPeep)),
};

const btnLocate: ButtonDesc = {
	type: "button",
	name: "button-locate",
	x: btnPicker.x,
	y: btnName.y + btnName.height,
	height: btnSize,
	width: btnSize,
	image: 5167, //locate
	border: false,
	isDisabled: true,
	tooltip: "Go to selected peep",
	onClick: () => ui.mainViewport.scrollTo(selectedPeep),
};

const btnDelete: ButtonDesc = {
	type: "button",
	name: "button-delete",
	x: btnPicker.x,
	y: btnLocate.y + btnLocate.height,
	height: btnSize,
	width: btnSize,
	image: 5165, //trashcan
	border: false,
	isDisabled: true,
	tooltip: "Remove selected peep(s)",
	onClick: () => removePeep(selectedPeep),
};

const btnAllGuests: ButtonDesc = {
	type: "button",
	name: "button-all-guests",
	x: btnPicker.x,
	y: btnDelete.y + btnDelete.height,
	height: btnSize,
	width: btnSize,
	image: 5193, //group of guests
	border: false,
	isDisabled: false,
	tooltip: "Select all guests",
	onClick: () => activateAllGuests()
};

const labelAuthor: LabelDesc = {
	type: "label",
	name: "label-author",
	x: margin,
	y: viewportPeep.height +viewportPeep.y + margin / 2,
	height: widgetLineHeight,
	width: windowWidth - margin * 2,
	isDisabled: true,
	text: "Manticore-007 © 2022-2023",
	textAlign: "centred",
};

const btnAbout: ButtonDesc = {
	type: "button",
	name: "button-about",
	x: margin + 1,
	y: labelAuthor.y,
	height: 10,
	width: 10,
	image: 5129, //small info
	border: false,
	isDisabled: false,
	onClick: () => openSideWindow("About"),
};

export class PeepEditorWindow {

	/**
	 * Opens the window for the Peep Editor.
	 */

	open(): void {
		const window = ui.getWindow(windowId);
		const windowHeight = btnAbout.y + widgetLineHeight;
		if (window) {
			debug("The Peep Editor window is already shown.");
			window.bringToFront();
		}
		else {
			ui.openWindow({
				classification: windowId,
				title: "Peep Editor",
				x: ui.width / 8 - windowWidth / 8,
				y: ui.height / 8 - windowHeight / 8,
				width: windowWidth,
				height: windowHeight,
				colours: [windowColour, windowColour],
				widgets:
					[
						groupboxName,
						labelPeepName,
						viewportPeep,
						btnPicker,
						btnFreeze,
						btnName,
						btnLocate,
						btnDelete,
						btnAllGuests,
						labelAuthor,
						btnAbout
					],
				onClose: () => {
					const _sideWindow = ui.getWindow(sideWindow);
					if (_sideWindow) { _sideWindow.close(); }
					disableUpdateViewport();
					ui.tool?.cancel();
				},
				onUpdate: () => {
					const window = ui.getWindow(windowId);
					const _sidewindow = ui.getWindow(sideWindow);
					if (_sidewindow) {
							_sidewindow.x = window.x + window.width;
							_sidewindow.y = window.y;
					}
				}
			});
			resetViewport();
		}
	}
}