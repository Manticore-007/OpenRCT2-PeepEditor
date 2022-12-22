import {selectedPeep} from "./window";

export function setColour(number: number): void
{
    const staff = <Staff>selectedPeep;
    staff.colour = number;
}
