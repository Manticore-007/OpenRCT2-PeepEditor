import { store } from "openrct2-flexui";
import { getAllRides, ParkRide } from "../objects/parkRides";
import { model } from "../viewmodel/peepViewModel";

export const rideList = store<ParkRide[]>([]);
const selectedRide = store<[ParkRide, number] | null>(null);

rideList.subscribe(r => {
	let selection: [ParkRide, number] | null = null;
	if (r.length > 0)
	{
		const previous = selectedRide.get();
		const selectedIdx = (previous && previous[1] < r.length) ? previous[1] : 0;
		selection = [ r[selectedIdx], selectedIdx ];
	}
	selectedRide.set(selection);
});

rideList.set(getAllRides());
model._rideId.set(rideList.get()[0]._id);