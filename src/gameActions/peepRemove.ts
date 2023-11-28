import { colour } from "../enums/colours";
import { debug } from "../helpers/logger";
import { widgetLineHeight, windowId } from "../helpers/windowProperties";
import { resetViewport } from "../helpers/resetViewport";
import { setLabelPeepName } from "../helpers/peepSelection";
import * as btn from "../helpers/buttonControl";
import { sideWindow } from "../ui/sideWindow";
import { PeepId } from "../../lib/interfaces";

export const removePeepWindow = "remove-peep-window";

export function removePeep(peep: Staff | Guest): void
{
	const thisWindow = ui.getWindow(removePeepWindow);
	if (thisWindow) {
		debug("Remove peep window is already shown");
		thisWindow.bringToFront();
	}
	else
		ui.openWindow({
			onClose: () => {
				ui.tool?.cancel();
			},
			classification: removePeepWindow,
			title: "Remove peep",
			width: 200,
			height: 100,
			x: ui.width / 2 - 100,
			y: ui.height / 2 - 50,
			colours: [colour["Bordeaux red"], colour["Bordeaux red"]],
			widgets: [
				<LabelDesc>{
					type: "label",
					x: 0,
					y: 48,
					width: 200,
					height: widgetLineHeight,
					textAlign: "centred",
					text: textRemovePeep(peep),
					isDisabled: false
				},
				<ButtonDesc>{
					name: "yes",
					type: "button",
					border: true,
					x: 10,
					y: 80,
					width: 85,
					height: 14,
					text: "Yes",
					isPressed: false,
					isDisabled: false,
					onClick: () => {
						ui.getWindow(removePeepWindow).close();
						sideWindow.close();
						ui.getWindow(windowId).findWidget<LabelWidget>("label-peep-name").text = `{RED} No peep selected`;
						resetViewport();
						setLabelPeepName();
						btn.disableAll();
						btn.unpressAll();
						context.executeAction("pe_removepeep", removePeepExecuteArgs(peep));
					}
				},
				<ButtonDesc>{
					name: "cancel",
					type: "button",
					border: true,
					x: 105,
					y: 80,
					width: 85,
					height: 14,
					text: "Cancel",
					isPressed: false,
					isDisabled: false,
					onClick: () => ui.getWindow(removePeepWindow).close()
				},
			]
		});
}

export function removePeepQuery(args: PeepId): GameActionResult
{
    args;
    return {};
}

export function removePeepExecute(args: PeepId): GameActionResult
{
	if (args.peepId === null) 
	{
		return {};
	}
    const entity = map.getEntity(args.peepId);
    const peep: Guest | Staff = <Guest|Staff>entity;

    return confirmRemove(peep);
}

function confirmRemove(peep: Staff | Guest): GameActionResult
{
	peep.remove();
	debug("Peep removed");
	return {};
}

export function removePeepExecuteArgs(peep: Guest | Staff): PeepId
{
    return { "peepId": peep.id };
}

function textRemovePeep(peep: Guest | Staff): string
{
	if (ui.getWindow(windowId).findWidget<ButtonWidget>("button-all-guests").isPressed)
	{
		return `{WHITE}Are you sure you want to remove\n all guests?`;
	}
	else return `{WHITE}Are you sure you want to remove\n${peep.name}?`;
}


// remove all guests

export function removeAllGuestsQuery(): GameActionResult
{
    return {};
}

export function removeAllGuestsExecute(): GameActionResult
{
    const allGuests = map.getAllEntities("guest");
    return removeAllGuests(allGuests);
}

export function removeAllGuestsExecuteArgs(): object
{
    return {};
}

function removeAllGuests(allGuests: Guest[]): GameActionResult
{
	closeIfOpen(removePeepWindow);
	resetViewport();
	ui.getWindow(windowId).findWidget<LabelWidget>("label-peep-name").text = `{RED} No peep selected`;
	btn.disableAll();
	btn.unpressAll();
	ui.showError("            Not available...            ", "Please use Cheats menu");
	debug(allGuests.length + " guests would've been removed");
	//allGuests.forEach(guest => {guest.remove();});
	return {};
}

function closeIfOpen(windowName: string): void
{
	const window = ui.getWindow(windowName);
	if (window) 
	{
		window.close();
	}
}