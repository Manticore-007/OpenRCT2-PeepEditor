import { openSideWindow, sideWindow } from "../ui/sideWindow";
import * as btn from "./buttonControl";
import { resetViewport } from "./resetViewport";
import { windowId } from "./windowProperties";

export function activateAllGuests(): void
{
    const mainWindow = ui.getWindow(windowId);

    if (mainWindow.findWidget<ButtonWidget>("button-picker").isPressed)
    {
        btn.toggle("button-picker");
    }
    if (!mainWindow.findWidget<ButtonWidget>("button-all-guests").isPressed)
    {
        btn.unpressAll();
        btn.disableAll();
        resetViewport();
        ui.tool?.cancel();
        btn.enable("button-delete");
        mainWindow.findWidget<LabelWidget>("label-peep-name").text = "{GREEN}All guests selected";
        openSideWindow("All guests properties");
    }
    else
    {
        btn.disable("button-delete");
        mainWindow.findWidget<LabelWidget>("label-peep-name").text = `{RED} No peep selected`;
        sideWindow.close();
    }
    btn.toggle("button-all-guests");
}