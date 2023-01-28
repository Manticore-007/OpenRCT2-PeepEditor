import { debug } from "./logger";
import { windowId } from "./windowProperties";

export function unpressAll(): void
{
	const window = ui.getWindow(windowId);
	(window.widgets.filter((w) => w.type === "button")).forEach((b) =>
	{
		const button = <ButtonWidget>b;
		button.isPressed = false;
	});
}

export function toggle(name: string): void
{
	const window = ui.getWindow(windowId);
	const widget = (window.widgets.filter((w) => w.name === name)[0] as ButtonWidget);
	widget.isPressed = !widget.isPressed;
	debug(`${widget.name} is ${widget.isPressed ? "pressed" : "unpressed"}`);
}

export function pressed(name: string): void
{
	const window = ui.getWindow(windowId);
	const widget = (window.widgets.filter((w) => w.name === name)[0] as ButtonWidget);
	widget.isPressed = true;
	debug(`${widget.name} is pressed`);
}

export function unpressed(name: string): void
{
	const window = ui.getWindow(windowId);
	const widget = (window.widgets.filter((w) => w.name === name)[0] as ButtonWidget);
	widget.isPressed = false;
	debug(`${widget.name} is unpressed`);
}

export function enableAll(): void
{
	const window = ui.getWindow(windowId);
	const widgets = window.widgets.filter((w) => w.type === "button");
	const buttons = widgets.slice(2, 6);
	buttons.forEach(b =>
	{
		const btn = <ButtonWidget>b;
		btn.isDisabled = false;
	});
}

export function disable(name: string): void
{
	const window = ui.getWindow(windowId);
	(window.widgets.filter((w) => w.name === name)[0] as ButtonWidget).isDisabled = true;
}

export function enable(name: string): void
{
	const window = ui.getWindow(windowId);
	(window.widgets.filter((w) => w.name === name)[0] as ButtonWidget).isDisabled = false;
}

export function disableAll(): void
{
	const window = ui.getWindow(windowId);
	const widgets = window.widgets.filter((w) => w.type === "button");
	const buttons = widgets.slice(2, 6);
	buttons.forEach((b) =>
	{
		const btn = <ButtonWidget>b;
		btn.isDisabled = true;
	});
}