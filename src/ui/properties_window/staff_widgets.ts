import {groupboxName, margin, toolbarHeight, widgetLineHeight, windowColour} from "../../helpers/windowProperties";
import {staffTypeList} from "../../helpers/staffTypes";
import {costume, costumeList} from "../../helpers/costumes";
import {setColour} from "./widget_helpers";
import {debug} from "../../helpers/logger";

import {changeSpinner, peepPropertiesWindow, selectedPeep, setStaffType} from "./window";

export const propertiesWindowStaffWidgets = [
    <GroupBoxDesc>{
        type: "groupbox",
        name: "groupbox-uniform-colour",
        text: "Colour",
        x: margin,
        y: margin + toolbarHeight,
        height: widgetLineHeight * 3,
        width: 200 - margin * 2,
    },
    <ColourPickerDesc> {
        type: "colourpicker",
        name: "colourpicker-staff",
        x: 200 - margin - widgetLineHeight * 2,
        y: margin + toolbarHeight + widgetLineHeight * 3 / 2.5 + 2,
        height: widgetLineHeight,
        width: widgetLineHeight,
        colour: windowColour,
        onChange: (number) => setColour(number),
    },
    <GroupBoxDesc>{
        type: "groupbox",
        name: "groupbox-appearance",
        text: "Appearance",
        x: margin,
        y: margin * 2 + toolbarHeight * 5 - 2,
        height: widgetLineHeight * 5,
        width: 200 - margin * 2,
    },
    <LabelDesc> {
        type: "label",
        name: "label-staff-type",
        x: margin + toolbarHeight,
        y: margin * 2 + toolbarHeight * 7 -2,
        height: widgetLineHeight,
        width: groupboxName.width - margin * 2,
        text: "Type: ",
    },
    <DropdownDesc> {
        type: "dropdown",
        name: "dropdown-staff-type",
        x: margin + 80,
        y: margin * 2 + toolbarHeight * 7 -2,
        height: widgetLineHeight,
        width: 95,
        items: staffTypeList,
        selectedIndex: -1,
        onChange: (number: number) => setStaffType(number),
    },
    <LabelDesc> {
        type: "label",
        name: "label-costume",
        x: margin + toolbarHeight,
        y: margin * 2 + toolbarHeight * 9 -2,
        height: widgetLineHeight,
        width: groupboxName.width - margin * 2,
        text: "Costume: ",
    },
    <DropdownDesc> {
        type: "dropdown",
        name: "dropdown-costume",
        x: margin + 80,
        y: margin * 2 + toolbarHeight * 9 -2,
        height: widgetLineHeight,
        width: 95,
        items: costumeList,
        selectedIndex: -1,
        onChange: (number) => setCostume(number),
    },
    <GroupBoxDesc>{
        type: "groupbox",
        name: "groupbox-coordinates",
        text: "Coordinates",
        x: margin,
        y: margin * 2 + toolbarHeight * 5 + widgetLineHeight * 5 - 1,
        height: widgetLineHeight * 6.5,
        width: 200 - margin * 2,
    },
    <LabelDesc>{
        type: "label",
        name: "label-x-position",
        x: margin + toolbarHeight,
        y: margin * 2 + toolbarHeight * 5 + widgetLineHeight * 6.5 - 2,
        height: widgetLineHeight,
        width: groupboxName.width - margin * 2,
        text: "X position: ",
    },
    <SpinnerDesc>{
        type: "spinner",
        name: "spinner-x-position",
        x: margin + 80,
        y: margin * 2 + toolbarHeight * 5 + widgetLineHeight * 6.5 - 2,
        height: widgetLineHeight,
        width: 95,
        text: ` `,
        onIncrement: () => changeSpinner(ui.getWindow(peepPropertiesWindow).findWidget<SpinnerWidget>("spinner-x-position"), "x", + 1),
        onDecrement: () => changeSpinner(ui.getWindow(peepPropertiesWindow).findWidget<SpinnerWidget>("spinner-x-position"), "x", - 1),
    },
    <LabelDesc>{
        type: "label",
        name: "label-y-position",
        x: margin + toolbarHeight,
        y: margin * 2 + toolbarHeight * 5 + widgetLineHeight * 8 - 2,
        height: widgetLineHeight,
        width: groupboxName.width - margin * 2,
        text: "Y position: ",
    },
    <SpinnerDesc>{
        type: "spinner",
        name: "spinner-y-position",
        x: margin + 80,
        y: margin * 2 + toolbarHeight * 5 + widgetLineHeight * 8 - 2,
        height: widgetLineHeight,
        width: 95,
        text: ` `,
        onIncrement: () => changeSpinner(ui.getWindow(peepPropertiesWindow).findWidget<SpinnerWidget>("spinner-y-position"), "y", + 1),
        onDecrement: () => changeSpinner(ui.getWindow(peepPropertiesWindow).findWidget<SpinnerWidget>("spinner-y-position"), "y", - 1),
    },
    <LabelDesc>{
        type: "label",
        name: "label-z-position",
        x: margin + toolbarHeight,
        y: margin * 2 + toolbarHeight * 5 + widgetLineHeight * 9.5 - 2,
        height: widgetLineHeight,
        width: groupboxName.width - margin * 2,
        text: "Z position: ",
    },
    <SpinnerDesc>{
        type: "spinner",
        name: "spinner-z-position",
        x: margin + 80,
        y: margin * 2 + toolbarHeight * 5 + widgetLineHeight * 9.5 - 2,
        height: widgetLineHeight,
        width: 95,
        text: ` `,
        onIncrement: () => changeSpinner(ui.getWindow(peepPropertiesWindow).findWidget<SpinnerWidget>("spinner-z-position"), "z", + 1),
        onDecrement: () => changeSpinner(ui.getWindow(peepPropertiesWindow).findWidget<SpinnerWidget>("spinner-z-position"), "z", - 1),
    },
];

function setCostume(number: number): void
{
    const staff = <Staff>selectedPeep;
    if (number > 43) {
        number = number + 208;
        staff.costume = number;
    }
    else {
        staff.costume = number;
    }
    debug(`Costume is set to ${costume[number]}`);
}
