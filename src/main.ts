import { initActions } from "./actions/initActions";
import { initCustomSprites } from "./helpers/customImages";
import { isUiAvailable } from "./helpers/environment";
import { debug } from "./helpers/logger";
import { mainWindow } from "./ui/mainWindow";
import { initSettings, menuLabel } from "./helpers/settings";

/**
 * Entry point of the plugin.
 */
export function main(): void
{
	debug("\x1b[1;33m" + "Peep Editor initialized" + "\x1b[0m");

	if (!isUiAvailable)
	{
		return;
	}
	initActions();
	initSettings();
	initCustomSprites();
	ui.registerMenuItem(menuLabel.get(), () => mainWindow.open());
}