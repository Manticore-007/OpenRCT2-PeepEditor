import { store } from "openrct2-flexui";
import { mainWindow } from "../ui/mainWindow"
import { model } from "../viewmodel/peepViewModel";
import { togglePeepPicker } from "../services/peepPicker";

export const shortcutId =
{
    open: store<string>("pe-shortcut-open"),
    select: store<string>("pe-shortcut-select"),
    freeze: store<string>("pe-shortcut-freeze")
}

export const shortcutNames =
{
    open: store<string>("[PE] Open Peep-Editor"),
    select: store<string>("[PE] Select a peep"),
    freeze: store<string>("[PE] Cycle through freeze states")
}

export const shortcutBindings =
{
    open: store<string[]>(["CTRL+SHIFT+P"]),
    select: store<string[]>(["CTRL+SHIFT+D"]),
    freeze: store<string[]>(["CTRL+SHIFT+F"])
}

export const shortcutRegister =
{
    open: ui.registerShortcut({
        id: shortcutId.open.get(),
        text: shortcutNames.open.get(),
        bindings: shortcutBindings.open.get(),
        callback: () => { mainWindow.open() }
    }),
    select: ui.registerShortcut({
        id: shortcutId.select.get(),
        text: shortcutNames.select.get(),
        bindings: shortcutBindings.select.get(),
        callback: () =>
            {
                model._isPicking.set(!model._isPicking.get())
                togglePeepPicker(model._isPicking.get(), p => model._select(p), () => model._isPicking.set(false));
            }
    }),
    freeze: ui.registerShortcut({
        id: shortcutId.freeze.get(),
        text: shortcutNames.freeze.get(),
        bindings: shortcutBindings.freeze.get(),
        callback: () =>
        {
            if (!model._isFrozen.get() && !model._isStatic.get()) {model._setMotion("frozen"); return;}
            if (model._isFrozen.get() && model._isStatic.get()) {model._setMotion("static"); return;}
            if (!model._isFrozen.get() && model._isStatic.get()) {model._setMotion("moving"); return;}
            console.log(model._isFrozen.get(), model._isStatic.get())
        }
    })
};

export function initShortcuts():void
{
    shortcutRegister.open,
    shortcutRegister.select,
    shortcutRegister.freeze
}

export function setShortcut(id: string, bindings: ShortcutDesc): void
{
    return context.sharedStorage.set(id, bindings);
}

export function getShortcut(id: string, bindings: ShortcutDesc): ShortcutDesc
{
    return context.sharedStorage.get(id, bindings);
}

