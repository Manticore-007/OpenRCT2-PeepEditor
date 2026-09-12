import { guestKeysExecute } from "./guestKeys";
import { guestFlagsExecute } from "./guestFlags";
import { itemRemoveExecute } from "./removeItem";
import { animationExecute } from "./animation";
import { animationFrameExecute } from "./animationFrame";
import { colourExecute } from "./colour";
import { positionExecute } from "./position";
import { renameExecute } from "./rename";
import { removeExecute } from "./remove";
import { directionExecute } from "./direction";
import { queryPermissionCheck } from "./permissions";
import { costumeExecute } from "./costume";
import { ordersExecute } from "./orders";
import { staffTypeExecute } from "./staffType";
import { giveItemExecute } from "./giveItem";

export function initActions(): void
{
register("pe-rename", renameExecute);
register("pe-remove", removeExecute);
register("pe-position", positionExecute);
register("pe-colour", colourExecute);
register("pe-stafftype", staffTypeExecute);
register("pe-orders", ordersExecute);
register("pe-costume", costumeExecute);
register("pe-animation", animationExecute);
register("pe-animationframe", animationFrameExecute);
register("pe-guestflags", guestFlagsExecute);
register("pe-guestkeys", guestKeysExecute);
register("pe-giveitem", giveItemExecute);
register("pe-removeitem", itemRemoveExecute);
register("pe-direction", directionExecute);
}

const register = <T>(name: string, executeCallback: (args: T) => GameActionResult) => {
    context.registerAction<T>(
        name,
        queryPermissionCheck, // Point-free style simplification
        (args) => executeCallback(args.args)
    );
};