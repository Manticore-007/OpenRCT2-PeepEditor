export function togglePeepFreezer(isPressed: boolean, isFrozen: (f: boolean) => void): void {
    isPressed ? isFrozen : !isFrozen;
}