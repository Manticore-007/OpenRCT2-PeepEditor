export function getWindow(title: string): Window | null {
    for (let i = 0; i < ui.windows; i++) {
        if (ui.getWindow(i).title === title) return ui.getWindow(i);
    }
    return null;
}