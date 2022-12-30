import { colour } from "../enums/colours";
import { debug } from "../helpers/logger";
import { resetViewport } from "../helpers/resetViewport";
import { peepPropertiesWindow, resetCoordinates, widgetLineHeight, windowId } from "../helpers/windowProperties";
import { returnSuccess } from "./base";

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
			colours: [colour.BordeauxRed, colour.BordeauxRed],
			widgets: [
				<LabelDesc>{
					type: "label",
					x: 0,
					y: 48,
					width: 200,
					height: widgetLineHeight,
					textAlign: "centred",
					text: `{WHITE}Are you sure you want to remove\n${peep.name}?`,
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
					onClick: () => context.executeAction("pe_removepeep", removePeepExecuteArgs(peep)),
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

export function removePeepQuery(args: object): GameActionResult
{
    args;
    return returnSuccess();
}

export function removePeepExecute(args: object): GameActionResult
{
    // @ts-ignore
    const entity = map.getEntity(args.peepId);
    const peep: Guest | Staff = <Guest|Staff>entity;

    return confirmRemove(peep);
}

function confirmRemove(peep: Staff | Guest): GameActionResult
{
    ui.getWindow(removePeepWindow).close();
    afterRemovePeepWindowClose(peep);
	return returnSuccess();
}

export function removePeepExecuteArgs(peep: Guest | Staff): object
{
    return { "peepId": peep.id };
}

export function afterRemovePeepWindowClose(peep: Guest | Staff): GameActionResult
{
	if (peep.peepType === "staff"){
		resetCoordinates();
	}
	const window = ui.getWindow(windowId);
	const buttonFreeze = window.findWidget<ButtonWidget>("button-freeze");
	const LabelName = window.findWidget<LabelWidget>("label-peep-name");
	buttonFreeze.isDisabled = true;
	buttonFreeze.isPressed = false;
	LabelName.text = `{RED} No peep selected`;
	ui.getWindow(peepPropertiesWindow).close();
	resetViewport(); 
	peep.remove();
    return returnSuccess();
}