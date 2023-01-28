export let selectedPeep: Guest|Staff;

export function setSelectedPeep(entity: Guest|Staff): void
{
    selectedPeep = entity;
}