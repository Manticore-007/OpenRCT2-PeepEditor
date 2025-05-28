import { Colour } from "openrct2-flexui";
import { initActions } from "./actions/initActions";
import { initCustomSprites } from "./helpers/customImages";
import { isUiAvailable } from "./helpers/environment";
import { debug } from "./helpers/logger";
import { mainWindow } from "./ui/mainWindow";
import { getColour } from "./helpers/settings";

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
	getColour("pe.main.primary", Colour.DarkYellow);
	getColour("pe.main.secondary", Colour.DarkYellow);
	getColour("pe.side.primary", Colour.DarkYellow);
	getColour("pe.side.secondary", Colour.DarkYellow);
	ui.registerMenuItem("Peep Editor (new UI)", () => mainWindow.open());
}