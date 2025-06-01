import { getAllRides, ParkRide } from "../objects/parkRides";
import { model } from "../viewmodel/peepViewModel";

export function initRides(): void
{
    model._rideList.subscribe(r => {
        let selection: [ParkRide, number] | null = null;
        if (r.length > 0)
        {
            const previous = model._selectedRide.get();
            const selectedIdx = (previous && previous[1] < r.length) ? previous[1] : 0;
            selection = [ r[selectedIdx], selectedIdx ];
        }
        model._selectedRide.set(selection);
    });
    model._rideList.set(getAllRides());
    if (model._rideList.get().length > 0)
    {
        model._rideId.set(model._rideList.get()[0]._id);
    }
}