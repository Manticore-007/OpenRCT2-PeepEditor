import { getPeepById } from "../objects/peep";

export function togglePeepPicker(isPressed: boolean, onPick: (peep: Guest | Staff) => void, onCancel: () => void): void {
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
            let peepToSelect: Guest | Staff | undefined;
            const entityId = args.entityId;
            if (entityId !== undefined)
            {
                const entity = getPeepById(entityId);
                if (entity !== undefined)
                {
                    peepToSelect = entity;
                    ui.tool?.cancel();
                }
                else
                {
                    console.log("[PeepPicker] Invalid entity id selected:", entityId);
                }
            }

            if (peepToSelect)
            {
                onPick(peepToSelect);
                ui.tool?.cancel();
            }
        },
        onFinish: onCancel
    });
}