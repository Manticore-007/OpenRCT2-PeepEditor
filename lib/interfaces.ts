export interface PeepFlagsArgs {
    guestId: number | null;
    key: PeepFlags;
    value: boolean;
}

type GuestProperty = "tshirtColour" | "trousersColour" | "hatColour" | "balloonColour" | "umbrellaColour";

export interface GuestColours {
    guestId: number | null;
    property: GuestProperty;
    colour: number;
}

export interface PeepId { peepId: number | null;}

export interface StaffEnergy {
    staffId: number | null;
    operator: number;
}

export interface StaffCoordinates extends StaffEnergy{
    axis: keyof CoordsXYZ;
}

export interface SetStaffEnergy {
    staffId: number | null;
    speed: number;
}

export interface StaffTypeSet {
    staffId: number | null;
    staffType: number;
}

export interface StaffCostumeSet {
    staffId: number | null;
    costume: number;
}

export interface PeepName {
    peepId: number | null;
    text: string
}

export interface SetStaffCoordinates {
    staffId: number | null;
    axis: keyof CoordsXYZ;
    text: string;
}

export interface StaffColour {
    staffId: number | null;
    colour: number;
}