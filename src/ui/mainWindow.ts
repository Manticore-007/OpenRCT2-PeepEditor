import { button, checkbox, Colour, colourPicker, compute, dropdown, graphics, groupbox, horizontal, label, listview, store, tab, tabwindow, textbox, toggle, twoway, vertical, viewport, WritableStore } from "openrct2-flexui";
import { model } from "../viewmodel/PeepViewModel";
import { selectByTiles } from "../services/selector";
import { isDevelopment, pluginVersion } from "../helpers/environment";
import { getWindow } from "../helpers/getWindow";
import { ProgressBarColour } from "../helpers/progressBar";
import { getColour, isPinned, isSticky, setColour, setMenuItem, setSticky, setTheme, theme } from "../helpers/settings";
import { openWindowRemovePeep } from "./removePeepWindow";
import { buttonSize, img, windowMain } from "./windowConsts";
import { colourWindow as colourSideWindow, templateWindowSide } from "./sideWindow";
import { renameExecuteArgs } from "../actions/rename";
import { guestFlagsExecuteArgs } from "../actions/guestFlags";
import { togglePeepPicker } from "../services/peepPicker";

const colourWindow =
{
    primary: store<Colour>(getColour("pe.main.primary", Colour.DarkYellow)),
    secondary: store<Colour>(getColour("pe.main.secondary", Colour.DarkYellow)),
    tertiary: store<Colour>(Colour.DarkYellow),
};

