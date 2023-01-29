import { openSideWindow, sideWindow } from "../ui/sideWindow";
import * as btn from "./buttonControl";
import { debug } from "./logger";
import { followPeep } from "./resetViewport";
import { selectedPeep, setSelectedPeep } from "./selectedPeep";
import { getColourStaff, getCoordinates, getCostume, getEnergy, getFreeze, getLblColourStaff, getStaffType } from "./staffGetters";
import { windowId } from "./windowProperties";

export function peepSelect(): void
{
    if (ui.getWindow(windowId).findWidget<ButtonWidget>("button-all-guests").isPressed){
        btn.toggle("button-all-guests");
    }
    if (!ui.getWindow(windowId).findWidget<ButtonWidget>("button-picker").isPressed) {
        ui.activateTool({
            id: "select-peep",
            cursor: "cross_hair",
            onDown: e => {
                const entityId = e.entityId;
                if (entityId !== undefined)
                {
                    const entity = map.getEntity(entityId);
                    if (!entity || entity.type === "car")
                    {
                        ui.showError("You need Basssiiie's", "Ride Vehicle Editor");
                        return;
                    }
                    else if (!entity || (entity.type !== "guest" && entity.type !== "staff"))
                    {
                        debug(`Invalid entity type selected: ${entity.type}`);
                        ui.showError("You must select a guest", "or staff member");
                        return;
                    }
                    setSelectedPeep(<Guest | Staff>entity);
                    getFreeze(<Staff>selectedPeep);
                    followPeep(selectedPeep);
                    setLabelPeepName();
                    btn.toggle("button-picker");
                    btn.enableAll();
                    if (entity.type === "guest") {btn.disable("button-freeze"); openSideWindow("Guest properties"); getColourGuest(<Guest>selectedPeep);}
                    else
                    {
                        openSideWindow("Staff member properties");
                        getColourStaff(<Staff>selectedPeep);
                        getLblColourStaff(<Staff>selectedPeep);
                        getCostume(<Staff>selectedPeep);
                        getStaffType(<Staff>selectedPeep);
                        getCoordinates(<Staff>selectedPeep);
                        getEnergy(<Staff>selectedPeep);
                    }
                    ui.tool?.cancel();
                }
            }
        });
    }
    else {
        ui.tool?.cancel();
    }
    btn.toggle("button-picker");
}

export function setLabelPeepName(): void
{
    const window = ui.getWindow(windowId);
        window.findWidget<LabelWidget>("label-peep-name").text = `{WHITE}${selectedPeep.name}`;
}

function getColourGuest(guest: Guest): void
{
	const window = ui.getWindow(sideWindow);
	window.findWidget<ColourPickerWidget>("colourpicker-tshirt").colour = guest.tshirtColour;
	window.findWidget<ColourPickerWidget>("colourpicker-trousers").colour = guest.trousersColour;
	window.findWidget<ColourPickerWidget>("colourpicker-balloon").colour = guest.balloonColour;
	window.findWidget<ColourPickerWidget>("colourpicker-hat").colour = guest.hatColour;
	window.findWidget<ColourPickerWidget>("colourpicker-umbrella").colour = guest.umbrellaColour;
}