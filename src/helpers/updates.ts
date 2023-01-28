let updateCoords: (IDisposable | null) = null;

export function updateCoordinates(updateCoordinates: IDisposable | null): void
{
	updateCoords = updateCoordinates;
}

export function disableUpdateCoordinates(): void
{
	updateCoords?.dispose();
	updateCoords = null;
}

let _updateStaffColour: (IDisposable | null) = null;

export function updateStaffColour(updateStaffColour: IDisposable | null): void
{
	_updateStaffColour = updateStaffColour;
}

export function disableUpdateStaffColour(): void
{
	_updateStaffColour?.dispose();
	_updateStaffColour = null;
}

let _updateSideWindowPos: (IDisposable | null) = null;

export function updateSideWindowPos(updateSideWindowPos: IDisposable | null): void
{
	_updateSideWindowPos = updateSideWindowPos;
}

export function disableUpdateSideWindowPos(): void
{
	_updateSideWindowPos?.dispose();
	_updateSideWindowPos = null;
}

let _updateEnergy: (IDisposable | null) = null;

export function updateEnergy(updateEnergy: IDisposable | null): void
{
	_updateEnergy = updateEnergy;
}
export function disableUpdateEnergy(): void
{
	_updateEnergy?.dispose();
	_updateEnergy = null;
}
