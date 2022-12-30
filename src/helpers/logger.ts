/// <reference path="../../lib/ducktape.d.ts" />

import * as Environment from "./environment";

const isDuktapeAvailable = (typeof Duktape !== "undefined");

/**
 * Logs a message if debug mode is enabled, or does nothing otherwise.
 * @param message The error message to be logged.
 */
export function debug(message: string): void
{
	if (Environment.isDevelopment)
	{
		console.log(message);
	}
}


/**
 * Logs an error message with an optional method name for specifying the origin.
 * @param message The error message to be logged.
 * @param method The method specifying where the error occured.
 */
export function error(message: string, method?:string): void
{
	console.log((method)
		? `Error (${method}): ${message}`
		: `Error: ${message}`);
}

function stacktrace(): string
{
	if (!isDuktapeAvailable)
	{
		return "  (stacktrace unavailable)\r\n";
	}

	const depth = -4; // skips act(), stacktrace() and the calling method.
	let entry: DukStackEntry, result = "";

	for (let i = depth; (entry = Duktape.act(i)); i--)
	{
		const functionName = entry.function.name;
		const prettyName = functionName
			? (functionName + "()")
			: "<anonymous>";

		result += `   -> ${prettyName}: line ${entry.lineNumber}\r\n`;
	}
	return result;
}


/**
 * Enable stack-traces on errors in development mode.
 */
if (Environment.isDevelopment && isDuktapeAvailable)
{
	Duktape.errCreate = function onError(error): Error
	{
		error.message += ("\r\n" + stacktrace());
		return error;
	};
}