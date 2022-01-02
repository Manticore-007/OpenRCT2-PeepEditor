/// <reference path="../lib/openrct2.d.ts" />

import { main } from "./main";
import { pluginVersion } from "./helpers/environment";


registerPlugin({
	name: "Peep Editor",
	version: pluginVersion,
	authors: ["Manticore-007"],
	type: "local",
	licence: "MIT",
	targetApiVersion: 37,
	main,
});
