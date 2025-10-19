import { model } from "../viewmodel/PeepViewModel";

export function peepRotateExecute(): GameActionResult
{
    const allGuests = model._allGuests.get();
    const numDirections = 4;
    if (allGuests !== undefined) {
        const firstPeep = <Guest>allGuests[0];
        const direction = firstPeep.direction;
        allGuests.forEach(entity => {
            const peep = <Guest|BaseStaff>entity;
            if (peep.direction !== direction) peep.direction = direction;
            peep.direction = <Direction>((peep.direction + 1) % numDirections);
        });
    }

    return {};
}

export function peepRotateExecuteArgs(): object{
    return {};
}