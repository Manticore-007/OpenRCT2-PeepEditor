import { isUiAvailable } from "./helpers/environment";
import { debug } from "./helpers/logger";
import { PeepEditorWindow } from "./ui/window";


const window = new PeepEditorWindow();


/**
 * Entry point of the plugin.
 */
export function main(): void
{
	debug("Plugin started.");

	if (!isUiAvailable || network.mode != "none")
	{
		return;
	}

	ui.registerMenuItem("Peep Editor", () => window.open());
}
