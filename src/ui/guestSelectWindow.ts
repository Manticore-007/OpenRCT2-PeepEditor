import { colour } from "../enums/colours";
import { selectPeepByEntityId } from "../helpers/peepSelection";
import { margin, toolbarHeight } from "../helpers/windowProperties";

const guestSelectWindowId = "peep-editor-guest-select-window";

const windowWidth = 300;
const windowHeight = 500;
const windowColour = colour["Saturated red"];

class GuestSelectWindow {
    // TODO: Tabs for these.
    capturedGuests: Guest[] = [];
    capturedStaff: Staff[] = [];

    refresh(): void {
        this.capturedGuests = map.getAllEntities("guest");
        this.capturedStaff = map.getAllEntities("staff");
    }

    getPeepFromListboxIndex(index: number): Guest | Staff | null {
        if (index === 0) {
            // Guests header
            return null;
        }
        index -= 1;
        if (index < this.capturedGuests.length) {
            return this.capturedGuests[index];
        } else if (index === this.capturedGuests.length) {
            // Staff header
            return null;
        } else {
            index -= 1;
            const staffIndex = index - this.capturedGuests.length;
            if (staffIndex < this.capturedStaff.length) {
                return this.capturedStaff[staffIndex];
            }
        }
        return null;
    }

    open(): void {
        this.refresh();
        const window = ui.getWindow(guestSelectWindowId);
        if (window) {
            window.bringToFront();
        } else {
            ui.openWindow({
                classification: guestSelectWindowId,
                title: "Select a guest",
                x: ui.width / 8 - windowWidth / 8 + windowWidth,
                y: ui.height / 8 - windowHeight / 8,
                width: windowWidth,
                height: windowHeight,
                colours: [windowColour, windowColour],
                widgets: [
                    {
                        type: "listview",
                        x: margin,
                        width: windowWidth - margin * 2,
                        y: toolbarHeight + margin,
                        height: windowHeight - toolbarHeight - margin * 2,
                        columns: [
                            {
                                canSort: true,
                                header: "ID",
                            },
                            {
                                canSort: true,
                                header: "Name",
                            },
                        ],
                        items: [
                            { type: "separator", text: "Guests" },
                            ...this.capturedGuests.map((guest) => [
                                String(guest.id ?? -1),
                                guest.name ?? "<none>",
                            ]),
                            { type: "separator", text: "Staff" },
                            ...this.capturedStaff.map((staff) => [
                                String(staff.id ?? -1),
                                staff.name ?? "<none>",
                            ]),
                        ],
                        onClick: (item): void => {
                            const peep = this.getPeepFromListboxIndex(item);
                            if (peep && peep.id != null) {
                                selectPeepByEntityId(peep.id);
                            }
                        },
                    },
                ],
            });
        }
    }
}

const guestSelectWindow = new GuestSelectWindow();
export default guestSelectWindow;

