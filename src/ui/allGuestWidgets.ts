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
    onChange: (number) => changeColour(number, "tshirtColour"),
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
    onChange: (number) => changeColour(number, "trousersColour"),
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
    onChange: (number) => changeColour(number, "hatColour"),
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
    onChange: (number) => changeColour(number, "balloonColour"),
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
    onChange: (number) => changeColour(number, "umbrellaColour"),
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
    onChange: (value) => toggleFlag(value, "leavingPark")
};

const chkBoxSlowWalk: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-slow-walk",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 4.5 - 1,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Slow walk`,
    onChange: (value) => toggleFlag(value, "slowWalk")
};

const chkBoxTracking: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-tracking",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 5.5 - 2,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Tracking`,
    onChange: (value) => toggleFlag(value, "tracking")
};

const chkBoxWaving: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-waving",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 6.5 - 3,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Waving`,
    onChange: (value) => toggleFlag(value, "waving")
};

const chkBoxPainting: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-painting",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 7.5 - 4,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Painting`,
    onChange: (value) => toggleFlag(value, "painting")
};

const chkBoxPhoto: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-photo",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 8.5 - 5,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Photo`,
    onChange: (value) => toggleFlag(value, "photo")
};

const chkBoxWow: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-wow",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 9.5 - 6,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Wow!`,
    onChange: (value) => toggleFlag(value, "wow")
};

const chkBoxLitter: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-litter",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 10.5 - 7,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Litter`,
    onChange: (value) => toggleFlag(value, "litter")
};

const chkBoxLost: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-lost",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 11.5 - 8,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Lost`,
    onChange: (value) => toggleFlag(value, "lost")
};

const chkBoxHunger: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-hunger",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 12.5 - 9,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Hunger`,
    onChange: (value) => toggleFlag(value, "hunger")
};

const chkBoxHereWeAre: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-here-we-are",
    x: 19,
    y: margin + toolbarHeight + widgetLineHeight * 13.5 - 10,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Here we are`,
    onChange: (value) => toggleFlag(value, "hereWeAre")
};

const chkBoxToilet: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-toilet",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 3.5,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Toilet`,
    onChange: (value) => toggleFlag(value, "toilet")
};

const chkBoxCrowded: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-crowded",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 4.5 - 1,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Crowded`,
    onChange: (value) => toggleFlag(value, "crowded")
};

const chkBoxHappiness: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-happiness",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 5.5 - 2,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Happiness`,
    onChange: (value) => toggleFlag(value, "happiness")
};

const chkBoxNausea: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-nausea",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 6.5 - 3,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Nausea`,
    onChange: (value) => toggleFlag(value, "nausea")
};

const chkBoxPurple: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-purple",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 7.5 - 4,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Purple`,
    onChange: (value) => toggleFlag(value, "purple")
};

const chkBoxPizza: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-pizza",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 8.5 - 5,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Pizza`,
    onChange: (value) => toggleFlag(value, "pizza")
};

const chkBoxExplode: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-explode",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 9.5 - 6,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Explode`,
    onChange: (value) => toggleFlag(value, "explode")
};

const chkBoxContagious: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-contagious",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 10.5 - 7,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Contagious`,
    onChange: (value) => toggleFlag(value, "contagious")
};

const chkBoxJoy: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-joy",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 11.5 - 8,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Joy`,
    onChange: (value) => toggleFlag(value, "joy")
};

const chkBoxAngry: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-angry",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 12.5 - 9,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Angry`,
    onChange: (value) => toggleFlag(value, "angry")
};

const chkBoxIceCream: CheckboxDesc = {
    type: "checkbox",
    name: "checkbox-ice-cream",
    x: 110,
    y: margin + toolbarHeight + widgetLineHeight * 13.5 - 10,
    height: widgetLineHeight,
    width: windowWidth - margin * 2,
    text: `Ice cream`,
    onChange: (value) => toggleFlag(value, "iceCream")
}

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

function changeColour(colour: number, attribute: keyof Guest): void
{
    if (attribute === "tshirtColour" || attribute === "trousersColour" || attribute === "hatColour" || attribute === "balloonColour" || attribute === "umbrellaColour") {
        const allGuests = map.getAllEntities("guest");
        allGuests.forEach(guest => {
            guest[attribute] = colour
            switch (attribute)
            {
                case "tshirtColour":
                    return tshirtColour = colour
                case "trousersColour":
                    return trousersColour = colour
                case "hatColour":
                    return hatColour = colour
                case "balloonColour":
                    return balloonColour = colour
                case "umbrellaColour":
                    return umbrellaColour = colour
            }
        });
    }
}

function toggleFlag(value: boolean, flag: PeepFlags): void
{
    const allGuests = map.getAllEntities("guest");
    allGuests.forEach( guest => {
        guest.setFlag(flag, value);
    });
}

export function resetColours(): void
{
    tshirtColour = 18;
    trousersColour = 18;
    hatColour = 18;
    balloonColour = 18;
    umbrellaColour = 18;
}