import { setGuestColourExecuteArgs } from "../gameActions/guestSetColours";
import { setFlagExecuteArgs } from "../gameActions/guestSetFlags";
import { customImageFor } from "../helpers/customImages";
import { btnSize, margin, toolbarHeight, widgetLineHeight, windowColour, windowWidth } from "../helpers/windowProperties";

let tshirtColour: number = 18;
let trousersColour: number = 18;
let hatColour: number = 18;
let balloonColour: number = 18;
let umbrellaColour: number = 18;

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
    onDraw: function (g) {drawImage(g, 5081, tshirtColour);},
};

const clrPickerTshirt: ColourPickerDesc = {
    type: "colourpicker",
    name: "colourpicker-tshirt",
    x: 9 * 3,
    y: grpBoxAttColours.height /2 + widgetLineHeight,
    height: widgetLineHeight,
    width: widgetLineHeight,
    colour: windowColour,
    onChange: (number) => {
        tshirtColour = number;
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach(guest =>
            context.executeAction("pe_setguestcolour", setGuestColourExecuteArgs(guest, "tshirtColour", number)),
        );
    }
};

const customTrousers: CustomDesc = {
    type: "custom",
    name: "custom-widget-trousers",
    x: (9 * 5),
    y: grpBoxAttColours.height /2 + widgetLineHeight -2,
    width: 16,
    height: 16,
    onDraw: function (g) {drawImage(g, customImageFor("trousers"), trousersColour);},
};

const clrPickerTrousers: ColourPickerDesc = {
    type: "colourpicker",
    name: "colourpicker-trousers",
    x: 9 * 7,
    y: grpBoxAttColours.height /2 + widgetLineHeight,
    height: widgetLineHeight,
    width: widgetLineHeight,
    colour: windowColour,
    onChange: (number) => {
        trousersColour = number;
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach(guest =>
            context.executeAction("pe_setguestcolour", setGuestColourExecuteArgs(guest, "trousersColour", number)),
        );
    }
};

const customHat: CustomDesc = {
    type: "custom",
    name: "custom-widget-hat",
    x: 9 * 9,
    y: grpBoxAttColours.height /2 + widgetLineHeight,
    width: 16,
    height: 16,
    onDraw: function (g) {drawImage(g, 5079, hatColour);},
};

const clrPickerHat: ColourPickerDesc = {
    type: "colourpicker",
    name: "colourpicker-hat",
    x: 9 * 11,
    y: grpBoxAttColours.height /2 + widgetLineHeight,
    height: widgetLineHeight,
    width: widgetLineHeight,
    colour: windowColour,
    onChange: (number) => {
        hatColour = number;
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach(guest =>
            context.executeAction("pe_setguestcolour", setGuestColourExecuteArgs(guest, "hatColour", number)),
        );
    }
};

const customBalloon: CustomDesc = {
    type: "custom",
    name: "custom-widget-balloon",
    x: 9 * 13,
    y: grpBoxAttColours.height /2 + widgetLineHeight,
    width: 16,
    height: 16,
    onDraw: function (g) {drawImage(g, 5061, balloonColour);},
};

const clrPickerBalloon: ColourPickerDesc = {
    type: "colourpicker",
    name: "colourpicker-balloon",
    x: 9 * 15,
    y: grpBoxAttColours.height /2 + widgetLineHeight,
    height: widgetLineHeight,
    width: widgetLineHeight,
    colour: windowColour,
    onChange: (number) => {
        balloonColour = number;
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach(guest =>
            context.executeAction("pe_setguestcolour", setGuestColourExecuteArgs(guest, "balloonColour", number)),
        );
    }
};

const customUmbrella: CustomDesc = {
    type: "custom",
    name: "custom-widget-umbrella",
    x: 9 * 17,
    y: grpBoxAttColours.height /2 + widgetLineHeight,
    width: 16,
    height: 16,
    onDraw: function (g) {drawImage(g, 5065, umbrellaColour);},
};

const clrPickerUmbrella: ColourPickerDesc = {
    type: "colourpicker",
    name: "colourpicker-umbrella",
    x: 9 * 19,
    y: grpBoxAttColours.height /2 + widgetLineHeight,
    height: widgetLineHeight,
    width: widgetLineHeight,
    colour: windowColour,
    onChange: (number) => {
        umbrellaColour = number;
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach(guest =>
            context.executeAction("pe_setguestcolour", setGuestColourExecuteArgs(guest, "umbrellaColour", number)),
        );
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
    onChange: (value) => {
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach( guest => {
            context.executeAction("pe_setflag", setFlagExecuteArgs(guest, "leavingPark", value));
        });
    }
};

const chkBoxSlowWalk: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-slow-walk",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 4.5 - 1,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Slow walk`,
    onChange: (value) => {
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach( guest => {
            context.executeAction("pe_setflag", setFlagExecuteArgs(guest, "slowWalk", value));
        });
    }
};

const chkBoxTracking: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-tracking",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 5.5 - 2,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Tracking`,
    onChange: (value) => {
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach( guest => {
            context.executeAction("pe_setflag", setFlagExecuteArgs(guest, "tracking", value));
        });
    }
};

