/**
 * Scroll the main viewport to the currently selected peep.
 */
export function locate(peep: Guest | Staff): void
{
	ui.mainViewport.scrollTo({ x: peep.x, y: peep.y, z: peep.z });
}