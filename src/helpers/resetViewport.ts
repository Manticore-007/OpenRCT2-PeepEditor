import { windowId } from "./windowProperties";

let updateViewport: (IDisposable | null) = null;

export function resetViewport()
{
	disableUpdateViewport();
	ui.getWindow(windowId).findWidget<ViewportWidget>("viewport-peep").viewport.moveTo({ x: -9000, y: -9000, z: 9000 });
}

export function disableUpdateViewport()
{
	updateViewport?.dispose();
	updateViewport = null;
}

export function followPeep(peep: Staff | Guest)
{
	disableUpdateViewport();
		updateViewport = context.subscribe("interval.tick", () => {
			ui.getWindow(windowId).findWidget<ViewportWidget>("viewport-peep").viewport.moveTo(peep);
		});
}