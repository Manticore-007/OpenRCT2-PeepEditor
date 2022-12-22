import {
    buttonSize,
    margin,
    toolbarHeight,
    widgetLineHeight,
    windowColour,
    windowWidth
} from "../../helpers/windowProperties";
import {setFlagExecuteArgs} from "../../game_actions/setFlags";
import {setColour} from "./widget_helpers";
import {refreshSelectedPeep, selectedPeep} from "./window";

export const propertiesWindowGuestWidgets = [
    <GroupBoxDesc>{
        type: "groupbox",
        name: "groupbox-attribute-colours",
        text: "Attribute colours",
        x: margin,
        y: margin + toolbarHeight,
        height: widgetLineHeight * 3,
        width: 200 - margin * 2,
    },
    <LabelDesc> {
        type: "label",
        name: "label-tshirt-colour",
        x: 9,
        y: margin + toolbarHeight + widgetLineHeight * 3 / 2.5 + 2,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `{INLINE_SPRITE}{217}{19}{0}{0}{SPRITE}`,
    },
    <ColourPickerDesc> {
        type: "colourpicker",
        name: "colourpicker-tshirt",
        x: 9 * 3,
        y: margin + toolbarHeight + widgetLineHeight * 3 / 2.5 + 2,
        height: widgetLineHeight,
        width: widgetLineHeight,
        colour: windowColour,
        onChange: (number) => setColour(number),
    },
    <LabelDesc> {
        type: "label",
        name: "label-trousers-colour",
        x: 9 * 5,
        y: margin + toolbarHeight + widgetLineHeight * 3 / 2.5 + 2,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `{INLINE_SPRITE}{253}{19}{0}{0}{SPRITE}`,
    },
    <ColourPickerDesc> {
        type: "colourpicker",
        name: "colourpicker-trousers",
        x: 9 * 7,
        y: margin + toolbarHeight + widgetLineHeight * 3 / 2.5 + 2,
        height: widgetLineHeight,
        width: widgetLineHeight,
        colour: windowColour,
        onChange: (number) => setColour(number),
    },
    <LabelDesc> {
        type: "label",
        name: "label-hat-colour",
        x: 9 * 9,
        y: margin + toolbarHeight + widgetLineHeight * 3 / 2.5 + 2,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `{INLINE_SPRITE}{215}{19}{0}{0}`,
    },
    <ColourPickerDesc> {
        type: "colourpicker",
        name: "colourpicker-hat",
        x: 9 * 11,
        y: margin + toolbarHeight + widgetLineHeight * 3 / 2.5 + 2,
        height: widgetLineHeight,
        width: widgetLineHeight,
        colour: windowColour,
        onChange: (number) => setColour(number),
    },
    <LabelDesc> {
        type: "label",
        name: "label-balloon-colour",
        x: 9 * 13,
        y: margin + toolbarHeight + widgetLineHeight * 3 / 2.5 + 2,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `{INLINE_SPRITE}{197}{19}{0}{0}`,
    },
    <ColourPickerDesc> {
        type: "colourpicker",
        name: "colourpicker-balloon",
        x: 9 * 15,
        y: margin + toolbarHeight + widgetLineHeight * 3 / 2.5 + 2,
        height: widgetLineHeight,
        width: widgetLineHeight,
        colour: windowColour,
        onChange: (number) => setColour(number),
    },
    <LabelDesc> {
        type: "label",
        name: "label-umbrella-colour",
        x: 9 * 17,
        y: margin + toolbarHeight + widgetLineHeight * 3 / 2.5 + 2,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `{INLINE_SPRITE}{201}{19}{0}{0}`,
    },
    <ColourPickerDesc> {
        type: "colourpicker",
        name: "colourpicker-umbrella",
        x: 9 * 19,
        y: margin + toolbarHeight + widgetLineHeight * 3 / 2.5 + 2,
        height: widgetLineHeight,
        width: widgetLineHeight,
        colour: windowColour,
        onChange: (number) => setColour(number),
    },
    <GroupBoxDesc>{
        type: "groupbox",
        name: "groupbox-flags",
        text: "Flags",
        x: margin,
        y: margin * 2 + toolbarHeight * 5 - 2,
        height: buttonSize * 7 - margin,
        width: 200 - margin * 2,
    },
    <CheckboxDesc> {
        type: "checkbox",
        name: "checkbox-leaving-park",
        x: 19,
        y: margin + toolbarHeight + widgetLineHeight * 4 + 1,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `Leaving park`,
        onChange: function (isChecked) {
            context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "leavingPark", isChecked));
        },
    },
    <CheckboxDesc> {
        type: "checkbox",
        name: "checkbox-slow-walk",
        x: 19,
        y: margin + toolbarHeight + widgetLineHeight * 5,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `Slow walk`,
        onChange: function (isChecked) {
            context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "slowWalk", isChecked));
        },
    },
    <CheckboxDesc> {
        type: "checkbox",
        name: "checkbox-tracking",
        x: 19,
        y: margin + toolbarHeight + widgetLineHeight * 6 -1,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `Tracking`,
        onChange: function (isChecked) {
            context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "tracking", isChecked));
        },
    },
    <CheckboxDesc> {
        type: "checkbox",
        name: "checkbox-waving",
        x: 19,
        y: margin + toolbarHeight + widgetLineHeight * 7 -2,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `Waving`,
        onChange: function (isChecked) {
            context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "waving", isChecked));
        },
    },
    <CheckboxDesc> {
        type: "checkbox",
        name: "checkbox-painting",
        x: 19,
        y: margin + toolbarHeight + widgetLineHeight * 8 -3,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `Painting`,
        onChange: function (isChecked) {
            context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "painting", isChecked));
        },
    },
    <CheckboxDesc> {
        type: "checkbox",
        name: "checkbox-photo",
        x: 19,
        y: margin + toolbarHeight + widgetLineHeight * 9 -4,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `Photo`,
        onChange: function (isChecked) {
            context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "photo", isChecked));
            refreshSelectedPeep();
        },
    },
    <CheckboxDesc> {
        type: "checkbox",
        name: "checkbox-wow",
        x: 19,
        y: margin + toolbarHeight + widgetLineHeight * 10 -5,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `Wow!`,
        onChange: function (isChecked) {
            context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "wow", isChecked));
        },
    },
    <CheckboxDesc> {
        type: "checkbox",
        name: "checkbox-litter",
        x: 19,
        y: margin + toolbarHeight + widgetLineHeight * 11 -6,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `Litter`,
        onChange: function (isChecked) {
            context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "litter", isChecked));
        },
    },
    <CheckboxDesc> {
        type: "checkbox",
        name: "checkbox-lost",
        x: 19,
        y: margin + toolbarHeight + widgetLineHeight * 12 -7,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `Lost`,
        onChange: function (isChecked) {
            context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "lost", isChecked));
        },
    },
    <CheckboxDesc> {
        type: "checkbox",
        name: "checkbox-hunger",
        x: 19,
        y: margin + toolbarHeight + widgetLineHeight * 13 -8,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `Hunger`,
        onChange: function (isChecked) {
            context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "hunger", isChecked));
        },
    },
    <CheckboxDesc> {
        type: "checkbox",
        name: "checkbox-here-we-are",
        x: 19,
        y: margin + toolbarHeight + widgetLineHeight * 14 -9,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `Here we are`,
        onChange: function (isChecked) {
            context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "hereWeAre", isChecked));
        },
    },
    <CheckboxDesc> {
        type: "checkbox",
        name: "checkbox-toilet",
        x: 110,
        y: margin + toolbarHeight + widgetLineHeight * 4 +1,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `Toilet`,
        onChange: function (isChecked) {
            context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "toilet", isChecked));
        },
    },
    <CheckboxDesc> {
        type: "checkbox",
        name: "checkbox-crowded",
        x: 110,
        y: margin + toolbarHeight + widgetLineHeight * 5,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `Crowded`,
        onChange: function (isChecked) {
            context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "crowded", isChecked));
        },
    },
    <CheckboxDesc> {
        type: "checkbox",
        name: "checkbox-happiness",
        x: 110,
        y: margin + toolbarHeight + widgetLineHeight * 6 -1,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `Happiness`,
        onChange: function (isChecked) {
            context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "happiness", isChecked));
        },
    },
    <CheckboxDesc> {
        type: "checkbox",
        name: "checkbox-nausea",
        x: 110,
        y: margin + toolbarHeight + widgetLineHeight * 7 -2,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `Nausea`,
        onChange: function (isChecked) {
            context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "nausea", isChecked));
        },
    },
    <CheckboxDesc> {
        type: "checkbox",
        name: "checkbox-purple",
        x: 110,
        y: margin + toolbarHeight + widgetLineHeight * 8 -3,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `Purple`,
        onChange: function (isChecked) {
            context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "purple", isChecked));
        },
    },
    <CheckboxDesc> {
        type: "checkbox",
        name: "checkbox-pizza",
        x: 110,
        y: margin + toolbarHeight + widgetLineHeight * 9 -4,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `Pizza`,
        onChange: function (isChecked) {
            context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "pizza", isChecked));
        },
    },
    <CheckboxDesc> {
        type: "checkbox",
        name: "checkbox-explode",
        x: 110,
        y: margin + toolbarHeight + widgetLineHeight * 10 -5,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `Explode`,
        onChange: function (isChecked) {
            context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "explode", isChecked));
        },
    },
    <CheckboxDesc> {
        type: "checkbox",
        name: "checkbox-contagious",
        x: 110,
        y: margin + toolbarHeight + widgetLineHeight * 11 -6,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `Contagious`,
        onChange: function (isChecked) {
            context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "contagious", isChecked));
        },
    },
    <CheckboxDesc> {
        type: "checkbox",
        name: "checkbox-joy",
        x: 110,
        y: margin + toolbarHeight + widgetLineHeight * 12 -7,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `Joy`,
        onChange: function (isChecked) {
            context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "joy", isChecked));
        },
    },
    <CheckboxDesc> {
        type: "checkbox",
        name: "checkbox-angry",
        x: 110,
        y: margin + toolbarHeight + widgetLineHeight * 13 -8,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `Angry`,
        onChange: function (isChecked) {
            context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "angry", isChecked));
        },
    },
    <CheckboxDesc> {
        type: "checkbox",
        name: "checkbox-ice-cream",
        x: 110,
        y: margin + toolbarHeight + widgetLineHeight * 14 -9,
        height: widgetLineHeight,
        width: windowWidth - margin * 2,
        text: `Ice cream`,
        onChange: function (isChecked) {
            context.executeAction("pe_setflag", setFlagExecuteArgs(<Guest>selectedPeep, "iceCream", isChecked));
        },
    },
];
