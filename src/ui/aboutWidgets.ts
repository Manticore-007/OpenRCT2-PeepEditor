import { margin, toolbarHeight, versionString, widgetLineHeight } from "../helpers/windowProperties";

const groupboxAbout: GroupBoxDesc = {
    type: "groupbox",
    name: "groupbox-about-version",
    x: margin,
    y: toolbarHeight + widgetLineHeight /2,
    height: widgetLineHeight * 2.5,
    width: 200 - margin * 2,
    text: "Version",
};

const labelAbout: LabelDesc = {
    type: "label",
    name: "label-about-version",
    x: margin,
    y: groupboxAbout.y + groupboxAbout.height/2.5,
    height: widgetLineHeight,
    width: 200 - margin * 2,
    text: versionString(),
    textAlign: "centred",
};

const labelPeepEditor: LabelDesc = {
    type: "label",
    name: "label-peep-editor",
    x: margin,
    y: groupboxAbout.y + groupboxAbout.height + margin,
    height: widgetLineHeight,
    width: 200 - margin * 2,
    text: "Peep Editor, a plugin for OpenRCT2",
    textAlign: "centred",
};

const customManticore: CustomDesc = {
    type: "custom",
    name: "custom-widget-manticore",
    x: margin * 3,
    y: 95,
    width: 128,
    height: 128,
    //onDraw: function (g) {drawTest(g, 5089 customImageFor("manticore"));},
};

const labelSpecialThanks: LabelDesc = {
    type: "label",
    name: "label-special-thanks-people",
    x: margin,
    y: 121,
    height: 200,
    width: 200 - margin*2,
    text: "Special thanks:\n Basssiiie\n ltsSmitty\n Gymnasiast\n Sadret\n Enox",
    textAlign: "centred",
};

const labelGitHub: LabelDesc = {
    type: "label",
    name: "label-github-page",
    x: margin,
    y: 185,
    height: widgetLineHeight,
    width: 200 - margin * 2,
    text: "https://github.com/Manticore-007/OpenRCT2-PeepEditor",
    textAlign: "centred",
};

export const aboutWidgets: WidgetDesc[] = [groupboxAbout, labelAbout, labelPeepEditor, customManticore, labelSpecialThanks, labelGitHub];