import {debug} from "../../helpers/logger";
import {colour} from "../../helpers/colours";
import {widgetLineHeight} from "../../helpers/windowProperties";

export const removePeepWindow = "remove-peep-window";

export function removePeep(peep: Staff | Guest, callback: Function)
{
    const thisWindow = ui.getWindow(removePeepWindow);
    if (thisWindow) {
        debug("Remove peep window is already shown");
        thisWindow.bringToFront();
        return;
    }

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
                text: context.formatString(context.getStringById(1711).replace('{STRINGID}', '{STRING}'), peep.name),
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
                text: context.getStringById(1710),
                isPressed: false,
                isDisabled: false,
                onClick: () => confirmRemove(peep, callback),
            },
            <ButtonDesc>{
                name: "cancel",
                type: "button",
                border: true,
                x: 105,
                y: 80,
                width: 85,
                height: 14,
                text: context.getStringById(946),
                isPressed: false,
                isDisabled: false,
                onClick: () => ui.getWindow(removePeepWindow).close()
            },
        ]
    });
}

function confirmRemove(peep: Guest | Staff, callback: Function): void
{
    ui.getWindow(removePeepWindow).close();
    callback(peep);
}
