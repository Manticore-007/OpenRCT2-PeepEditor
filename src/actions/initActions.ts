import { PeepFreezeArgs, freezePeepExecute } from "./peepFreezer";
import { PeepMoveArgs, movePeepExecute } from "./peepMover";
import { PeepNameArgs, namePeepExecute } from "./peepNamer";
import { PeepRemoveArgs, removePeepExecute } from "./peepRemover";
import { PeepSpeedArgs, speedPeepExecute } from "./peepSpeed";
import { queryPermissionCheck } from "./permissions";

export function initActions(): void
{
context.registerAction<PeepFreezeArgs>("pe-freezepeep", (args) => queryPermissionCheck(args), (args) => freezePeepExecute(args.args));
context.registerAction<PeepNameArgs>("pe-namepeep", (args) => queryPermissionCheck(args), (args) => namePeepExecute(args.args));
context.registerAction<PeepRemoveArgs>("pe-removepeep", (args) => queryPermissionCheck(args), (args) => removePeepExecute(args.args));
context.registerAction<PeepMoveArgs>("pe-movepeep", (args) => queryPermissionCheck(args), (args) => movePeepExecute(args.args));
context.registerAction<PeepSpeedArgs>("pe-speedpeep", (args) => queryPermissionCheck(args), (args) => speedPeepExecute(args.args));
}