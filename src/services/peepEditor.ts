
const execute = register<UpdatePeepSettingArgs>("pe-update-peep", updatePeepSetting);


type PeepUpdateKeys
	= "x" | "y" | "z";

const
	xPosition = "x",
	yPosition = "y",
	zPosition = "z"



/**
 * Sets the x position for this vehicle.
 */
export function setPositionX(peep: Guest | Staff, x: number): void
{
	updateValue(peep, xPosition, x);
}

/**
 * Sets the y position for this vehicle.
 */
export function setPositionY(peep: Guest | Staff, y: number): void
{
	updateValue(peep, yPosition, y);
}

/**
 * Sets the z position for this vehicle.
 */
export function setPositionZ(peep: Guest | Staff, z: number): void
{
	updateValue(peep, zPosition, z);
}


/**
 * Arguments for updating a single key in a vehicle object.
 */
interface UpdatePeepSettingArgs
{
	targets: Guest | Staff;
	key: PeepUpdateKeys;
	value: number;
}

/**
 * Dispatches an update game action to other clients to update the specified key.
 */
function updateValue(peep: Guest | Staff, key: PeepUpdateKeys, value: number): void
{
	execute({ targets: peep, key, value });
}

/**
 * Update one specific setting on the specified vehicle.
 */
function updatePeepSetting(args: UpdatePeepSettingArgs): void
{
	const { key, value } = args;
	let callback: (peep: Guest | Staff, index: number) => void;
	switch (key) // Restrict key to permitted set.
	{
		case xPosition:
		case yPosition:
		case zPosition:
		{
			callback = (peep): void =>
			{
				peep[key] += value;
			};
			break;
		}
		default:
		{
			console.log("Setting", key, "not valid. Value:", value);
			return;
		}
	}
}

export type Action<T> = (args: T) => void;

const registeredActions: Record<string, Action<never>> = {};

function register<T>(name: string, action: Action<T>): Action<T>
{
	registeredActions[name] = action;
	return (args: T): void =>
	{
		console.log("Execute action", name, "with args:", JSON.stringify(args));
		context.executeAction(name, <never>args);
	};
}