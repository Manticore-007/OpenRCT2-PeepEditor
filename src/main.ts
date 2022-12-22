import { isUiAvailable } from "./helpers/environment";
import { debug } from "./helpers/logger";
import { PeepEditorWindow } from "./ui/window";
import {setFlagExecute, setFlagQuery} from "./game_actions/setFlags";


const window = new PeepEditorWindow();


/**
 * Entry point of the plugin.
 */
export function main(): void
{
	debug("Plugin started.");

	if (!isUiAvailable/* || network.mode != "none"*/)
	{
		return;
	}

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    context.registerAction("pe_setflag", (args) => setFlagQuery(args), (args ) => setFlagExecute(args));

	ui.registerMenuItem("Peep Editor (alpha)", () => window.open());
}
