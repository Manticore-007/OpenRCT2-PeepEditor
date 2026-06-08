import { button, Colour, horizontal, label, window } from "openrct2-flexui";
import { model } from "../viewmodel/PeepViewModel";
import { removePeepExecuteArgs } from "../actions/peepRemover";
import { closeSideWindow } from "./sideWindow";

export function openWindowRemovePeep(peep: BaseStaff | Guest): void {
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
							context.executeAction("pe-removepeep", removePeepExecuteArgs(peep.id));
						removePeepWindow.close();
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
						removePeepWindow.close();
					}
				}),
			])
		]
	});
	removePeepWindow.open();
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