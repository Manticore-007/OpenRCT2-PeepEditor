# PeepEditor plugin for OpenRCT2

This plugin lets you modify the properties of your park guests and staff members.


### The Main Window:

![(The main window of Peep Editor)](https://raw.githubusercontent.com/Manticore-007/OpenRCT2-PeepEditor/main/img/main%20window.png)

Here you can see the most basic information about the peep you've selected. The buttons do the following:

![(Select a peep)](https://raw.githubusercontent.com/Manticore-007/OpenRCT2-PeepEditor/main/img/pipette.png)
Activates the tool to select a guest or staff member.

![(Select a peep)](https://raw.githubusercontent.com/Manticore-007/OpenRCT2-PeepEditor/main/img/freeze.png)
Toggles wether a staff member is frozen in place or moving. Unfreezing sets the speed of the staff member automatically to 90.

![(Select a peep)](https://raw.githubusercontent.com/Manticore-007/OpenRCT2-PeepEditor/main/img/rename.png)
Opens a text box where you can put in a new (longer than normally) name for your guest or staff member.

![(Select a peep)](https://raw.githubusercontent.com/Manticore-007/OpenRCT2-PeepEditor/main/img/locate.png)
When you press this button, the screen will focus on the selected guest or staff member.

![(Select a peep)](https://raw.githubusercontent.com/Manticore-007/OpenRCT2-PeepEditor/main/img/remove.png)
Remove the selected guest or staff member.

![(Select a peep)](https://raw.githubusercontent.com/Manticore-007/OpenRCT2-PeepEditor/main/img/allguests.png)
All the guests on the map will be selected, except the ones on rides.


### Staff member properties

<img src= "https://raw.githubusercontent.com/Manticore-007/OpenRCT2-PeepEditor/main/img/staff.png" align="left" />
<br>
Type: let's you change what kind of staff member it is.<br>
Costume: changes the how the staff member looks, you can even turn them into guests!<br>
Colour: changes the colour of the selected staff member's outfit, if possible.<br>
<br>
X position: moves the selected staff member along the X axis on the map.<br>
Y position: moves the selected staff member along the Y axis on the map.<br>
Z position: moves the selected staff member along the Z axis on the map.<br>
Speed: adjusts how fast a staff member is walking, adjustable from 1 to 255.<br>
<br>
The multiplier lets you set increments by 1, 10 or 100 respectively.<br>
<br clear="left"/>

### Guest properties

<img src= "https://raw.githubusercontent.com/Manticore-007/OpenRCT2-PeepEditor/main/img/guest.png" align="left" />
<br>
Here you can change the colours of the attributes of the selected guest.<br>
<br>
By checking the flags you can -for instance- force a guest to leave the park, or let him explode or let him paint a picture. Be sure to play around with all of the possibilities.
<br><br><br><br><br>
<br clear="left"/>

This window looks the same when the "all guests" button is pressed. The results are the same, but for ALL guests on the map, except for those on rides.


### Multiplayer

From version 23.1.1 on, the plugin is supported in multiplayer (on develop version, release version is not supported yet). To use it in a mulitplayer server you follow the [installation topic](https://github.com/Manticore-007/OpenRCT2-PeepEditor/blob/main/README.md#installation) below, but on the server side. When a client is connected to the server it will automatically download this plugin. The player needs permission to modify guests and staff, else the plugin will generate an error

![(Permissions)](https://raw.githubusercontent.com/Manticore-007/OpenRCT2-PeepEditor/main/img/permissions.png)  

The error message:  
![(error)](https://raw.githubusercontent.com/Manticore-007/OpenRCT2-PeepEditor/main/img/error.png)

## Installation

1. Download the latest version of the plugin from the [Releases page](https://github.com/Manticore-007/OpenRCT2-PeepEditor/releases/tag/v23.1.1).
2. To install it, put the downloaded `*.js` file into your `/OpenRCT2/plugin` folder.
    - Easiest way to find the OpenRCT2-folder is by launching the OpenRCT2 game, click and hold on the red toolbox in the main menu, and select "Open custom content folder".
    - Otherwise this folder is commonly found in `C:/Users/<YOUR NAME>/Documents/OpenRCT2/plugin` on Windows.
    - If you already had this plugin installed before, you can safely overwrite the old file.
3. Once the file is there, it should show up ingame in the dropdown menu under the map icon.

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
