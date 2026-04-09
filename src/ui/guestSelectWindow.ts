import { colour } from "../enums/colours";
import { selectPeepByEntityId } from "../helpers/peepSelection";
import { onPeepSelect } from "../helpers/selectedPeep";
import { margin, toolbarHeight } from "../helpers/windowProperties";

const guestSelectWindowId = "peep-editor-guest-select-window";

const windowWidth = 300;
const windowHeight = 500;
const windowColour = colour["Saturated red"];

const peepListColumns: ListViewDesc["columns"] = [
    {
        header: "ID",
        // FIXME: Crashes the game?
        // canSort: true,
    },
    {
        header: "Name",
        // FIXME: Crashes the game?
        // canSort: true,
    },
    {
        header: "Type",
        // FIXME: Crashes the game?
        // canSort: true,
    },
];

function peepListItem(peep: Guest | Staff): ListViewItem {
    const idStr = String(peep.id ?? -1);
    if (isStaff(peep)) {
        return [idStr, peep.name ?? "<none>", peep.staffType ?? "<none>"];
    } else if (isGuest(peep)) {
        return [idStr, peep.name ?? "<none>"];
    } else {
        return [idStr];
    }
}

function isStaff(peep: Guest | Staff): peep is Staff {
    return peep.type === "staff";
}
function isGuest(peep: Guest | Staff): peep is Guest {
    return peep.type === "guest";
}

class GuestSelectWindow {
    constructor() {
        // Synchronize the list selection with the picker.
        onPeepSelect((selectedPeep) => {
            const peepList = this.peepList;
            if (!peepList) {
                return;
            }

            this.refresh();
            let selectedIndex = -1;
            switch (selectedPeep.type) {
                case "guest":
                    selectedIndex = findIndex(
                        this.capturedGuests,
                        (guest) => guest.id === selectedPeep.id,
                    );
                    if (selectedIndex !== -1) {
                        // + 1 for guest header.
                        selectedIndex += 1;
                    }
                    break;
                case "staff":
                    selectedIndex = findIndex(
                        this.capturedStaff,
                        (staff) => staff.id === selectedPeep.id,
                    );
                    if (selectedIndex !== -1) {
                        selectedIndex += this.capturedGuests.length + 2; // +1 for guest header, +1 for staff header.
                    }

                    break;
            }

            if (selectedIndex !== -1) {
                // FIXME: OpenRCT does not properly invalidate the window when this is called.
                // peepList.selectedCell = {
                //     column: 0,
                //     row: selectedIndex,
                // };
            }
        });
    }
    // TODO: Tabs for these.
    capturedGuests: Guest[] = [];
    capturedStaff: Staff[] = [];

    get peepList(): ListViewWidget | null {
        const window = this.getWindow();
        if (!window) {
            return null;
        }
        return window.findWidget("list-peeps") as ListViewWidget | null;
    }

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

    onListViewClick(index: number): void {
        const peep = this.getPeepFromListboxIndex(index);
        if (peep && peep.id != null) {
            selectPeepByEntityId(peep.id);
        }
    }

    getWindow(): Window | null {
        return ui.getWindow(guestSelectWindowId);
    }

    getOrCreateWindow(): Window {
        let window = this.getWindow();
        if (!window) {
            window = ui.openWindow({
                classification: guestSelectWindowId,
                title: "Select a guest",
                x: ui.width - windowWidth / 8 - windowWidth,
                y: ui.height / 8 - windowHeight / 8,
                width: windowWidth,
                height: windowHeight,
                colours: [windowColour, windowColour],
                widgets: [
                    {
                        type: "listview",
                        name: "list-peeps",
                        x: margin,
                        width: windowWidth - margin * 2,
                        y: toolbarHeight + margin,
                        height: windowHeight - toolbarHeight - margin * 2,
                        columns: peepListColumns,
                        showColumnHeaders: true,
                        canSelect: true,
                        items: [
                            { type: "separator", text: "Guests" },
                            ...this.capturedGuests.map(peepListItem),
                            { type: "separator", text: "Staff" },
                            ...this.capturedStaff.map(peepListItem),
                        ],
                        onClick: (item): void => {
                            this.onListViewClick(item);
                        },
                    },
                ],
            });
        }
        return window;
    }

    open(): void {
        this.refresh();
        this.getOrCreateWindow().bringToFront();
    }
}

function findIndex(array: any[], predicate: (item: any) => boolean): number {
    for (let i = 0; i < array.length; i++) {
        if (predicate(array[i])) {
            return i;
        }
    }
    return -1;
}

const guestSelectWindow = new GuestSelectWindow();
export default guestSelectWindow;

