import { button, checkbox, Colour, colourPicker, compute, dropdown, groupbox, horizontal, label, listview, store, tab, tabwindow, toggle, twoway, vertical, viewport } from "openrct2-flexui";
import { model } from "../viewmodel/PeepViewModel";
import { togglePeepPicker } from "../services/peepPicker";
import { isDevelopment, pluginVersion } from "../helpers/environment";
import { getWindow } from "../helpers/getWindow";
import { ProgressBarColour } from "../helpers/progressBar";
import { getColour, isPinned, isSticky, setColour, setMenuItem, setSticky, setTheme, theme } from "../helpers/settings";
import { openWindowRemovePeep } from "./removePeepWindow";
import { buttonSize, img, windowMain } from "./windowConsts";
import { closeSideWindow, openSideWindow, colourWindow as colourSideWindow } from "./sideWindow";
import { namePeepExecuteArgs } from "../actions/peepNamer";
import { guestFlagsExecuteArgs } from "../actions/guestFlags";

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
    colours: [colourWindow.primary.get(), colourWindow.secondary.get(), colourWindow.tertiary.get()],
    tabs: [
        tab({ //main tab
            image: img.lens,
            content: [
                horizontal([
                    viewport({target: compute(model._selectedPeep, p => p ? p.id : null)}),
                    vertical({
                        content: [
                            toggle({	//picker
                                width: buttonSize, height: buttonSize,
                                image: "eyedropper",
                                tooltip: "Select a peep on the map",
                                isPressed: twoway(model._isPicking),
                                disabled: model._allGuestsSelected,
                                padding: { top: 0, left: -2, bottom: -2, right: -2 },
                                onChange: pressed => togglePeepPicker(pressed, p => model._select(p), () => model._isPicking.set(false))
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
                                onClick: () =>
                                {
                                    const peep = model._selectedPeep.get();
                                    if (peep) openWindowRemovePeep(peep);
                                }
                            }),
                            toggle({	//tracking (blue i)
                                height: buttonSize, width: buttonSize,
                                image: 5188,
                                tooltip: "Turn on/off tracking information for this guest - (If tracking is on, guest’s movements will be reported in the message area)",
                                disabled: compute(model._disabledWhenNoSinglePeepSelected, model._isGuest, (s, g) => (s || !g)),
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
            image: img.guests,
            height: "inherit",
            content: [
                horizontal([
                groupbox({
                    text: "Frozen peeps",
                    content: [
                        horizontal([
                            label({
                                text: "Filter",
                                width: "30%"
                            }),
                            dropdown({
                                items: ["Guests", "Staff"],
                                onChange: (idx) =>
                                    {
                                        switch(idx)
                                        {
                                            case 0: model._selectPeepType.set("guest"); break;
                                            case 1: model._selectPeepType.set("staff"); break;
                                        }
                                    }
                            })
                        ]),
                    listview({
                        columns: ["{WINDOW_COLOUR_2}Name"],
                        items: model._allGuestsSorted,
                        visibility: model._visibilityListviewWhenGuest,
                        canSelect: true,
                        onHighlight: (index) =>
                        {
                            const allGuests = model._allGuestEntities.get();
                            locate(allGuests[allGuests.map( e => {return e.name}).indexOf(model._allGuestsSorted.get()[index])])
                        },
                        onClick: (index) =>
                        {
                        const main = windowMain.get();
                        const allGuests = model._allGuestEntities.get();
                        model._select(allGuests[allGuests.map( e => {return e.name}).indexOf(model._allGuestsSorted.get()[index])])
                        openSideWindow();
                        model._allGuestsSelected.set(false);
                        if (main) main.tabIndex = 0;
                        }
                    }),
                    listview({
                        columns: ["{WINDOW_COLOUR_2}Name"],
                        items: model._allStaffSorted,
                        visibility: model._visibilityListviewWhenStaff,
                        canSelect: true,
                        onHighlight: (index) =>
                        {
                            const allStaff = model._allStaffEntities.get();
                            locate(allStaff[allStaff.map( e => {return e.name}).indexOf(model._allStaffSorted.get()[index])])
                        },

                        onClick: (index) =>
                        {
                        const main = windowMain.get();
                        const allStaff = model._allStaffEntities.get();
                        model._select(allStaff[allStaff.map( e => {return e.name}).indexOf(model._allStaffSorted.get()[index])])
                        if (main)
                        {
                        main.tabIndex = 0;
                        }
                        openSideWindow();
                        }
                    })
                ]
                
            }),
            toggle({	//all guests
                height: buttonSize, width: buttonSize,
                image: "guests",
                tooltip: "Select all guests on the map",
                padding: { top: 2 },
                isPressed: twoway(model._allGuestsSelected),
                onChange: (pressed) =>
                {
                    model._toggleAllGuests(pressed);
                    pressed ? openSideWindow() : closeSideWindow();
                }
            })
        ])
        ],
        onOpen: () =>
        {
            model._allGuestEntities.set(map.getAllEntities("guest"));
            model._allStaffEntities.set(map.getAllEntities("staff"));
            model._allGuestsSorted.set(alphabetize(model._allGuestEntities.get()))
            model._allStaffSorted.set(alphabetize(model._allStaffEntities.get()))
        }}),
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
                            onChange: (checked) =>
                            {
                                isSticky.set(checked);
                                setSticky(checked);
                            }
                        }),
                        checkbox({
                            text: "Pin to top in menu    {RED}(Requires reload of park)",
                            isChecked: isPinned,
                            onChange: (checked) =>
                            {
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
                                onChange: (index) =>
                                {
                                    switch (index)
                                    {
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
                        horizontal([
                            label({text: "Main window:"}),
                            colourPicker({
                                colour: colourWindow.primary,
                                onChange: (colour) =>
                                {
                                    colourWindow.primary.set(colour);
                                    setColour("pe.main.primary", colour);
                                }
                            }),
                            colourPicker({
                                colour: colourWindow.secondary,
                                onChange: (colour) =>
                                {
                                    colourWindow.secondary.set(colour);
                                    setColour("pe.main.secondary", colour);
                                }
                            }),
                        ]),
                        horizontal([
                            label({text: "Side window:"}),
                            colourPicker({
                                colour: colourSideWindow.primary,
                                onChange: (colour) =>
                                {
                                    colourSideWindow.primary.set(colour);
                                    setColour("pe.side.primary", colour);
                                }
                            }),
                            colourPicker({
                                colour: colourSideWindow.secondary,
                                onChange: (colour) =>
                                {
                                    colourSideWindow.secondary.set(colour);
                                    setColour("pe.side.secondary", colour);
                                    ProgressBarColour.background.set(colour);
                                    setColour("pe.bar.background", colour);
                                }
                            }),
                        ]),
                        horizontal([
                            label({text: "Progress bar:"}),
                            colourPicker({
                                colour: ProgressBarColour.bar.safe,
                                onChange: (colour) =>
                                {
                                    ProgressBarColour.bar.safe.set(colour);
                                    setColour("pe.bar.safe", colour);
                                }
                            }),
                            colourPicker({
                                colour: ProgressBarColour.bar.warning,
                                onChange: (colour) => 
                                {
                                    ProgressBarColour.bar.warning.set(colour);
                                    setColour("pe.bar.warning", colour);
                                }
                            }),
                            colourPicker({
                                colour: ProgressBarColour.bar.danger,
                                onChange: (colour) =>
                                {
                                    ProgressBarColour.bar.danger.set(colour);
                                    setColour("pe.bar.danger", colour);
                                }
                            }),
                        ]),
                        button({
                            text: "Reset to default colours",
                            height: 14,
                            width: "60%",
                            padding: {top: 4, left: "1w"},
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
					label({ text: versionString() + `\n\n{BLACK}Manticore-007` + `\n\n{BLACK}FlexUI by Basssiiie` + `\n\n{BLACK}Basssiiie, Gymnasiast, ItsSmitty\nSpacek531, AaronVanGeffen` + `\n{BLACK}Sadret, mrmagic2020, Isoitiro\nand Enox`})
				]),
				label({ text: "https://github.com/Manticore-007\n/OpenRCT2-PeepEditor", padding: ["90%", 0, 0, 0], alignment: "centred" })
			]
		}),
    ],
    onOpen: () =>{
        windowMain.set(getWindow("Peep Editor"));
        model._open();
    },
    onClose: () =>
    {
        model._selectPeepType.set("guest");
        ui.tool?.cancel();
        closeSideWindow();
        model._dispose();
    },
    onUpdate: () =>
    {
        const main = windowMain.get();
        if (main)
        {
            main.colours = [ colourWindow.primary.get(), colourWindow.secondary.get(), colourWindow.tertiary.get() ]
        }
    },
});

export function openWindowMain(): void{
    templateWindowMain.open();
}

export function closeWindowMain(): void{
    templateWindowMain.close();
}

function versionString(): string
{
    return isDevelopment ? `{BLACK}${pluginVersion} {BABYBLUE}[BETA]`: `{BLACK}${pluginVersion}`;
}

function alphabetize(allPeeps: (Guest | BaseStaff)[]): string[]
{
    const arr: (Guest | BaseStaff)[] = [];
    allPeeps.forEach(peep =>
    {
        if (peep.getFlag("positionFrozen") || peep.getFlag("animationFrozen"))
        {
            arr.push(peep);
        }
        return arr;
    });
    return arr.map(peep => peep.name).sort()
}

function rename(peep: Guest|BaseStaff|null): void
{
    if (peep !== null)
    {
        ui.showTextInput({
            title: textInputTitle(peep),
            description: textInputDescription(peep),
            initialValue: `${peep.name}`,
            callback: text => {context.executeAction("pe-namepeep", namePeepExecuteArgs(peep.id, text)); model._name.set(text)}
        });
    }
}

function textInputDescription(peep: Guest | BaseStaff | undefined): string {
	if (peep !== undefined && peep.type === "guest")
    {
		return "Enter name for this guest:";
	}
	else if (peep !== undefined && peep.type === "staff")
    {
		return "Enter name for this member of staff:";
	}
	else return "";
}

function textInputTitle(peep: Guest | BaseStaff): string {
	if (peep.type === "guest")
    {
		return `{WHITE}Guest's name`;
	}
	else if (peep.type === "staff")
    {
		return `{WHITE}Staff member name`;
	}
	else return "";
}
    
function locate(peep: Guest|BaseStaff|null): void
{
    if (peep !== null) ui.mainViewport.scrollTo({ x: peep.x, y: peep.y, z: peep.z });
}
    
function track(pressed: boolean): void
{
    const guest = model._selectedPeep.get() as Guest
    if (guest !== null) context.executeAction("pe-guestflags", guestFlagsExecuteArgs(guest.id, pressed, "tracking"));
}

function resetColours(): void
{
    const deepWater = Colour.AquaDark;
    const brown = Colour.LightBrown;
    colourWindow.primary.set(deepWater);
    colourWindow.secondary.set(brown);
    colourSideWindow.primary.set(deepWater);
    colourSideWindow.secondary.set(brown);
    ProgressBarColour.background.set(brown);
    ProgressBarColour.bar.danger.set(Colour.BrightRed);
    ProgressBarColour.bar.warning.set(Colour.Yellow);
    ProgressBarColour.bar.safe.set(Colour.BrightGreen);
    setColour("pe.main.primary", deepWater);
    setColour("pe.main.secondary", brown);
    setColour("pe.side.primary", deepWater);
    setColour("pe.side.secondary", brown);
    setColour("pe.bar.safe", Colour.BrightGreen);
    setColour("pe.bar.warning", Colour.Yellow);
    setColour("pe.bar.danger", Colour.BrightRed);
    setColour("pe.bar.background", brown);
}