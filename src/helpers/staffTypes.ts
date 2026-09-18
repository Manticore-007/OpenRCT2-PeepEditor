export enum StaffTypeLabel {
    handyman = "Handyman",
    mechanic = "Mechanic",
    security = "Security guard",
    entertainer = "Entertainer",
}

export const staffType = [
    "handyman",
    "mechanic",
    "security",
    "entertainer",
] as const;

export type StaffType = typeof staffType[number];

export const staffTypeList = staffType.map(type => StaffTypeLabel[type]);