export const templateWindowMain = tabwindow({
    title: compute(model._name, n => n),
    width: 260,
    height: 230,
    colours: [colourWindow.primary.get(), colourWindow.secondary.get(), colourWindow.primary.get()],
    tabs: [
        tab({ //main tab
            image: img.lens,
            content: [
                horizontal([
                    viewport({
                        visibility: compute(model._allGuests, a => a.length > 1 ? "none" : "visible"),
                        target: compute(model._selectedPeep, p => p ? p.id : null)
                    }),
                    graphics({
                        visibility: compute(model._allGuests, a => a.length > 1 ? "visible" : "none"),
                        onDraw(g) {
                            g.colour = 55;
                            g.well(0, 0, 225, 165);
                            g.text(`{WHITE}Guests selected: ${model._numGuests.get()}`, 6, 6)
                        },
                    }),
                    vertical({
                        content: [
                            toggle({	//picker
                                width: buttonSize, height: buttonSize,
                                image: "eyedropper",
                                tooltip: "Select a peep on the map",
                                isPressed: twoway(model._isPicking),
                                disabled: model._allGuestsSelected,
                                padding: { top: 0, left: -2, bottom: -2, right: -2 },
                                onChange: (pressed) => togglePeepPicker(pressed, p => model._select(p), () => model._isPicking.set(false))
                            }),
                            toggle({
                                height: buttonSize, width: buttonSize,
                                image: img.tiles,
                                tooltip: "Select guests on selected tiles",
                                isPressed: twoway(model._isSelectingByTiles),
                                onChange: (pressed) => {
                                    model._toggleAllGuests(false);
                                    selectByTiles("guest", pressed, guests => {
                                        model._allGuests.set(guests);
                                        model._numGuests.set(guests.length);
                                        if (guests.length === 1) {
                                            model._selectedPeep.set(guests[0]);
                                        }
                                    }, () => model._isSelectingByTiles.set(false))
                                }
                            }),
                            toggle({	//all guests
                                height: buttonSize, width: buttonSize,
                                image: "guests",
                                tooltip: "Select all guests on the map",
                                padding: { top: 2 },
                                isPressed: twoway(model._allGuestsSelected),
                                onChange: (pressed) => {
                                    if (!pressed) {
                                        templateWindowSide.close();
                                        return;
                                    }
                                    model._toggleAllGuests(pressed);
                                    ui.showError("WARNING", "Take caution when you already have frozen peeps in your map");
                                    templateWindowSide.open();
                                }
                            }),
                            button({	//nametag
                                height: buttonSize, width: buttonSize,
                                image: "rename",
                                tooltip: "Give the selected peep a new name, even a longer name than usual",
                                disabled: model._disabledWhenNoSinglePeepSelected,
                                padding: { top: -2, left: -2, bottom: -2, right: -2 },
                                onClick: () => rename(model._selectedPeep.get())
                            }),
                            button({	//locator
                                height: buttonSize, width: buttonSize,
                                image: "locate",
                                tooltip: "Focus the main viewport on the selected peep",
                                disabled: model._disabledWhenNoSinglePeepSelected,
                                padding: { top: -2, left: -2, bottom: -2, right: -2 },
                                onClick: () => locate(model._selectedPeep.get())
                            }),
                            button({	//trashcan
                                height: buttonSize, width: buttonSize,
                                image: "demolish",
                                tooltip: "Remove the selected peep from existence",
                                disabled: model._disabledWhenNoSinglePeepSelected,
                                padding: { top: -2, left: -2, bottom: -2, right: -2 },
                                onClick: () => {
                                    const peep = model._selectedPeep.get();
                                    if (peep) openWindowRemovePeep(peep);
                                }
                            }),
                            toggle({	//tracking (blue i)
                                height: buttonSize, width: buttonSize,
                                image: 5188,
                                tooltip: "Turn on/off tracking information for this guest - (If tracking is on, guest’s movements will be reported in the message area)",
                                disabled: compute(model._disabledWhenNoSinglePeepSelected, s => s),
                                padding: { top: -2, left: -2, bottom: -2, right: -2 },
                                isPressed: twoway(model._isTracking),
                                onChange: (pressed) => track(pressed)
                            })
                        ]
                    })
                ]),
                label({
                    text: "{BLACK}Manticore-007 © 2022-2026",
                    height: 0,
                    padding: [-5, 0, 10, 0],
                    alignment: "centred"
                })
            ]
        }),
        tab({
            image: img.peeps,
            height: "inherit",
            content: [
                horizontal([
                    groupbox({
                        text: "Frozen peeps",
                        content: [
                            horizontal([
                                label({
                                    text: "Filter",
                                    width: "20%"
                                }),
                                dropdown({
                                    items: ["Guests", "Staff"],
                                    onChange: (idx) => {
                                        switch (idx) {
                                            case 0: model._selectPeepType.set("guest"); break;
                                            case 1: model._selectPeepType.set("staff"); break;
                                        }
                                    }
                                }),
                                textbox({
                                    onChange: (text) => {
                                        filterPeeps("guest", text);
                                        filterPeeps("staff", text);
                                    }
                                }),
                            ]),
                            listview({
                                columns: ["{WINDOW_COLOUR_2}Name"],
                                items: model._allGuestsSorted,
                                visibility: model._visibilityListviewWhenGuest,
                                canSelect: true,
                                onHighlight: (index) => {
                                    const allGuests = model._allGuestEntities.get();
                                    locate(allGuests[allGuests.map(e => { return e.name }).indexOf(model._allGuestsSorted.get()[index])])
                                },
                                onClick: (index) => {
                                    const main = windowMain.get();
                                    const allGuests = model._allGuestEntities.get();
                                    model._select(allGuests[allGuests.map(e => { return e.name }).indexOf(model._allGuestsSorted.get()[index])])
                                    templateWindowSide.open();
                                    model._allGuestsSelected.set(false);
                                    if (main) main.tabIndex = 0;
                                }
                            }),
                            listview({
                                columns: ["{WINDOW_COLOUR_2}Name"],
                                items: model._allStaffSorted,
                                visibility: model._visibilityListviewWhenStaff,
                                canSelect: true,
                                onHighlight: (index) => {
                                    const allStaff = model._allStaffEntities.get();
                                    locate(allStaff[allStaff.map(e => { return e.name }).indexOf(model._allStaffSorted.get()[index])])
                                },

                                onClick: (index) => {
                                    const main = windowMain.get();
                                    const allStaff = model._allStaffEntities.get();
                                    model._select(allStaff[allStaff.map(e => { return e.name }).indexOf(model._allStaffSorted.get()[index])])
                                    if (main) {
                                        main.tabIndex = 0;
                                    }
                                    templateWindowSide.open();
                                }
                            })
                        ]
                    }),
                ]),
            ],
            onOpen: () => {
                filterPeeps("guest", "");
                filterPeeps("staff", "");
            }
        }),
        tab({   //options
            image: img.gear,
            height: "inherit",
            content: [
                groupbox({
                    text: "Options",
                    content: [
                        checkbox({
                            text: "Side window sticks to main window",
                            isChecked: isSticky,
                            onChange: (checked) => {
                                isSticky.set(checked);
                                setSticky(checked);
                            }
                        }),
                        checkbox({
                            text: "Pin to top in menu    {RED}(Requires reload of park)",
                            isChecked: isPinned,
                            onChange: (checked) => {
                                isPinned.set(checked);
                                setMenuItem(checked);
                            }
                        }),
                        horizontal([
                            label({
                                text: "Button style:",
                                width: "40%"
                            }),
                            dropdown({
                                items: ["Rollercoaster Tycoon 1", "Rollercoaster Tycoon 2"],
                                selectedIndex: compute(theme, t => t === "rct1" ? 0 : 1),
                                onChange: (index) => {
                                    switch (index) {
                                        case 0:
                                            {
                                                setTheme("rct1");
                                                theme.set("rct1");
                                                console.log("theme set to rct1");
                                            }
                                            break;
                                        case 1:
                                            {
                                                setTheme("rct2");
                                                theme.set("rct2");
                                                console.log("theme set to rct2");
                                                break;
                                            }
                                    }
                                }
                            })
                        ])
                    ]
                }),
                groupbox({
                    text: "Colours",
                    spacing: 0,
                    content: [
                        createColorRow("Main window:", [
                            { store: colourWindow.primary, key: "pe.main.primary" },
                            { store: colourWindow.secondary, key: "pe.main.secondary" }
                        ]),
                        createColorRow("Side window:", [
                            { store: colourSideWindow.primary, key: "pe.side.primary" },
                            {
                                store: colourSideWindow.secondary,
                                key: "pe.side.secondary",
                                extra: (c) => {
                                    ProgressBarColour.background.set(c);
                                    setColour("pe.bar.background", c);
                                }
                            }
                        ]),
                        horizontal([
                            label({ text: "Progress bar:" }),
                            ...[
                                { store: ProgressBarColour.bar.safe, key: "pe.bar.safe" },
                                { store: ProgressBarColour.bar.warning, key: "pe.bar.warning" },
                                { store: ProgressBarColour.bar.danger, key: "pe.bar.danger" }
                            ].map(({ store, key }) => colourPicker({
                                colour: store,
                                onChange: (colour) => {
                                    store.set(colour);
                                    setColour(key, colour);
                                }
                            }))
                        ]),
                        button({
                            text: "Reset to default colours",
                            height: 14,
                            width: "60%",
                            padding: { top: 4, left: "1w" },
                            onClick: resetColours
                        })
                    ]
                }),
            ]
        }),
        tab({
            image: img.info,
            content: [
                label({ text: "Peep Editor, a plugin for OpenRCT2", alignment: "centred", padding: [4, 0, 8, 0] }),
                horizontal([
                    label({ text: "Version:" + "\n\nAuthor:" + "\n\nUI:" + "\n\nSpecial\nThanks:" + "\n\n", width: "25%" }),
                    label({ text: versionString() + `\n\n{BLACK}Manticore-007` + `\n\n{BLACK}FlexUI by Basssiiie` + `\n\n{BLACK}Basssiiie, Gymnasiast, ItsSmitty\nSpacek531, AaronVanGeffen` + `\n{BLACK}Sadret, mrmagic2020, Isoitiro\nand Enox` })
                ]),
                label({ text: "https://github.com/Manticore-007\n/OpenRCT2-PeepEditor", padding: ["90%", 0, 0, 0], alignment: "centred" })
            ]
        }),
    ],
    onOpen: () => {
        windowMain.set(getWindow("Peep Editor"));
        model._open();
    },
    onClose: () => {
        model._selectPeepType.set("guest");
        ui.tool?.cancel();
        templateWindowSide.close();
        model._dispose();
    },
    onUpdate: () => {
        const main = windowMain.get();
        if (main) {
            main.colours = [colourWindow.primary.get(), colourWindow.secondary.get(), colourWindow.tertiary.get()]
        }
    },
});


