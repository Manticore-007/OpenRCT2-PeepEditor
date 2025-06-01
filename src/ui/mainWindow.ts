import { button, checkbox, Colour, colourPicker, compute, dropdown, FlexiblePosition, groupbox, horizontal, label, listview, store, tab, tabwindow, toggle, twoway, vertical, viewport, WidgetCreator } from "openrct2-flexui";
import { model } from "../viewmodel/peepViewModel";
import { sideWindow, sideWindowColour } from "./sideWindow";
import { togglePeepPicker } from "../services/peepPicker";
import { isDevelopment, pluginVersion } from "../helpers/environment";
import { getWindow } from "../helpers/getWindow";
import { ProgressBarColour } from "../helpers/progressBar";
import { getColour, setColour, setMenuItem, setSticky, setTheme, Theme } from "../helpers/settings";
import { openWindowRemovePeep } from "./removePeepWindow";

let main: Window | undefined;

//button properties
const buttonSize = 24;
const lensIcon: ImageAnimation = { frameBase: context.getIcon("search"), frameCount: 1, frameDuration: 4, offset: { x: 4, y: 1 } };
const guestsIcon: ImageAnimation = { frameBase: 5568, frameCount: 8, frameDuration: 4 };
const infoIcon: ImageAnimation = { frameBase: 5367, frameCount: 8, frameDuration: 4 };
const gearIcon: ImageAnimation = { frameBase: 5201, frameCount: 4, frameDuration: 4 };

//setting values
const stickySideWindow = store<boolean>(context.sharedStorage.get("pe.sticky", true));
const pinToTop = store<boolean>(context.sharedStorage.get("pe.favourite", false));
const theme = store<Theme>(context.sharedStorage.get("pe.theme", "rct1"));

const mainWindowColour = {
    primary: store<Colour>(getColour("pe.main.primary", Colour.DarkYellow)),
    secondary: store<Colour>(getColour("pe.main.secondary", Colour.DarkYellow)),
    tertiary: store<Colour>(Colour.DarkYellow),
};

export const mainWindow = tabwindow({
    title: compute(model._name, n => n),
    width: 260,
    height: 230,
    colours: [mainWindowColour.primary.get(), mainWindowColour.secondary.get(), mainWindowColour.tertiary.get()],
    onOpen: () =>{
        main = getWindow("Peep Editor");
        model._open();
    },
    onClose: () =>
    {
        ui.tool?.cancel();
        sideWindow.close();
    },
    onUpdate: () =>
    {
        if (main)
        {
            main.colours = [ mainWindowColour.primary.get(), mainWindowColour.secondary.get(), mainWindowColour.tertiary.get() ]
        }
    },
    tabs: [
        tab({ //main tab
            image: lensIcon,
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
                                onClick: () => model._rename()
                            }),
                            button({	//locator
                                height: buttonSize, width: buttonSize,
                                image: "locate",
                                tooltip: "Focus the main viewport on the selected peep",
                                disabled: model._disabledWhenNoSinglePeepSelected,
                                padding: { top: -2, left: -2, bottom: -2, right: -2 },
                                onClick: () => model._locate()
                            }),
                            button({	//trashcan
                                height: buttonSize, width: buttonSize,
                                image: "demolish",
                                tooltip: "Remove the selected peep from existence",
                                disabled: model._disabledWhenNoSinglePeepSelected,
                                padding: { top: -2, left: -2, bottom: -2, right: -2 },
                                onClick: () => {
                                    const peep = model._selectedPeep.get();
                                    if (peep)
                                        openWindowRemovePeep(peep);
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
            image: guestsIcon,
            height: "inherit",
            content: [
                listview({
                    items: compute(model._allGuestEntities, a => a.map(guest => [guest.name, guest.animation])),

                    onClick: (index) =>
                        {
                            model._select(model._allGuestEntities.get()[index]);
                            if (main)
                            {
                            main.tabIndex = 0;
                            }
                            sideWindow.open()
                        }
                })
            ]
        }),
        tab({   //options
            image: gearIcon,
            height: "inherit",
            content: [
                groupbox({
                    text: "Options",
                    content: [
                        checkbox({
                            text: "Side window sticks to main window",
                            isChecked: stickySideWindow,
                            onChange: (checked) =>
                            {
                                stickySideWindow.set(checked);
                                setSticky(checked);
                            }
                        }),
                        checkbox({
                            text: "Pin to top in menu    {RED}(Requires reload of park)",
                            isChecked: pinToTop,
                            onChange: (checked) =>
                            {
                                pinToTop.set(checked);
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
                                colour: mainWindowColour.primary,
                                onChange: (colour) =>
                                {
                                    mainWindowColour.primary.set(colour);
                                    setColour("pe.main.primary", colour);
                                }
                            }),
                            colourPicker({
                                colour: mainWindowColour.secondary,
                                onChange: (colour) =>
                                {
                                    mainWindowColour.secondary.set(colour);
                                    setColour("pe.main.secondary", colour);
                                }
                            }),
                        ]),
                        horizontal([
                            label({text: "Side window:"}),
                            colourPicker({
                                colour: sideWindowColour.primary,
                                onChange: (colour) =>
                                {
                                    sideWindowColour.primary.set(colour);
                                    setColour("pe.side.primary", colour);
                                }
                            }),
                            colourPicker({
                                colour: sideWindowColour.secondary,
                                onChange: (colour) =>
                                {
                                    sideWindowColour.secondary.set(colour);
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
                                mainWindowColour.primary.set(deepWater);
                                mainWindowColour.secondary.set(brown);
                                sideWindowColour.primary.set(deepWater);
                                sideWindowColour.secondary.set(brown);
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
			image: infoIcon,
			content: [
				label({ text: "Peep Editor, a plugin for OpenRCT2", alignment: "centred", padding: [4, 0, 8, 0] }),
				horizontal([
					label({ text: "Version:" + "\n\nAuthor:" + "\n\nUI:" + "\n\nSpecial\nThanks:" + "\n\n", width: "25%" }),
					label({ text: versionString() + `\n\n{BLACK}Manticore-007` + `\n\n{BLACK}FlexUI by Basssiiie` + `\n\n{BLACK}Basssiiie, Gymnasiast, ItsSmitty\nSpacek531, AaronVanGeffen` + `\n{BLACK}Sadret, mrmagic2020, Isoitiro\nand Enox`})
				]),
				label({ text: "https://github.com/Manticore-007\n/OpenRCT2-PeepEditor", padding: ["90%", 0, 0, 0], alignment: "centred" })
			]
		}),
    ]
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
                    visibility: compute(theme, t => t === "rct1" ? "visible" : "none"),
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
                    visibility: compute(theme, t => t === "rct1" ? "visible" : "none"),
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
                    visibility: compute(theme, t => t === "rct1" ? "visible" : "none"),
                    onClick: () => model._setMotion("moving")
                }),
                button({
                    image: compute(model._isFrozen, model._isStatic, (f, s) => flagButtonImage(f, s)),
                    width: buttonSize,
                    height: buttonSize,
                    padding: { top: 0, left: -2, bottom: -2, right: -2 },
                    disabled: model._disabledWhenNoPeepSelected,
                    visibility: compute(theme, t => t === "rct2" ? "visible" : "none"),
                    onClick: () =>
                    {
                        if (!model._isFrozen.get() && !model._isStatic.get()) model._setMotion("frozen");
                        if (model._isFrozen.get() && model._isStatic.get()) model._setMotion("static");
                        if (!model._isFrozen.get() && model._isStatic.get()) model._setMotion("moving");
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