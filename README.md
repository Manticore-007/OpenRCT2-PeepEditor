# PeepEditor plugin for OpenRCT2

This plugin lets you modify the properties of your park guests and staff members.
v1.2:
![(Video example of using PeepEditor)](https://raw.githubusercontent.com/Manticore-007/OpenRCT2-PeepEditor/main/img/v1.2.gif)

v1.1:
![(Video example of using PeepEditor)](https://raw.githubusercontent.com/Manticore-007/OpenRCT2-PeepEditor/main/img/v1.1.gif)

This is my first experience with any actual coding. I got interested by using the Ride Vehicle Editor from Basssiiie. I wanted to make something similar, but with peeps. I thought it would be a cool project to learn how to code.

There are a few different tabs:

Staff:
Freeze/unfreeze staff members, so you can use the as scenery objects around your map
Give each individual staff member their own colour
Change their appearance or their stafftype.

Colours
    Give all the guests on the map the same colour for their shirts, trousers, balloons,
    hats and umbrellas respectively.

Flags
    Here you can make your guests do different kind of stuff; like littering or exploding to name two.

Conditions
    This is a planned feature, here I want the option to set your guests conditions, like happiness or thirst, this is already possible at the Cheats menu.

About
    Just some info about me and the plug-in.

Thanks to Basssiiie for let me use his Proxy Pather and readme file as a template, and showing me the ways of writing plug-ins.


## Installation

2. Download the latest version of the plugin from the [Releases page](https://github.com/Manticore-007/OpenRCT2-PeepEditor/releases/tag/v1.1).
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