//export function openedMainWindow(): OpenWindow { return templateWindowMain.open() };

// export function closeWindowMain(): void {
//     openedMainWindow().close();
// }

function versionString(): string {
    return isDevelopment ? `{BLACK}${pluginVersion} {BABYBLUE}[BETA]` : `{BLACK}${pluginVersion}`;
}

function alphabetize(allPeeps: (Guest | BaseStaff)[]): string[] {
    return allPeeps
        .filter(peep => peep.getFlag("positionFrozen") || peep.getFlag("animationFrozen"))
        .map(peep => peep.name)
        .sort();
}

function rename(peep: Guest | BaseStaff | null): void {
    if (!peep) return;

    const peepTextConfig: Record<string, { title: string; description: string }> =
    {
        guest: {
            title: "{WHITE}Guest's name",
            description: "Enter name for this guest:"
        },
        staff: {
            title: "{WHITE}Staff member name",
            description: "Enter name for this member of staff:"
        }
    };

    const config = peepTextConfig[peep.type] ?? { title: "", description: "" };

    ui.showTextInput({
        title: config.title,
        description: config.description,
        initialValue: `${peep.name}`,
        callback: text => {
            context.executeAction("pe-rename", renameExecuteArgs(peep.id, text));
            model._name.set(text);
        }
    });
}

