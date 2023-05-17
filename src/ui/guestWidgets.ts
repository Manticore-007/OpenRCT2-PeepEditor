import { colour } from "../enums/colours";
import { setGuestColourExecuteArgs } from "../gameActions/guestSetColours";
import { setFlagExecuteArgs } from "../gameActions/guestSetFlags";
import { customImageFor } from "../helpers/customImages";
import { selectedPeep } from "../helpers/selectedPeep";
import { btnSize, margin, toolbarHeight, widgetLineHeight, windowColour, windowWidth } from "../helpers/windowProperties";

const grpBoxAttColours: GroupBoxDesc = {
    type: "groupbox",
    name: "groupbox-attribute-colours",
    text: "Attribute colours",
    x: margin,
    y: toolbarHeight + widgetLineHeight /2,
    height: widgetLineHeight * 2.5,
    width: 200 - margin * 2,
};

const customTshirt: CustomDesc = {
    type: "custom",
    name: "custom-widget-tshirt",
    x: 9,
    y: grpBoxAttColours.height /2 + widgetLineHeight,
    width: 16,
    height: 16,
    onDraw: function (g) {drawImage(g, 5081, "tshirtColour");},
};

const clrPickerTshirt: ColourPickerDesc = {
    type: "colourpicker",
    name: "colourpicker-tshirt",
    x: 9 * 3,
    y: grpBoxAttColours.height /2 + widgetLineHeight,
    height: widgetLineHeight,
    width: widgetLineHeight,
    colour: windowColour,
    onChange: function (colour) {
        context.executeAction("pe_setguestcolour", setGuestColourExecuteArgs(<Guest>selectedPeep, "tshirtColour", colour));
    }
};

const customTrousers: CustomDesc = {
    type: "custom",
    name: "custom-widget-trousers",
    x: (9 * 5),
    y: grpBoxAttColours.height /2 + widgetLineHeight -2,
    width: 16,
    height: 16,
    onDraw: function (g) {drawImage(g, customImageFor("trousers"), "trousersColour");},
};

const clrPickerTrousers: ColourPickerDesc = {
    type: "colourpicker",
    name: "colourpicker-trousers",
    x: 9 * 7,
    y: grpBoxAttColours.height /2 + widgetLineHeight,
    height: widgetLineHeight,
    width: widgetLineHeight,
    colour: windowColour,
    onChange: function (colour) {
        context.executeAction("pe_setguestcolour", setGuestColourExecuteArgs(<Guest>selectedPeep, "trousersColour", colour));
    }
};

const customHat: CustomDesc = {
    type: "custom",
    name: "custom-widget-hat",
    x: 9 * 9,
    y: grpBoxAttColours.height /2 + widgetLineHeight,
    width: 16,
    height: 16,
    onDraw: function (g) {drawImage(g, 5079, "hatColour");},
};

const clrPickerHat: ColourPickerDesc = {
    type: "colourpicker",
    name: "colourpicker-hat",
    x: 9 * 11,
    y: grpBoxAttColours.height /2 + widgetLineHeight,
    height: widgetLineHeight,
    width: widgetLineHeight,
    colour: windowColour,
    onChange: function (colour) {
        context.executeAction("pe_setguestcolour", setGuestColourExecuteArgs(<Guest>selectedPeep, "hatColour", colour));
    }
};

const customBalloon: CustomDesc = {
    type: "custom",
    name: "custom-widget-balloon",
    x: 9 * 13,
    y: grpBoxAttColours.height /2 + widgetLineHeight,
    width: 16,
    height: 16,
    onDraw: function (g) {drawImage(g, 5061, "balloonColour");},
};

const clrPickerBalloon: ColourPickerDesc = {
    type: "colourpicker",
    name: "colourpicker-balloon",
    x: 9 * 15,
    y: grpBoxAttColours.height /2 + widgetLineHeight,
    height: widgetLineHeight,
    width: widgetLineHeight,
    colour: windowColour,
    onChange: function (colour) {
        context.executeAction("pe_setguestcolour", setGuestColourExecuteArgs(<Guest>selectedPeep, "balloonColour", colour));
    }
};

const customUmbrella: CustomDesc = {
    type: "custom",
    name: "custom-widget-umbrella",
    x: 9 * 17,
    y: grpBoxAttColours.height /2 + widgetLineHeight,
    width: 16,
    height: 16,
    onDraw: function (g) {drawImage(g, 5065, "umbrellaColour");},
};

const clrPickerUmbrella: ColourPickerDesc = {
    type: "colourpicker",
    name: "colourpicker-umbrella",
    x: 9 * 19,
    y: grpBoxAttColours.height /2 + widgetLineHeight,
    height: widgetLineHeight,
    width: widgetLineHeight,
    colour: windowColour,
    onChange: function (colour) {
        context.executeAction("pe_setguestcolour", setGuestColourExecuteArgs(<Guest>selectedPeep, "umbrellaColour", colour));
    }
};

const grpBoxFlags: GroupBoxDesc = {
    type: "groupbox",
    name: "groupbox-flags",
    text: "Flags",
    x: margin,
    y: grpBoxAttColours.y + grpBoxAttColours.height,
    height: btnSize * 6.75 - 2,
    width: 200 - margin * 2,
};

