import { find } from "../helpers/arrayHelper";
import { debug } from "../helpers/logger";

const requiredEditPermission: PermissionType = "guest" && "staff";

/**
 * Callback for registered actions to check permissions.
 */
export function queryPermissionCheck(args: GameActionEventArgs<unknown>): GameActionResult
{
	if (hasPermissions(args.player, requiredEditPermission))
	{
		return {};
	}

	return {
		error: 2, // GameActions::Status::Disallowed
		errorTitle: "Missing permissions!",
		errorMessage: "Permission 'Guest' and 'Staff' is required to use the Peep Editor on this server."
	};
}


/**
 * Check if the player has the correct permissions, if in a multiplayer server.
 */
function hasPermissions(playerId: number, permission: PermissionType): boolean
{
	if (network.mode !== "none")
	{
		const player = network.getPlayer(playerId);
		const groupId = player.group;
        const group = find(network.groups, g => g.id === groupId);
		if (!group)
        {
            debug("Cannot apply update from player", playerId, ": group id", groupId, "not found.");
            return false;
        }
        if (group.permissions.indexOf(permission) < 0)
        {
            debug("Cannot apply update from player", playerId, ": lacking", permission, "permission.");
            return false;
        }
	}
	return true;
}