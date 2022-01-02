/**
 * Returns the current version of the plugin.
 */
export const pluginVersion = "__PLUGIN_VERSION__";


/**
 * Returns the build configuration of the plugin.
 */
export const buildConfiguration = "__BUILD_CONFIGURATION__";


/**
 * Returns true if the current build is a production build.
 */
// @ts-expect-error: boolean expression is affected by build variable replacement.
export const isProduction = (buildConfiguration === "production");


/**
 * Returns true if the current build is a production build.
 */
// @ts-expect-error: boolean expression is affected by build variable replacement.
export const isDevelopment = (buildConfiguration === "development");


/**
 * Returns true if the UI is available, or false if the game is running in headless mode.
 */
export const isUiAvailable = (typeof ui !== "undefined");