import { getPeepById } from "../objects/peep";
import { openSideWindow } from "../ui/sideWindow";

export function togglePeepPicker(isPressed: boolean, onPick: (peep: Guest | BaseStaff) => void, onCancel: () => void): void
{
    if (!isPressed)
    {
        ui.tool?.cancel();
        return;
    }

    ui.activateTool({
        id: "peep-picker",
        cursor: "cross_hair",
        onDown: args =>
        {
            let peepToSelect: Guest | BaseStaff | undefined;
            const entityId = args.entityId;
            if (entityId === undefined)
            {
                return;
            }
            const entity = getPeepById(entityId);
            if (entity === undefined)
            {
                console.log("[PeepPicker] Invalid entity id selected:", entityId);
                return;
            }
            peepToSelect = entity;
            onPick(peepToSelect);
            openSideWindow();
            ui.tool?.cancel();
        },
        onFinish: onCancel
    });
}