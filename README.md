# ProxyPather plugin for OpenRCT2

This plugin lets you quickly cover guide paths with full paths without changing the guests pathfinding. This method is called 'proxy pathing'.

![(Video example of applying proxy pathing)](https://raw.githubusercontent.com/Basssiiie/OpenRCT2-ProxyPather/master/img/proxy-pather.gif)

In short; to make it look like your guests are using the full width of the path, you can create so called 'guide paths'. These paths will guide the guests along your preferred routes without having the game turn it into wide paths (which are mostly ignored by guests).

If you then hide this guide path and cover it with another path object via the Tile Inspector, guests will be none the wiser and they will still follow the original path under it. They always use the lowest path in the tile element list.

Since making these double layered proxy paths can be quite tedious, this plugin does it for you by converting all the paths in the specified area to said proxy paths with a simple drag of the mouse.

The newest version also supports smoothing the edges and preserving any placed footpath additions (like benches and lamps). And guests can still use them!

![(Video example of the newest version of the plugin)](https://raw.githubusercontent.com/Basssiiie/OpenRCT2-ProxyPather/master/img/proxy-preserve-additions.gif)

Thanks to Darkoro and Manticore from the DKMP server for explaining proxy pathing.


## Installation

2. Download the latest version of the plugin from the [Releases page](https://github.com/Basssiiie/OpenRCT2-ProxyPather/releases).
3. To install it, put the downloaded `*.js` file into your `/OpenRCT2/plugin` folder.
    - Easiest way to find the OpenRCT2-folder is by launching the OpenRCT2 game, click and hold on the red toolbox in the main menu, and select "Open custom content folder".
    - Otherwise this folder is commonly found in `C:/Users/<YOUR NAME>/Documents/OpenRCT2/plugin` on Windows.
    - If you already had this plugin installed before, you can safely overwrite the old file.
4. Once the file is there, it should show up ingame in the dropdown menu under the map icon.

---

## Building the source code

This project is based on [wisnia74's Typescript modding template](https://github.com/wisnia74/openrct2-typescript-mod-template) and uses [Nodemon](https://nodemon.io/), [ESLint](https://eslint.org/) and [TypeScript](https://www.typescriptlang.org/) from this template.

1. Install latest version of [Node](https://nodejs.org/en/) and make sure to include NPM in the installation options.
2. Clone the project to a location of your choice on your PC.
3. Open command prompt, use `cd` to change your current directory to the root folder of this project and run `npm install`.
4. Find `openrct2.d.ts` TypeScript API declaration file in OpenRCT2 files and copy it to `lib` folder (this file can usually be found in `C:/Users/<YOUR NAME>/Documents/OpenRCT2/bin/` or `C:/Program Files/OpenRCT2/`).
    - Alternatively, you can make a symbolic link instead of copying the file, which will keep the file up to date whenever you install new versions of OpenRCT2.
5. Run `npm run build` (release build) or `npm run build:dev` (develop build) to build the project.
    - Default output folder for release builds: `(project directory)/dist`
    - Default output folder for develop builds: `(documents)/OpenRCT2/plugins`
    - If your plugin folder is located elsewhere (on for example a non-Windows OS), you can modify it in `rollup.config.js`.

### Hot reload

This project supports the [OpenRCT2 hot reload feature](https://github.com/OpenRCT2/OpenRCT2/blob/master/distribution/scripting.md#writing-scripts) for development.

1. Make sure you've enabled it by setting `enable_hot_reloading = true` in your `/OpenRCT2/config.ini`.
2. If you are on a non-Windows OS, open `rollup.config.js` and change the output file path to your plugin folder.
    - Example: `C:/OpenRCT2/plugin/ProxyPather.js`.
    - Make sure this path uses `/` instead of `\` slashes!
3. Open command prompt and use `cd` to change your current directory to the root folder of this project.
4. Run `npm start` to start the hot reload server.
5. Use the `/OpenRCT2/bin/openrct2.com` executable to [start OpenRCT2 with console](https://github.com/OpenRCT2/OpenRCT2/blob/master/distribution/scripting.md#writing-scripts) and load a save or start new game.
6. Each time you save any of the files in `./src/`, the server will compile `./src/registerPlugin.ts` and place compiled plugin file inside your local OpenRCT2 plugin directory.
7. OpenRCT2 will notice file changes and it will reload the plugin.

## Notes

Don't touch `app.js`, even though it's just an empty file. Its existence makes Nodemon happy, and Nodemon is what watches your files for changes & fires off new dev builds for hot reloading.

Thanks to [wisnia74](https://github.com/wisnia74/openrct2-typescript-mod-template) for providing the template for this mod and readme.
