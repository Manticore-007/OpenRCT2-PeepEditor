import { setPeepNameExecute, setPeepNameQuery } from "./peepSetName";
import { freezeStaffExecute, freezeStaffQuery } from "./staffFreeze";
import { removePeepExecute, removePeepQuery } from "./peepRemove";
import { changeStaffCoordinatesExecute, changeStaffCoordinatesQuery } from "./staffChangeCoordinates";
import { changeStaffTypeExecute, changeStaffTypeQuery } from "./staffChangeType";
import { changeStaffCostumeExecute, changeStaffCostumeQuery } from "./staffChangeCostume";
import { setFlagExecute, setFlagQuery } from "./guestSetFlags";
import { setGuestColourExecute, setGuestColourQuery } from "./guestSetColours";

export function initActions(): void
{
	context.registerAction("pe_setflag", (args) => setFlagQuery(args), (args) => setFlagExecute(args));
	context.registerAction("pe_setguestcolour", (args) => setGuestColourQuery(args), (args) => setGuestColourExecute(args));
	context.registerAction("pe_peepname", (args) => setPeepNameQuery(args), (args) => setPeepNameExecute(args));
	context.registerAction("pe_freezestaff", (args) => freezeStaffQuery(args), (args) => freezeStaffExecute(args));
	context.registerAction("pe_removepeep", (args) => removePeepQuery(args), (args) => removePeepExecute(args));
	context.registerAction("pe_changestaffcoordinates", (args) => changeStaffCoordinatesQuery(args), (args) => changeStaffCoordinatesExecute(args));
	context.registerAction("pe_changestafftype", (args) => changeStaffTypeQuery(args), (args) => changeStaffTypeExecute(args));
	context.registerAction("pe_changestaffcostume", (args) => changeStaffCostumeQuery(args), (args) => changeStaffCostumeExecute(args));
}