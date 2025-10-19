import { button, checkbox, Colour, colourPicker, compute, dropdown, FlexiblePosition, groupbox, horizontal, label, listview, tab, tabwindow, toggle, twoway, vertical, viewport, WidgetCreator } from "openrct2-flexui";
import { model } from "../viewmodel/PeepViewModel";
import { sideWindow } from "./sideWindow";
import { togglePeepPicker } from "../services/peepPicker";
import { isDevelopment, pluginVersion } from "../helpers/environment";
import { getWindow } from "../helpers/getWindow";
import { ProgressBarColour } from "../helpers/progressBar";
import { setColour, setMenuItem, setSticky, setTheme } from "../helpers/settings";
import { openWindowRemovePeep } from "./removePeepWindow";
import { buttonSize, img } from "./windowConsts";

export const mainWindow = tabwindow({
    title: compute(model._name, n => n),
    width: 260,
    height: 230,
    colours: [model._mainWindowColour.primary.get(), model._mainWindowColour.secondary.get(), model._mainWindowColour.tertiary.get()],
    tabs: [
        tab({ //main tab
            image: img.lens,
            content: [
                horizontal([
                    viewport({target: compute(model._selectedPeep, p => p ? p.id : null)}),
                    vertical({
                        content: 
                            buttonStyle().concat(
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
                                onClick: () => model._rename(model._selectedPeep.get())
                            }),
                            button({	//locator
                                height: buttonSize, width: buttonSize,
                                image: "locate",
                                tooltip: "Focus the main viewport on the selected peep",
                                disabled: model._disabledWhenNoSinglePeepSelected,
                                padding: { top: -2, left: -2, bottom: -2, right: -2 },
                                onClick: () => model._locate(model._selectedPeep.get())
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
                            toggle({	//all guests
                                height: buttonSize, width: buttonSize,
                                image: "guests",
                                tooltip: "Select all guests on the map",
                                padding: { top: -2, left: -2, bottom: -2, right: -2 },
                                isPressed: twoway(model._allGuestsSelected),
                                onChange: (pressed) =>
                                {
                                    model._toggleAllGuests(pressed);
                                    pressed ? sideWindow.open() : sideWindow.close();
                                }
                            })
                        )
                    })
                ]),
                label({
                    text: "{BLACK}Manticore-007 © 2022-2025",
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
                                            case 0: model._peepSelection.set("guest"); break;
                                            case 1: model._peepSelection.set("staff"); break;
                                        }
                                    }
                            })
                        ]),
                    listview({
                        items: model._allGuestsSorted,
                        visibility: model._visibilityListviewWhenGuest,
                        canSelect: true,
                        onHighlight: (index) =>
                        {
                            const allGuests = model._allGuestEntities.get();
                            model._locate(allGuests[allGuests.map( e => {return e.name}).indexOf(model._allGuestsSorted.get()[index])])
                        },

                        onClick: (index) =>
                        {
                        const main = model._mainWindow.get();
                        const allGuests = model._allGuestEntities.get();
                        model._select(allGuests[allGuests.map( e => {return e.name}).indexOf(model._allGuestsSorted.get()[index])])
                        sideWindow.open();
                        if (main) main.tabIndex = 0;
                        }
                    }),
                    listview({
                        items: model._allStaffSorted,
                        visibility: model._visibilityListviewWhenStaff,
                        canSelect: true,
                        onHighlight: (index) =>
                        {
                            const allStaff = model._allStaffEntities.get();
                            model._locate(allStaff[allStaff.map( e => {return e.name}).indexOf(model._allStaffSorted.get()[index])])
                        },

                        onClick: (index) =>
                        {
                        const main = model._mainWindow.get();
                        const allStaff = model._allStaffEntities.get();
                        model._select(allStaff[allStaff.map( e => {return e.name}).indexOf(model._allStaffSorted.get()[index])])
                        if (main)
                        {
                        main.tabIndex = 0;
                        }
                        sideWindow.open()
                        }
                    })
                ]
            })
        ],
        onOpen: () =>
        {
            model._allGuestEntities.set(map.getAllEntities("guest"));
            model._allStaffEntities.set(map.getAllEntities("staff"));
            model._allGuestsSorted.set(model._peepsAlphabetized(model._allGuestEntities.get()))
            model._allStaffSorted.set(model._peepsAlphabetized(model._allStaffEntities.get()))
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
                            isChecked: model._stickySideWindow,
                            onChange: (checked) =>
                            {
                                model._stickySideWindow.set(checked);
                                setSticky(checked);
                            }
                        }),
                        checkbox({
                            text: "Pin to top in menu    {RED}(Requires reload of park)",
                            isChecked: model._pinToTop,
                            onChange: (checked) =>
                            {
                                model._pinToTop.set(checked);
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
                                selectedIndex: compute(model._theme, t => t === "rct1" ? 0 : 1),
                                onChange: (index) =>
                                {
                                    switch (index)
                                    {
                                        case 0:
                                        {
                                            setTheme("rct1");
                                            model._theme.set("rct1");
                                            console.log("theme set to rct1");
                                        }
                                            break;
                                        case 1:
                                        {
                                            setTheme("rct2");
                                            model._theme.set("rct2");
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
                                colour: model._mainWindowColour.primary,
                                onChange: (colour) =>
                                {
                                    model._mainWindowColour.primary.set(colour);
                                    setColour("pe.main.primary", colour);
                                }
                            }),
                            colourPicker({
                                colour: model._mainWindowColour.secondary,
                                onChange: (colour) =>
                                {
                                    model._mainWindowColour.secondary.set(colour);
                                    setColour("pe.main.secondary", colour);
                                }
                            }),
                        ]),
                        horizontal([
                            label({text: "Side window:"}),
                            colourPicker({
                                colour: model._sideWindowColour.primary,
                                onChange: (colour) =>
                                {
                                    model._sideWindowColour.primary.set(colour);
                                    setColour("pe.side.primary", colour);
                                }
                            }),
                            colourPicker({
                                colour: model._sideWindowColour.secondary,
                                onChange: (colour) =>
                                {
                                    model._sideWindowColour.secondary.set(colour);
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
                            onClick: () =>
                            {
                                const deepWater = Colour.AquaDark;
                                const brown = Colour.LightBrown;
                                model._mainWindowColour.primary.set(deepWater);
                                model._mainWindowColour.secondary.set(brown);
                                model._sideWindowColour.primary.set(deepWater);
                                model._sideWindowColour.secondary.set(brown);
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
        model._mainWindow.set(getWindow("Peep Editor"));
        model._open();
    },
    onClose: () =>
    {
        model._peepSelection.set("guest");
        ui.tool?.cancel();
        sideWindow.close();
        model._dispose();
    },
    onUpdate: () =>
    {
        const main = model._mainWindow.get();
        if (main)
        {
            main.colours = [ model._mainWindowColour.primary.get(), model._mainWindowColour.secondary.get(), model._mainWindowColour.tertiary.get() ]
        }
    },
});

function versionString(): string
{
    return isDevelopment ? `{BLACK}${pluginVersion} {BABYBLUE}[BETA]`: `{BLACK}${pluginVersion}`;
}

function buttonStyle(): WidgetCreator<FlexiblePosition>[] {
    const buttonSizeSmall = 14;
            return [
                button({	//red traffic light
                    width: buttonSizeSmall,
                    height: buttonSizeSmall,
                    image: compute(model._isFrozen, model._isStatic, (f, s) => f && s ? "rct1_close_on" : "rct1_close_off"),
                    tooltip: "Completely stop a peep from moving",
                    padding: { top: 0, right: -2, bottom: -2, left: 2 },
                    border: true,
                    disabled: model._disabledWhenNoPeepSelected,
                    visibility: compute(model._theme, t => t === "rct1" ? "visible" : "none"),
                    onClick: () => model._setMotion("frozen")
                }),
                button({	//yellow traffic light
                    width: buttonSizeSmall,
                    height: buttonSizeSmall,
                    image: compute(model._isFrozen, model._isStatic, (f, s) => !f && s ? "rct1_test_on" : "rct1_test_off"),
                    tooltip: "Stop a peep in place, animation still works",
                    padding: { top: -2, right: -2, bottom: -2, left: 2 },
                    border: true,
                    disabled: model._disabledWhenNoPeepSelected,
                    visibility: compute(model._theme, t => t === "rct1" ? "visible" : "none"),
                    onClick: () => model._setMotion("static")
                }),
                button({	//green traffic light
                    width: buttonSizeSmall,
                    height: buttonSizeSmall,
                    image: compute(model._isFrozen, model._isStatic, (f, s) => !f && !s ? "rct1_open_on" : "rct1_open_off"),
                    tooltip: "Let the peep roam freely around",
                    padding: { top: -2, right: -2, bottom: -2, left: 2 },
                    border: true,
                    disabled: model._disabledWhenNoPeepSelected,
                    visibility: compute(model._theme, t => t === "rct1" ? "visible" : "none"),
                    onClick: () => model._setMotion("moving")
                }),
                button({
                    image: compute(model._isFrozen, model._isStatic, (f, s) => flagButtonImage(f, s)),
                    width: buttonSize,
                    height: buttonSize,
                    padding: { top: 0, left: -2, bottom: -2, right: -2 },
                    disabled: model._disabledWhenNoPeepSelected,
                    visibility: compute(model._theme, t => t === "rct2" ? "visible" : "none"),
                    onClick: () =>
                    {
                        if (!model._isFrozen.get() && !model._isStatic.get()) {model._setMotion("frozen"); return;}
                        if (model._isFrozen.get() && model._isStatic.get()) {model._setMotion("static"); return;}
                        if (!model._isFrozen.get() && model._isStatic.get()) {model._setMotion("moving"); return;};
                    }
                }),
            ];
    }

    function flagButtonImage(f: boolean, s: boolean): IconName
    {
        if (f && s) return "closed";
        if (!f && s) return "testing";
        if (!f && !s) return "open";
        return "closed";
    }