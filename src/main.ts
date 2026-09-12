import { initActions } from "./actions/initActions";
import { initCustomSprites } from "./helpers/customImages";
import { isUiAvailable } from "./helpers/environment";
import { debug } from "./helpers/logger";
import { initSettings, menuLabel } from "./helpers/settings";
import { initShortcuts } from "./helpers/initShortcutKeys";
import { initRides } from "./helpers/rides";
import { templateWindowMain } from "./ui/mainWindow";

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
	initRides();
	initCustomSprites();
	initShortcuts();
	ui.registerMenuItem(menuLabel.get(), () => templateWindowMain.open());
}