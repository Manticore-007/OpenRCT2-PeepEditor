import { debug } from "../helpers/logger";
import { setSideWidgets } from "../helpers/setSideWidgets";
import { disableUpdateCoordinates, disableUpdateEnergy, disableUpdateSideWindowPos, disableUpdateStaffColour } from "../helpers/updates";
import { windowColour, windowId } from "../helpers/windowProperties";
import { resetColours } from "./allGuestWidgets";

export let sideWindow: Window;

export function openSideWindow(title: string): void
{
	const mainWindow = ui.getWindow(windowId);
	if (sideWindow && sideWindow.title === title) {
		debug(`${title} window is already shown`);
		sideWindow.bringToFront();
	}
	else {
		if (sideWindow) {sideWindow.close();}
		sideWindow = ui.openWindow({
			classification: "side-window",
			title: title,
			width: 200,
			height: mainWindow.height,
			x: mainWindow.x + mainWindow.width,
			y: mainWindow.y,
			colours: [windowColour, windowColour],
			widgets: setSideWidgets(title),
			onClose: () => {
				disableUpdateCoordinates();
				disableUpdateSideWindowPos();
				disableUpdateStaffColour();
				disableUpdateEnergy();
				resetColours();
			},
		});
	}
}