export function errorMessage(entityType: EntityType): void
{
	switch (entityType) {
		case "balloon":
			ui.showError("They all float down here,", "you'll float too...");
			break;
		case "car":
			ui.showError("You need Basssiiie's", "Ride Vehicle Editor plugin for these");
			break;
		case "duck":
			ui.showError("Quack", "quack");
			break;
		case "litter":
			ui.showError("Papier hier,", "papier hier");
			break;
		case "crash_splash":
			ui.showError("I'm glad", "I bought an umbrella");
			break;
		case "crashed_vehicle_particle":
			ui.showError("It's just", "a scratch");
			break;
		case "explosion_cloud":
			ui.showError("Zonne vuurbal", "jonguh!");
			break;
		case "explosion_flare":
			ui.showError("You got it...", "...and it's gone");
			break;
		case "jumping_fountain_snow":
			ui.showError("Avoid the", "yellow ones");
			break;
		case "jumping_fountain_water":
			ui.showError(" ", " ");
			break;
		case "money_effect":
			ui.showError("Show me", "the Money!");
			break;
		case "steam_particle":
			ui.showError("That's", "hot");
			break;
	}
}