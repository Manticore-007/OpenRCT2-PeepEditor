const windowColour: number = 19;

export type GuestColoursOptions = "tshirtColour" | "trousersColour" | "balloonColour" | "umbrellaColour" | "hatColour";
export let guestColourOptions: { [Keys in GuestColoursOptions]: { id: string; colour: number | null } } = {
	tshirtColour: {
		id: 'guest-editor-tshirts',
		colour: windowColour,
	},
	trousersColour: {
		id: 'guest-editor-trousers',
		colour: windowColour,
	},
	balloonColour: {
		id: 'guest-editor-balloons',
		colour: windowColour,
	},
	umbrellaColour: {
		id: 'guest-editor-umbrellas',
		colour: windowColour,
	},
	hatColour: {
		id: 'guest-editor-hats',
		colour: windowColour,
	},
};

export function SetColour(colour: number, property: GuestColoursOptions) {
    const guest = map.getAllEntities("guest");
    guest.forEach(guest => {
        guest[property] = colour;
    });
    guestColourOptions[property].colour = colour;
}