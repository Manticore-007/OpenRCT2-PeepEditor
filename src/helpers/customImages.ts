enum ImageMoniker {
    "trousers",
}

type ImageStringNames = keyof typeof ImageMoniker;

const pngToBase64: Record<ImageStringNames, string> = {
    trousers:
    "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yMpynviceNygCxI/cl1x+Y1zyWGBZ4pGJjVPLBJLpS5WupiVDZV4mjiSVzXKF7Iu5zlvcVardda+J39hsKCtpLlOM4w4lpBAEhIU1FFBFRaitGqkmEjRfszDP+z4k+RSyFUBI8cCalAhO37wP/jdrVmcmnSTgjGg98W2P0aBwC7Qatj297Ftt04A/zNwpXX8tSYw+0l6o6NFjoDQNnBx3dGUPeByBxh60mVDdiQ/TaFYBN7P6JtywOAt0L/m9tbex+kDkKGulm+Ag0NgrETZ6x7v7uvu7d8z7f5+AI58crL4ksomAAANdmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNC40LjAtRXhpdjIiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6R0lNUD0iaHR0cDovL3d3dy5naW1wLm9yZy94bXAvIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgIHhtcE1NOkRvY3VtZW50SUQ9ImdpbXA6ZG9jaWQ6Z2ltcDo4ZGM5MWE3OS1kOWI4LTRmYWItOGZkYy1jM2U5ODBhODhmYzIiCiAgIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NWY0MTgzMDgtYzczYi00NTZiLWE4ZTAtNTUyMDE5NDJlNzM2IgogICB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6YTFjMzQxZmEtOTEzMi00ZjRlLWE3MzAtMzc0NDMwYzIwYzY1IgogICBkYzpGb3JtYXQ9ImltYWdlL3BuZyIKICAgR0lNUDpBUEk9IjIuMCIKICAgR0lNUDpQbGF0Zm9ybT0iV2luZG93cyIKICAgR0lNUDpUaW1lU3RhbXA9IjE2NzIxNzkzODQ1Njg2MDIiCiAgIEdJTVA6VmVyc2lvbj0iMi4xMC4zMiIKICAgdGlmZjpPcmllbnRhdGlvbj0iMSIKICAgeG1wOkNyZWF0b3JUb29sPSJHSU1QIDIuMTAiCiAgIHhtcDpNZXRhZGF0YURhdGU9IjIwMjI6MTI6MjdUMjM6MTY6MjQrMDE6MDAiCiAgIHhtcDpNb2RpZnlEYXRlPSIyMDIyOjEyOjI3VDIzOjE2OjI0KzAxOjAwIj4KICAgPHhtcE1NOkhpc3Rvcnk+CiAgICA8cmRmOlNlcT4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NmE0ZmRmMjYtYzJiMy00ZWU4LTg1ZTMtMjAyYTJhOGUwNDgzIgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJHaW1wIDIuMTAgKFdpbmRvd3MpIgogICAgICBzdEV2dDp3aGVuPSIyMDIyLTEyLTI3VDIzOjE2OjI0Ii8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/Pv1RSnIAAAMAUExURQAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCRcjIyMzMy9DQz9TU0tjY1tzc2+Dg4OXl5+vr7fDw9Pb2+/z8zMvAD87AE9LC1tbE2trH3d7L4eLO5ebT6evX7u/c8vPi9/jo0MrB1c7C29LF39XH49jJ59zM7ODQ7+XV8uvb9vHh+fbo/fvw0cbAF8rAHc/AI9TB6dvB7+LD9enE/PLG//nL//zX//7j///wyMAAE8AAF8HB28PD38bG48nJ6M7O7NPT8dnZ9d/f+ufn/+/vxszEyM/Fy9PHztfJ0dvK1d/M2OPO3ObQ4OrS5O7U6PLX7fbZx83Gy9HIztTK0tjN1tvQ2+HT4efX5+3b7fPf8Pbk8/np9/3vw8/ABNTABdnAB97ACePBzefF0evJ1u/P2/PV4vfc6Pvj8P/s08rE2M3G3dHK4tXO6djQ7tzU8+DY9eXc+Org++/l/fPq//jww8TNycrVzM3Zz9Dd1NTi2Njm3d3r4uLv5+fz7e339PT7+/v/wAbbwAnlwczpw9DuxtTyytn30OH41uj53e774/T86/n+9f3/wsrDw83FxdHHyNTKy9jOztzS0+HX2Obd3uvi5PHp6/bw8/z3z8AX0sHc1MPf18fj2srm3s/q4dTu5tnx6t/17+b59fD8/Pr/z8AAFcAAHMAAI8AAKsAAMcAAOMHAP8HAP9PQ/97c/+ro//b108nAG8zAJM/ALdHANtPAP9TAP9vF/+LM/+jT/+3a//Lh//bowAzLwA/NwBLQwBXTwdrYxd/dyuTj0eno2O7u4PPz6vn58///z8AG2cAM3sLP48XT6MfX7cnb9s7j+9bq/N3u/eXy/u33//X7ycTADcfB0cvD1s/H2tTM3tnS49/a6OTf7urk8/Dq+fbw//z3zdLS/+3AP/bAP//AAdrYwdrYyePhxuDewdrYzeblzebl5vj43PLyzebl0NbW1Nra2N7e28zL4M3L5c/M6tDM79LL9NPK+dXI/9fH/9/J/+bM/+3P//PS////4+DsWcAAAABdFJOUwBA5thmAAAAAWJLR0QAiAUdSAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+YMGxYQGA8kOmUAAAA+SURBVBjTnY1BCgAwCMP8/4vb7jKFspUdF0E0Fqz6g+YINasrEqMYArMihHrOhF5B0dZgjvmW6BnCTQBuX2zD80I74yzB2wAAAABJRU5ErkJggg==",
};

const imageMap: number[] = [];

type ImageData = {
    width: number;
    height: number;
    data: string;
};

/**
 * Call this function once to initialize the custom sprites, probably in your main.ts file
 */
export const initCustomSprites = (): void => {
    const images: ImageData[] = [
        { width: 16, height: 16, data: pngToBase64.trousers },
    ];
    // allocate memory slots for each image
    const range = ui.imageManager.allocate(images.length);

    // populate the memory slots with the images
    if (range) {
        images.forEach((image, index) => {
            ui.imageManager.setPixelData(range.start + index, {
                type: "png",
                palette: "keep",
                data: image.data,
            });
            imageMap[index] = range.start + index;
        });
    }
};
/**
 * Put this function in for the value for the image in a widget, e.g.:
 *
 *{..., width: 19, height: 20, image: customImageFor("sBendLeft"), ... }
 */
 export const customImageFor = (image: ImageStringNames): number => {
    return imageMap[ImageMoniker[image]];
};