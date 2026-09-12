import { compute, store } from "openrct2-flexui";

export const windowMain = store<Window|null>(null);
export const windowSide = store<Window|null>(null);
export const multiplierIndex = store<number>(0);
export const multiplier = compute(multiplierIndex, idx => (10 ** idx));
export const windowTitle = "Peep Editor";

//button properties
export const buttonSize = 24;

export const img =
{
    lens:  { frameBase: context.getIcon("search"), frameCount: 1, frameDuration: 4, offset: { x: 4, y: 1 } },
    peeps:  { frameBase: 5568, frameCount: 8, frameDuration: 4, colour: 12 },
    info:  { frameBase: 5367, frameCount: 8, frameDuration: 4,  },
    gear: { frameBase: 5201, frameCount: 4, frameDuration: 4 },
    pointingFinger: { frameBase: 5318, frameCount: 8, frameDuration: 2, },
    map:  { frameBase: context.getIcon("map"), frameCount: 1, frameDuration: 4, offset: { x: 4, y: 1 }},
    eye:  { frameBase: context.getIcon("view"), frameCount: 1, frameDuration: 4, offset: { x: 0, y: -2 }},
    tiles:  29448,
    items: 5326,
    mood: 5288,
    arrow: { NW: 5638, NE: 5635, SE: 5636, SW: 5637 },
    staff: 5628,
    guest: 6810
}