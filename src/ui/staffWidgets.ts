import { costumeList } from "../enums/costumes";
import { staffTypeList } from "../enums/staffTypes";
import { changeStaffColourExecuteArgs } from "../gameActions/staffChangeColour";
import { changeStaffCoordinatesExecuteArgs, setStaffCoordinatesExecuteArgs } from "../gameActions/staffChangeCoordinates";
import { changeStaffCostumeExecuteArgs } from "../gameActions/staffChangeCostume";
import { changeStaffEnergyExecuteArgs } from "../gameActions/staffChangeEnergy";
import { changeStaffTypeExecuteArgs } from "../gameActions/staffChangeType";
import { setStaffEnergyExecuteArgs } from "../gameActions/staffSetEnergy";
import { selectedPeep } from "../helpers/selectedPeep";
import { margin, multiplierList, setMultiplier, toolbarHeight, widgetLineHeight, windowColour } from "../helpers/windowProperties";

const grpBoxAppearance: GroupBoxDesc = {
    type: "groupbox",
    name: "groupbox-appearance",
    text: "Appearance",
    x: margin,
    y: toolbarHeight + widgetLineHeight /2,
    height: widgetLineHeight * 5.25,
    width: 200 - margin * 2,
};

const lblStaffType: LabelDesc = {
    type: "label",
    name: "label-staff-type",
    x: margin + toolbarHeight,
    y: grpBoxAppearance.y + widgetLineHeight + margin,
    height: widgetLineHeight,
    width: grpBoxAppearance.width - margin * 2,
    text: "Type: ",
    tooltip: "Change the type of the selected staff member",
};

const dropdownStaffType: DropdownDesc = {
    type: "dropdown",
    name: "dropdown-staff-type",
    x: margin + 75,
    y: lblStaffType.y,
    height: widgetLineHeight,
    width: 105,
    items: staffTypeList,
    selectedIndex: -1,
    tooltip: "Change the type of the selected staff member",
    onChange: (number: number) => context.executeAction("pe_changestafftype", changeStaffTypeExecuteArgs(<Staff>selectedPeep, number)),
};

const lblCostume: LabelDesc = {
    type: "label",
    name: "label-costume",
    x: margin + toolbarHeight,
    y: lblStaffType.y + widgetLineHeight +1,
    height: widgetLineHeight,
    width: grpBoxAppearance.width - margin * 2,
    text: "Costume: ",
    tooltip: "Change the costume of the selected staff member",
};

const dropdownCostume: DropdownDesc = {
    type: "dropdown",
    name: "dropdown-costume",
    x: margin + 75,
    y: lblCostume.y,
    height: widgetLineHeight,
    width: 105,
    items: costumeList,
    selectedIndex: -1,
    tooltip: "Change the costume of the selected staff member",
    onChange: (number) => context.executeAction("pe_changestaffcostume", changeStaffCostumeExecuteArgs(<Staff>selectedPeep, number)),
};

const lblStaffColour: LabelDesc = {
    type: "label",
    name: "label-staff-colour",
    x: margin + toolbarHeight,
    y: lblCostume.y + widgetLineHeight +1,
    height: widgetLineHeight,
    width: grpBoxAppearance.width - margin * 2,
    text: "Colour: ",
    tooltip: "Change the colour of the staff member's outfit",
};

const txtStaffClr: TextBoxDesc = {
    type: "textbox",
    name: "textbox-staff-colour",
    x: margin + 75,
    y: lblStaffColour.y,
    height: widgetLineHeight,
    width: 105,
    isDisabled: true,
    text: "",
    tooltip: "Change the colour of the slected staff member's outfit",
};

const clrPickerStaff: ColourPickerDesc = {
    type: "colourpicker",
    name: "colourpicker-staff",
    x: 205 - margin - widgetLineHeight *2,
    y: txtStaffClr.y +1,
    height: widgetLineHeight,
    width: widgetLineHeight,
    colour: windowColour,
    tooltip: "Change the colour of the selected staff member's outfit",
    onChange: (number) => context.executeAction("pe_changestaffcolour", changeStaffColourExecuteArgs(<Staff>selectedPeep, number)),
};

const grpBoxCoordinates: GroupBoxDesc = {
        type: "groupbox",
        name: "groupbox-coordinates",
        text: "Kinematics",
        x: margin,
        y: grpBoxAppearance.y + grpBoxAppearance.height + margin,
        height: widgetLineHeight * 6.75,
        width: 200 - margin * 2,
    };

const lblXPos: LabelDesc = {
        type: "label",
        name: "label-x-position",
        x: margin + toolbarHeight,
        y: grpBoxCoordinates.y + widgetLineHeight + margin,
        height: widgetLineHeight,
        width: grpBoxAppearance.width - margin * 2,
        text: "X position: ",
        tooltip: "Finetune the position of the selected staff member on the map",
    };

const spnXPos: SpinnerDesc = {
        type: "spinner",
        name: "spinner-x-position",
        x: margin + 75,
        y: lblXPos.y,
        height: widgetLineHeight,
        width: 105,
        text: ` `,
        tooltip: "Finetune the position of the selected staff member on the map",
        onClick: () => ui.showTextInput({
            title: "X coordinate",
            description: "Put in X coordinate to move staff member to",
            initialValue: selectedPeep.x.toString(),
            callback: text => {context.executeAction("pe_setstaffcoordinates", setStaffCoordinatesExecuteArgs(<Staff>selectedPeep, "x", text));}
        }),
        onIncrement: () => context.executeAction("pe_changestaffcoordinates", changeStaffCoordinatesExecuteArgs(<Staff>selectedPeep, "x", + 1)),
        onDecrement: () => context.executeAction("pe_changestaffcoordinates", changeStaffCoordinatesExecuteArgs(<Staff>selectedPeep, "x", - 1)),
    };

