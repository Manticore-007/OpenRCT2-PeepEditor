import { selectedPeep, windowId } from "../helpers/windowProperties";
import { returnSuccess } from "./base";

export function setPeepNameQuery(args: object): GameActionResult
{
    args;
    return returnSuccess();
}

export function setPeepNameExecute(args: object): GameActionResult
{
    const entity = map.getEntity(args.peepId);
    const peep: Guest | Staff = <Guest|Staff>entity;

    return setPeepName(peep);
}

export function setPeepName(peep: Staff | Guest): GameActionResult
{
	const window = ui.getWindow(windowId);
	ui.showTextInput({
		title: peepTypeTitle(peep),
		description: peepTypeDescription(peep),
		initialValue: `${selectedPeep.name}`,
		callback: text => {
			selectedPeep.name = text;
			window.findWidget<LabelWidget>("label-peep-name").text = `{WHITE}${text}`;
		},
	});
    return returnSuccess();
}

function peepTypeTitle(peep: Staff | Guest): string
{
	if (peep.peepType === "staff") { return "Staff member name"; }
	else return "Guest's name";
}

function peepTypeDescription(peep: Staff | Guest): string
{
	if (peep.peepType === "staff") { return "Enter new name for this member of staff:"; }
	else { return "Enter name for this guest:"; }
}

export function setPeepNameExecuteArgs(peep: Guest | Staff): object
{
    return {"peepId": peep.id};
}