const chkBoxLeavingPark: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-leaving-park",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 3.5,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Leaving park`,
    onChange: function (isChecked) {
        context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "leavingPark", isChecked));
    },
};

const chkBoxSlowWalk: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-slow-walk",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 4.5 - 1,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Slow walk`,
    onChange: function (isChecked) {
        context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "slowWalk", isChecked));
    },
};

const chkBoxTracking: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-tracking",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 5.5 - 2,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Tracking`,
    onChange: function (isChecked) {
        context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "tracking", isChecked));
    },
};

const chkBoxWaving: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-waving",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 6.5 - 3,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Waving`,
    onChange: function (isChecked) {
        context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "waving", isChecked));
    },
};

const chkBoxPainting: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-painting",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 7.5 - 4,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Painting`,
    onChange: function (isChecked) {
        context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "painting", isChecked));
    },
};

const chkBoxPhoto: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-photo",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 8.5 - 5,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Photo`,
    onChange: function (isChecked) {
        context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "photo", isChecked));
    },
};

const chkBoxWow: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-wow",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 9.5 - 6,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Wow!`,
    onChange: function (isChecked) {
        context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "wow", isChecked));
    },
};

const chkBoxLitter: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-litter",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 10.5 - 7,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Litter`,
    onChange: function (isChecked) {
        context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "litter", isChecked));
    },
};

const chkBoxLost: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-lost",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 11.5 - 8,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Lost`,
    onChange: function (isChecked) {
        context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "lost", isChecked));
    },
};

const chkBoxHunger: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-hunger",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 12.5 - 9,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Hunger`,
    onChange: function (isChecked) {
        context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "hunger", isChecked));
    },
};

const chkBoxHereWeAre: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-here-we-are",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 13.5 - 10,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Here we are`,
    onChange: function (isChecked) {
        context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "hereWeAre", isChecked));
    },
};

const chkBoxToilet: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-toilet",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 3.5,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Toilet`,
    onChange: function (isChecked) {
        context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "toilet", isChecked));
    },
};

const chkBoxCrowded: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-crowded",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 4.5 - 1,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Crowded`,
    onChange: function (isChecked) {
        context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "crowded", isChecked));
    },
};

const chkBoxHappiness: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-happiness",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 5.5 - 2,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Happiness`,
    onChange: function (isChecked) {
        context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "happiness", isChecked));
    },
};

const chkBoxNausea: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-nausea",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 6.5 - 3,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Nausea`,
    onChange: function (isChecked) {
        context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "nausea", isChecked));
    },
};

const chkBoxPurple: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-purple",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 7.5 - 4,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Purple`,
    onChange: function (isChecked) {
        context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "purple", isChecked));
    },
};

const chkBoxPizza: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-pizza",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 8.5 - 5,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Pizza`,
    onChange: function (isChecked) {
        context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "pizza", isChecked));
    },
};

const chkBoxExplode: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-explode",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 9.5 - 6,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Explode`,
    onChange: function (isChecked) {
        context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "explode", isChecked));
    },
};

const chkBoxContagious: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-contagious",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 10.5 - 7,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Contagious`,
    onChange: function (isChecked) {
        context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "contagious", isChecked));
    },
};

const chkBoxJoy: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-joy",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 11.5 - 8,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Joy`,
    onChange: function (isChecked) {
        context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "joy", isChecked));
    },
};

const chkBoxAngry: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-angry",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 12.5 - 9,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Angry`,
    onChange: function (isChecked) {
        context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "angry", isChecked));
    },
};

const chkBoxIceCream: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-ice-cream",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 13.5 - 10,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Ice cream`,
    onChange: function (isChecked) {
        context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "iceCream", isChecked));
    },
};

export const guestWidgets: WidgetBaseDesc[] = [
    grpBoxAttColours,
    customTshirt,
    clrPickerTshirt,
    customTrousers,
    clrPickerTrousers,
    customHat,
    clrPickerHat,
    customBalloon,
    clrPickerBalloon,
    customUmbrella,
    clrPickerUmbrella,
    grpBoxFlags,
    chkBoxLeavingPark,
    chkBoxSlowWalk,
    chkBoxTracking,
    chkBoxWaving,
    chkBoxPainting,
    chkBoxPhoto,
    chkBoxWow,
    chkBoxLitter,
    chkBoxLost,
    chkBoxHunger,
    chkBoxHereWeAre,
    chkBoxToilet,
    chkBoxCrowded,
    chkBoxHappiness,
    chkBoxNausea,
    chkBoxPurple,
    chkBoxPizza,
    chkBoxExplode,
    chkBoxContagious,
    chkBoxJoy,
    chkBoxAngry,
    chkBoxIceCream,

];

function drawImage(g: GraphicsContext, image: number, property?: keyof Guest): void
{
    const img = g.getImage(image);
    const guest = <Guest>selectedPeep;
    if (property === "tshirtColour" || property === "trousersColour" || property === "hatColour" || property === "umbrellaColour" || property === "balloonColour")
    {
        const colour = guest[property];
        if (img) {
            g.paletteId = colour;
            g.image(img.id, 0, 0);
        }
    }
    else    
    if (img) {
        g.paletteId = colour["Pastel Orange"];
        g.image(img.id, 0, 0);
    }
}