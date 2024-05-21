import { initActions } from "./actions/initActions";
import { isUiAvailable } from "./helpers/environment";
import { debug } from "./helpers/logger";
import { windowPeepEditor } from "./ui/mainWindow";

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
	ui.registerMenuItem("Peep Editor FlexUI", () => windowPeepEditor.open());
}