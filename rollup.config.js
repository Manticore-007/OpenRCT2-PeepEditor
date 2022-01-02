import replace from "@rollup/plugin-replace";
import typescript from "@rollup/plugin-typescript";
import getPath from "platform-folders";
import { terser } from "rollup-plugin-terser";
import pkg from "./package.json";


// Environment variables
const build = process.env.BUILD || "development";
const isDev = (build === "development");

const output = (isDev)
	? `${getPath("documents")}/OpenRCT2/plugin/PeepEditor.js`
	: "./dist/PeepEditor.js";


/**
 * @type {import("rollup").RollupOptions}
 */
const config = {
	input: "./src/registerPlugin.ts",
	output: {
		file: output,
		format: "iife",
	},
	plugins: [
		replace({
			include: "./src/helpers/environment.ts",
			preventAssignment: true,
			values: {
				__PLUGIN_VERSION__: pkg.version,
				__BUILD_CONFIGURATION__: build
			}
		}),
		typescript(),
		terser({
			compress: {
				passes: 5
			},
			format: {
				comments: false,
				quote_style: 1,
				wrap_iife: true,
				preamble: "// Get the latest version: https://github.com/Manticore-007/OpenRCT2-PeepEditor",

				beautify: isDev,
			},
			mangle: {
				properties: {
					regex: /^_/
				}
			},

			// Useful only for stacktraces:
			keep_fnames: isDev,
		}),
	],
};
export default config;