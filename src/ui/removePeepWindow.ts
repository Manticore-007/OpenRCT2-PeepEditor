import { button, Colour, horizontal, label, window, OpenWindow } from "openrct2-flexui";
import { removeExecuteArgs } from "../actions/remove";
import { closeSideWindow } from "./sideWindow";
import { model } from "../viewmodel/PeepViewModel";

export function openWindowRemovePeep(peep: BaseStaff | Guest): OpenWindow {
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
						if (peep)
							context.executeAction("pe-remove", removeExecuteArgs(peep.id));
						openedWindow().close();
                        closeSideWindow();
						model._allGuests.set([]);
					}
				}),
				button({
					border: true,
					width: 85,
					height: 14,
					text: "Cancel",
					padding: [0, 4],
					onClick: () => {
						openedWindow().close();
					}
				}),
			])
		]
	});
	function openedWindow(): OpenWindow {return removePeepWindow.open()};
	return openedWindow();
}

function textRemovePeep(peep: Guest | BaseStaff): string {
	if (peep.type === "guest") {
		return `{WHITE}Are you sure you want to remove\n${peep.name}?`;
	}
	else if (peep.type === "staff") {
		return `{WHITE}Are you sure you want to sack\n${peep.name}?`;
	}
	else return "";
}