const chkBoxWaving: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-waving",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 6.5 - 3,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Waving`,
    onChange: (value) => {
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach( guest => {
            context.executeAction("pe_setflag", setFlagExecuteArgs(guest, "waving", value));
        });
    }
};

const chkBoxPainting: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-painting",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 7.5 - 4,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Painting`,
    onChange: (value) => {
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach( guest => {
            context.executeAction("pe_setflag", setFlagExecuteArgs(guest, "painting", value));
        });
    }
};

const chkBoxPhoto: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-photo",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 8.5 - 5,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Photo`,
    onChange: (value) => {
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach( guest => {
            context.executeAction("pe_setflag", setFlagExecuteArgs(guest, "photo", value));
        });
    }
};

const chkBoxWow: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-wow",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 9.5 - 6,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Wow!`,
    onChange: (value) => {
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach( guest => {
            context.executeAction("pe_setflag", setFlagExecuteArgs(guest, "wow", value));
        });
    }
};

const chkBoxLitter: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-litter",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 10.5 - 7,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Litter`,
    onChange: (value) => {
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach( guest => {
            context.executeAction("pe_setflag", setFlagExecuteArgs(guest, "litter", value));
        });
    }
};

const chkBoxLost: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-lost",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 11.5 - 8,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Lost`,
    onChange: (value) => {
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach( guest => {
            context.executeAction("pe_setflag", setFlagExecuteArgs(guest, "lost", value));
        });
    }
};

const chkBoxHunger: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-hunger",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 12.5 - 9,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Hunger`,
    onChange: (value) => {
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach( guest => {
            context.executeAction("pe_setflag", setFlagExecuteArgs(guest, "hunger", value));
        });
    }
};

const chkBoxHereWeAre: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-here-we-are",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 13.5 - 10,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Here we are`,
    onChange: (value) => {
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach( guest => {
            context.executeAction("pe_setflag", setFlagExecuteArgs(guest, "hereWeAre", value));
        });
    }
};

const chkBoxToilet: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-toilet",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 3.5,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Toilet`,
    onChange: (value) => {
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach( guest => {
            context.executeAction("pe_setflag", setFlagExecuteArgs(guest, "toilet", value));
        });
    }
};

const chkBoxCrowded: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-crowded",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 4.5 - 1,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Crowded`,
    onChange: (value) => {
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach( guest => {
            context.executeAction("pe_setflag", setFlagExecuteArgs(guest, "crowded", value));
        });
    }
};

const chkBoxHappiness: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-happiness",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 5.5 - 2,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Happiness`,
    onChange: (value) => {
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach( guest => {
            context.executeAction("pe_setflag", setFlagExecuteArgs(guest, "happiness", value));
        });
    }
};

const chkBoxNausea: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-nausea",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 6.5 - 3,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Nausea`,
    onChange: (value) => {
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach( guest => {
            context.executeAction("pe_setflag", setFlagExecuteArgs(guest, "nausea", value));
        });
    }
};

const chkBoxPurple: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-purple",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 7.5 - 4,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Purple`,
    onChange: (value) => {
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach( guest => {
            context.executeAction("pe_setflag", setFlagExecuteArgs(guest, "purple", value));
        });
    }
};

const chkBoxPizza: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-pizza",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 8.5 - 5,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Pizza`,
    onChange: (value) => {
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach( guest => {
            context.executeAction("pe_setflag", setFlagExecuteArgs(guest, "pizza", value));
        });
    }
};

const chkBoxExplode: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-explode",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 9.5 - 6,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Explode`,
    onChange: (value) => {
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach( guest => {
            context.executeAction("pe_setflag", setFlagExecuteArgs(guest, "explode", value));
        });
    }
};

const chkBoxContagious: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-contagious",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 10.5 - 7,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Contagious`,
    onChange: (value) => {
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach( guest => {
            context.executeAction("pe_setflag", setFlagExecuteArgs(guest, "contagious", value));
        });
    }
};

const chkBoxJoy: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-joy",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 11.5 - 8,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Joy`,
    onChange: (value) => {
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach( guest => {
            context.executeAction("pe_setflag", setFlagExecuteArgs(guest, "joy", value));
        });
    }
};

const chkBoxAngry: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-angry",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 12.5 - 9,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Angry`,
    onChange: (value) => {
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach( guest => {
            context.executeAction("pe_setflag", setFlagExecuteArgs(guest, "angry", value));
        });
    }
};

const chkBoxIceCream: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-ice-cream",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 13.5 - 10,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Ice cream`,
    onChange: (value) => {
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach( guest => {
            context.executeAction("pe_setflag", setFlagExecuteArgs(guest, "iceCream", value));
        });
    }
};

export const AllGuestWidgets: WidgetBaseDesc[] = [
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

function drawImage(g: GraphicsContext, image: number, colour: number): void
{
    const img = g.getImage(image);
    if (img) {
        g.paletteId = colour;
        g.image(img.id, 0, 0);
    }
}

export function resetColours(): void
{
    tshirtColour = 18;
    trousersColour = 18;
    hatColour = 18;
    balloonColour = 18;
    umbrellaColour = 18;
}