
const actionName = "pe-setcolourshirts";


interface SetColourShirtsArgs
{
	colour: number;
}


context.registerAction(
	actionName,
	(args: object): GameActionResult => 
	{ 
		const colourArgs = <SetColourShirtsArgs>args;
		console.log("query: " + JSON.stringify(colourArgs));
		return {};
	},
	(args: object): GameActionResult => 
	{
		const colourArgs = <SetColourShirtsArgs>args;

		const guest = map.getAllEntities("guest");
		guest.forEach(guest => 
		{
			guest.tshirtColour = colourArgs.colour;
		});
		return {};
	}
);


export function setColourShirts(tshirtcolour: number)
{
	const args = <SetColourShirtsArgs>{ colour: tshirtcolour };

	context.executeAction(actionName, args);
}