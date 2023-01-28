import { debug } from "../helpers/logger";
import { setSideWidgets } from "../helpers/setSideWidgets";
import { disableUpdateCoordinates, disableUpdateEnergy, disableUpdateSideWindowPos, disableUpdateStaffColour } from "../helpers/updates";
import { windowColour, windowId } from "../helpers/windowProperties";
import { resetColours } from "./allGuestWidgets";

export const sideWindow = "side-window";

export function openSideWindow(title: string): void
{
	const window = ui.getWindow(sideWindow);
	const mainWindow = ui.getWindow(windowId);
	if (window && window.title === title) {
		debug(`${title} window is already shown`);
		window.bringToFront();
	}
	else {
		if (window) {window.close();}
		ui.openWindow({
			classification: sideWindow,
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