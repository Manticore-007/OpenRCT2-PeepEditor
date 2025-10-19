import { dropdown, FlexiblePosition, horizontal, label, twoway, WidgetCreator } from "openrct2-flexui";
import { model } from "../viewmodel/PeepViewModel";

export function multiplier(): WidgetCreator<FlexiblePosition>
{
	return horizontal([
		label({
			text: "Multiplier:",
			height: 13,
			padding: ["1w", -20, 7, "1w"],
		}),
		dropdown({
			padding: ["1w", 15, 7, -20],
			width: "20%",
			height: 13,
			items: ["1x", "10x", "100x"],
			selectedIndex: twoway(model._multiplierIndex)
		})
	])
}