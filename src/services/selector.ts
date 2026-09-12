import { templateWindowSide } from "../ui/sideWindow";

const COORD_NULL = {x: 0, y: 0}; 
let startTile: CoordsXY = COORD_NULL;
let endTile: CoordsXY = COORD_NULL;
let currentRange: MapRange | null = null;


export function selectByTiles(peepType: "guest" | "staff", isPressed: boolean, onSelection: (peeps: Guest[] | BaseStaff[]) => void, onCancel: () => void): void
{
    
    if (!isPressed)
    {
        ui.tool?.cancel();
        ui.mainViewport.visibilityFlags &= ~(1 << 7);
        return;
    }

    ui.activateTool({
        id: "pe-select-by-tiles",
        cursor: "cross_hair",
        onStart: () =>
            {
                ui.mainViewport.visibilityFlags |= 1 << 7;
            },
        onMove: (e) =>
        {
            if (!e.mapCoords) return;
            endTile = e.mapCoords;
            currentRange = ui.tileSelection.range = calculateRange();
        },
        onDown: (e) =>
        {
            if (e.mapCoords) startTile = e.mapCoords;
        },
        onUp: () =>
        {
            const peeps = getPeepsOnSelection(peepType, currentRange);
            if (peeps.length > 0)
            {
            onSelection(peeps);
            templateWindowSide.focus();
            }
            ui.mainViewport.visibilityFlags &= ~(1 << 7);
            ui.tool?.cancel();
            startTile = endTile = COORD_NULL;
        },
        onFinish: onCancel
    })
}

function calculateRange(): MapRange {
    const start = (startTile.x === 0 && startTile.y === 0) ? endTile : startTile;

    return {
        leftTop: { 
            x: Math.min(start.x, endTile.x), 
            y: Math.min(start.y, endTile.y) 
        },
        rightBottom: { 
            x: Math.max(start.x, endTile.x), 
            y: Math.max(start.y, endTile.y) 
        }
    };
}

function getPeepsOnSelection(peepType: "guest" | "staff", selection: MapRange | null): Guest[] | BaseStaff[] {
    if (!selection) return [];

    let peeps: Guest[] | BaseStaff[] = [];
    const { leftTop, rightBottom } = selection;

    for (let x = leftTop.x; x <= rightBottom.x; x += 32) {
        for (let y = leftTop.y; y <= rightBottom.y; y += 32) {
            const tilePeeps = map.getAllEntitiesOnTile(peepType, { x, y });
            peeps.push(...tilePeeps as any);
        }
    }

    return peeps;
}