const lblYPos: LabelDesc = {
    type: "label",
    name: "label-y-position",
    x: margin + toolbarHeight,
    y: lblXPos.y + widgetLineHeight +1,
    height: widgetLineHeight,
    width: grpBoxAppearance.width - margin * 2,
    text: "Y position: ",
    tooltip: "Finetune the position of the selected staff member on the map",
};

const spnYPos: SpinnerDesc = {
    type: "spinner",
    name: "spinner-y-position",
    x: margin + 75,
    y: lblYPos.y,
    height: widgetLineHeight,
    width: 105,
    text: ` `,
    tooltip: "Finetune the position of the selected staff member on the map",
    onClick: () => ui.showTextInput({
        title: "Y coordinate",
        description: "Put in Y coordinate to move staff member to",
        initialValue: selectedPeep.y.toString(),
        callback: text => {context.executeAction("pe_setstaffcoordinates", setStaffCoordinatesExecuteArgs(<Staff>selectedPeep, "y", text));}
    }),
    onIncrement: () => context.executeAction("pe_changestaffcoordinates", changeStaffCoordinatesExecuteArgs(<Staff>selectedPeep, "y", + 1)),
    onDecrement: () => context.executeAction("pe_changestaffcoordinates", changeStaffCoordinatesExecuteArgs(<Staff>selectedPeep, "y", - 1)),
};

const lblZPos: LabelDesc = {
    type: "label",
    name: "label-z-position",
    x: margin + toolbarHeight,
    y: lblYPos.y + widgetLineHeight +1,
    height: widgetLineHeight,
    width: grpBoxAppearance.width - margin * 2,
    text: "Z position: ",
    tooltip: "Finetune the position of the selected staff member on the map",
};

const spnZPos: SpinnerDesc = {
    type: "spinner",
    name: "spinner-z-position",
    x: margin + 75,
    y: lblZPos.y,
    height: widgetLineHeight,
    width: 105,
    text: ` `,
    tooltip: "Finetune the position of the selected staff member on the map",
    onClick: () => ui.showTextInput({
        title: "Z coordinate",
        description: "Put in Z coordinate to move staff member to",
        initialValue: selectedPeep.z.toString(),
        callback: text => {context.executeAction("pe_setstaffcoordinates", setStaffCoordinatesExecuteArgs(<Staff>selectedPeep, "z", text));}
    }),
    onIncrement: () => context.executeAction("pe_changestaffcoordinates", changeStaffCoordinatesExecuteArgs(<Staff>selectedPeep, "z", + 1)),
    onDecrement: () => context.executeAction("pe_changestaffcoordinates", changeStaffCoordinatesExecuteArgs(<Staff>selectedPeep, "z", - 1)),
};

const lblEnergy: LabelDesc = {
    type: "label",
    name: "label-energy",
    x: margin + toolbarHeight,
    y: lblZPos.y + widgetLineHeight + widgetLineHeight /2,
    height: widgetLineHeight,
    width: grpBoxAppearance.width - margin * 2,
    text: "Speed: ",
    tooltip: "Set speed of selected staff member between 1 and 255",
};

const spnEnergy: SpinnerDesc = {
    type: "spinner",
    name: "spinner-energy",
    x: margin + 75,
    y: lblEnergy.y,
    height: widgetLineHeight,
    width: 105,
    text: ` `,
    tooltip: "Set speed of selected staff member between 1 and 255",
    onClick: () => {
        if (selectedPeep.energy !== 0) {
            ui.showTextInput({
                title: "Speed",
                description: "Put in speed of staff member",
                initialValue: selectedPeep.energy.toString(),
                callback: text => {
                    const number = parseInt(text);
                    context.executeAction("pe_setstaffenergy", setStaffEnergyExecuteArgs(<Staff>selectedPeep, number));
                }
            });
        }
    },
    onIncrement: () => context.executeAction("pe_changestaffenergy", changeStaffEnergyExecuteArgs(<Staff>selectedPeep, + 1)),
    onDecrement: () => context.executeAction("pe_changestaffenergy", changeStaffEnergyExecuteArgs(<Staff>selectedPeep, - 1)),
};

/* const grpBoxMultiplier: GroupBoxDesc = {
    type: "groupbox",
    name: "groupbox-multiplier",
    x: margin,
    y: grpBoxCoordinates.y + grpBoxCoordinates.height - 6,
    height: widgetLineHeight * 2,
    width: 200 - margin * 2,
}; */

const lblMultiplier: LabelDesc = {
    type: "label",
    name: "label-multiplier",
    x: margin + toolbarHeight,
    y: grpBoxCoordinates.y + grpBoxCoordinates.height + margin,
    height: widgetLineHeight,
    width: grpBoxAppearance.width - margin * 2,
    text: "Multiplier: ",
};

const dropdownMultiplier: DropdownDesc = {
    type: "dropdown",
    name: "dropdown-multiplier",
    x: margin + 75,
    y: lblMultiplier.y,
    height: widgetLineHeight,
    width: 105,
    items: multiplierList,
    selectedIndex: 0,
    isDisabled: false,
    onChange: (number) => setMultiplier(number),
};

export const staffWidgets: WidgetBaseDesc[] = [
    grpBoxAppearance,
    lblStaffColour,
    txtStaffClr,
    clrPickerStaff,
    lblStaffType,
    dropdownStaffType,
    lblCostume,
    dropdownCostume,
    grpBoxCoordinates,
    lblXPos,
    spnXPos,
    lblYPos,
    spnYPos,
    lblZPos,
    spnZPos,
    lblEnergy,
    spnEnergy,
    lblMultiplier,
    dropdownMultiplier
];