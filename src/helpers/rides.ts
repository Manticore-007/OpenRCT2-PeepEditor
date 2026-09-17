import { store } from "openrct2-flexui";
import { getAllRides, ParkRide } from "../objects/parkRides";


export const rideList = store<ParkRide[]>([]);
export const selectedRide = store<[ParkRide, number] | null>(null);
export const rideId = store<number>(0);
export const photo1RideName = store<string>("");
export const photo2RideName = store<string>("");
export const photo3RideName = store<string>("");
export const photo4RideName = store<string>("");

export function initRides(): void
{
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
    if (rideList.get().length > 0)
    {
        rideId.set(rideList.get()[0]._id);
    }
}