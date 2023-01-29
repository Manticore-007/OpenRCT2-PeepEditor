import { setPeepNameExecute } from "./peepSetName";
import { freezeStaffExecute } from "./staffFreeze";
import { removePeepExecute } from "./peepRemove";
import { changeStaffCoordinatesExecute, setStaffCoordinatesExecute } from "./staffChangeCoordinates";
import { changeStaffTypeExecute } from "./staffChangeType";
import { changeStaffCostumeExecute } from "./staffChangeCostume";
import { setFlagExecute } from "./guestSetFlags";
import { setGuestColourExecute } from "./guestSetColours";
import { changeStaffEnergyExecute } from "./staffChangeEnergy";
import { GuestColours, PeepFlagsArgs, PeepId, PeepName, SetStaffCoordinates, SetStaffEnergy, StaffColour, StaffCoordinates, StaffCostumeSet, StaffEnergy, StaffTypeSet } from "../../lib/interfaces";
import { changeStaffColourExecute } from "./staffChangeColour";
import { setStaffEnergyExecute } from "./staffSetEnergy";
import { queryPermissionCheck } from "./permissions";

export function initActions(): void
{
	context.registerAction<PeepFlagsArgs>("pe_setflag", (args) => queryPermissionCheck(args), (args) => setFlagExecute(args.args));
	context.registerAction<GuestColours>("pe_setguestcolour", (args) => queryPermissionCheck(args), (args) => setGuestColourExecute(args.args));
	context.registerAction<PeepName>("pe_peepname", (args) => queryPermissionCheck(args), (args) => setPeepNameExecute(args.args));
	context.registerAction<PeepId>("pe_freezestaff", (args) => queryPermissionCheck(args), (args) => freezeStaffExecute(args.args));
	context.registerAction<PeepId>("pe_removepeep", (args) => queryPermissionCheck(args), (args) => removePeepExecute(args.args));
	context.registerAction<StaffCoordinates>("pe_changestaffcoordinates", (args) => queryPermissionCheck(args), (args) => changeStaffCoordinatesExecute(args.args));
	context.registerAction<SetStaffCoordinates>("pe_setstaffcoordinates", (args) => queryPermissionCheck(args), (args) => setStaffCoordinatesExecute(args.args));
	context.registerAction<StaffEnergy>("pe_changestaffenergy", (args) => queryPermissionCheck(args), (args) => changeStaffEnergyExecute(args.args));
	context.registerAction<SetStaffEnergy>("pe_setstaffenergy", (args) => queryPermissionCheck(args), (args) => setStaffEnergyExecute(args.args));
	context.registerAction<StaffColour>("pe_changestaffcolour", (args) => queryPermissionCheck(args), (args) => changeStaffColourExecute(args.args));
	context.registerAction<StaffTypeSet>("pe_changestafftype", (args) => queryPermissionCheck(args), (args) => changeStaffTypeExecute(args.args));
	context.registerAction<StaffCostumeSet>("pe_changestaffcostume", (args) => queryPermissionCheck(args), (args) => changeStaffCostumeExecute(args.args));
}