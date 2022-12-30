import { isUiAvailable } from "./helpers/environment";
import { debug } from "./helpers/logger";
import { PeepEditorWindow } from "./ui/mainWindow/mainWindow";
import { initCustomSprites } from "./helpers/customImages";
import { initActions } from "./gameActions/initActions";

const window = new PeepEditorWindow();

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
	initCustomSprites();

	ui.registerMenuItem("Peep Editor", () => window.open());
}