function locate(peep: Guest | BaseStaff | null): void {
    if (peep !== null) ui.mainViewport.scrollTo({ x: peep.x, y: peep.y, z: peep.z });
}

function track(pressed: boolean): void {
    const guest = model._selectedPeep.get() as Guest
    if (guest !== null) context.executeAction("pe-guestflags", guestFlagsExecuteArgs(guest.id, pressed, "tracking"));
}

function resetColours(): void {
    function reset(store: { set: (c: number) => void }, key: string | null, colour: number) {
        store.set(colour);
        if (key) setColour(key, colour);
    };

    reset(colourWindow.primary, "pe.main.primary", Colour.AquaDark);
    reset(colourWindow.secondary, "pe.main.secondary", Colour.LightBrown);

    reset(colourSideWindow.primary, "pe.side.primary", Colour.AquaDark);
    reset(colourSideWindow.secondary, "pe.side.secondary", Colour.LightBrown);

    reset(ProgressBarColour.background, "pe.bar.background", Colour.LightBrown);
    reset(ProgressBarColour.bar.danger, "pe.bar.danger", Colour.BrightRed);
    reset(ProgressBarColour.bar.warning, "pe.bar.warning", Colour.Yellow);
    reset(ProgressBarColour.bar.safe, "pe.bar.safe", Colour.BrightGreen);
}

function createColorRow(labelText: string, pickers: { store: WritableStore<number>, key: string, extra?: (c: number) => void }[]) {
    return horizontal([
        label({ text: labelText }),
        ...pickers.map(({ store, key, extra }) => colourPicker({
            colour: twoway(store),
            onChange: (colour) => {
                setColour(key, colour);
                extra?.(colour);
            }
        }))
    ]);
}

function filterPeeps(type: "guest" | "staff", text: string): void {
    const entities = map.getAllEntities(type) as any[];
    const entityModel = type === "guest" ? model._allGuestEntities : model._allStaffEntities;
    const sortedModel = type === "guest" ? model._allGuestsSorted : model._allStaffSorted;

    entityModel.set(entities);

    const lowerText = text.toLowerCase();
    const filtered = alphabetize(entities).filter(item =>
        String(item).toLowerCase().includes(lowerText)
    );
    sortedModel.set(filtered);
};