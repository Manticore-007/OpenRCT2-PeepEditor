import { selectPeepByEntityId } from "../helpers/peepSelection";
import { onPeepSelect } from "../helpers/selectedPeep";
import {
    margin,
    toolbarHeight,
    windowColour,
} from "../helpers/windowProperties";

const guestSelectWindowId = "peep-editor-guest-select-window";

const windowWidth = 300;
const windowHeight = 500;

// TODO: Use tabs instead of separators so we can sort.
const peepListColumns: ListViewDesc["columns"] = [
    {
        header: "ID",
        // Crashes the game due to our use of separators.
        canSort: false,
    },
    {
        header: "Name",
        // Crashes the game due to our use of separators.
        canSort: false,
    },
];

function peepListItem(peep: Guest | Staff): ListViewItem {
    const idStr = String(peep.id ?? -1);
    return [idStr, peep.name ?? "<none>"];
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
                peepList.selectedCell = {
                    column: 0,
                    row: selectedIndex,
                };
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
                title: "Peep Editor - Select a peep",
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

