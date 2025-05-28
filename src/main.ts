import { initActions } from "./actions/initActions";
import { initCustomSprites } from "./helpers/customImages";
import { isUiAvailable } from "./helpers/environment";
import { debug } from "./helpers/logger";
import { mainWindow } from "./ui/mainWindow";
import { initSettings, menuLabel } from "./helpers/settings";
import { initRideList } from "./helpers/initRideList";

/**
 * Entry point of the plugin.
 */
export function main(): void
{
	debug("Plugin started.");

	if (!isUiAvailable)
	{
		return;
	}
	initActions();
	initSettings();
	initCustomSprites();
	initRideList();
	ui.registerMenuItem(menuLabel.get(), () => mainWindow.open());
}