/**
 * Returns a peep entity by id, or null if the entity was not found or not a guest or staff.
 */
export function getPeepById(id: number): Guest | Staff | undefined
{
	const entity = map.getEntity(id);
	return (entity && isGuest(entity) || entity && isStaff(entity)) ? entity : undefined;
}

/**
 * Returns true if the entity is a guest, or false if not.
 */
export function isGuest(entity: Entity): entity is Guest
{
	return (entity.type === "guest");
}

/**
 * Returns true if the entity is a staff, or false if not.
 */
export function isStaff(entity: Entity): entity is Staff
{
	return (entity.type === "staff");
}