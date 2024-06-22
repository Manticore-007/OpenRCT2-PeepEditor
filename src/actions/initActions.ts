import { GuestFlagsArgs, guestFlagsExecute } from "./guestFlags";
import { GuestHappinessArgs, guestHappinessExecute } from "./guestHappiness";
import { GuestHungerArgs, guestHungerExecute } from "./guestHunger";
import { GuestItemRemoveArgs, guestItemRemoveExecute } from "./guestItemRemove";
import { GuestMassArgs, guestMassExecute } from "./guestMass";
import { GuestNauseaArgs, guestNauseaExecute } from "./guestNausea";
import { GuestThirstArgs, guestThirstExecute } from "./guestThirst";
import { GuestToiletArgs, guestToiletExecute } from "./guestToilet";
import { PeepAnimationArgs, animationPeepExecute } from "./peepAnimation";
import { PeepAnimationFrameArgs, animationFramePeepExecute } from "./peepAnimationFrame";
import { PeepColourArgs, colourPeepExecute } from "./peepColour";
import { PeepFreezeArgs, freezePeepExecute } from "./peepFreezer";
import { PeepMoveArgs, movePeepExecute } from "./peepMover";
import { PeepNameArgs, namePeepExecute } from "./peepNamer";
import { PeepRemoveArgs, removePeepExecute } from "./peepRemover";
import { PeepSpeedArgs, speedPeepExecute } from "./peepSpeed";
import { queryPermissionCheck } from "./permissions";
import { StaffCostumeArgs, staffCostumeExecute } from "./staffSetCostume";
import { StaffOrdersArgs, staffOrdersExecute } from "./staffSetOrders";
import { StaffTypeArgs, staffTypeExecute } from "./staffSetType";

export function initActions(): void
{
context.registerAction<PeepFreezeArgs>("pe-freezepeep", (args) => queryPermissionCheck(args), (args) => freezePeepExecute(args.args));
context.registerAction<PeepNameArgs>("pe-namepeep", (args) => queryPermissionCheck(args), (args) => namePeepExecute(args.args));
context.registerAction<PeepRemoveArgs>("pe-removepeep", (args) => queryPermissionCheck(args), (args) => removePeepExecute(args.args));
context.registerAction<PeepMoveArgs>("pe-movepeep", (args) => queryPermissionCheck(args), (args) => movePeepExecute(args.args));
context.registerAction<PeepSpeedArgs>("pe-speedpeep", (args) => queryPermissionCheck(args), (args) => speedPeepExecute(args.args));
context.registerAction<PeepColourArgs>("pe-colourpeep", (args) => queryPermissionCheck(args), (args) => colourPeepExecute(args.args));
context.registerAction<StaffTypeArgs>("pe-stafftype", (args) => queryPermissionCheck(args), (args) => staffTypeExecute(args.args));
context.registerAction<StaffOrdersArgs>("pe-stafforders", (args) => queryPermissionCheck(args), (args) => staffOrdersExecute(args.args));
context.registerAction<StaffCostumeArgs>("pe-staffcostume", (args) => queryPermissionCheck(args), (args) => staffCostumeExecute(args.args));
context.registerAction<PeepAnimationArgs>("pe-animationpeep", (args) => queryPermissionCheck(args), (args) => animationPeepExecute(args.args));
context.registerAction<PeepAnimationFrameArgs>("pe-animationframepeep", (args) => queryPermissionCheck(args), (args) => animationFramePeepExecute(args.args));
context.registerAction<GuestFlagsArgs>("pe-guestflags", (args) => queryPermissionCheck(args), (args) => guestFlagsExecute(args.args));
context.registerAction<GuestHappinessArgs>("pe-guesthappiness", (args) => queryPermissionCheck(args), (args) => guestHappinessExecute(args.args));
context.registerAction<GuestHungerArgs>("pe-guesthunger", (args) => queryPermissionCheck(args), (args) => guestHungerExecute(args.args));
context.registerAction<GuestThirstArgs>("pe-guestthirst", (args) => queryPermissionCheck(args), (args) => guestThirstExecute(args.args));
context.registerAction<GuestNauseaArgs>("pe-guestnausea", (args) => queryPermissionCheck(args), (args) => guestNauseaExecute(args.args));
context.registerAction<GuestToiletArgs>("pe-guesttoilet", (args) => queryPermissionCheck(args), (args) => guestToiletExecute(args.args));
context.registerAction<GuestMassArgs>("pe-guestmass", (args) => queryPermissionCheck(args), (args) => guestMassExecute(args.args));
context.registerAction<GuestItemRemoveArgs>("pe-guestitemremove", (args) => queryPermissionCheck(args), (args) => guestItemRemoveExecute(args.args));
}