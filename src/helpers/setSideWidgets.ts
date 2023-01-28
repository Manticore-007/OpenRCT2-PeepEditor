import { aboutWidgets } from "../ui/aboutWidgets"
import { AllGuestWidgets } from "../ui/allGuestWidgets"
import { guestWidgets } from "../ui/guestWidgets"
import { staffWidgets } from "../ui/staffWidgets"

export function setSideWidgets(type: string): WidgetDesc[] | undefined
{
    switch (type)
    {
        case "About":
            return aboutWidgets
        case "Guest properties":
            return guestWidgets
        case "Staff member properties":
            return staffWidgets
        case "All guests properties":
            return AllGuestWidgets
    }
    return undefined
}