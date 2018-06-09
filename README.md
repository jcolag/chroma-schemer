# chroma-schemer

_Chroma Schemer_ is a desktop application to quickly generate color schemes.

This is a relatively straightforward program, as much to test out [Proton Native](https://proton-native.js.org/#/) as anything else, though I did want a color scheme generator handy.

In short, you can choose:

 - A main color for the scheme
 - The type of scheme (monochromatic, analogous, triadic, rectangular, and square)
 - When relevant, whether to use the complement of the main color
 - When relevant, the difference between hues to use

_Chroma Schemer_ can then generate, preview, and save a file with CSS variables (custom properties) for:

 - `var(--base-color)`
 - `var(--base-color-dark)`
 - `var(--base-color-darker)`
 - `var(--base-color-light)`
 - `var(--base-color-lighter)`
 - `var(--alt-color)`
 - `var(--alt-color-dark)`
 - `var(--alt-color-darker)`
 - `var(--alt-color-light)`
 - `var(--alt-color-lighter)`
 - `var(--third-color)`
 - `var(--third-color-dark)`
 - `var(--third-color-darker)`
 - `var(--third-color-light)`
 - `var(--third-color-lighter)`
 - `var(--accent-color)`
 - `var(--accent-color-dark)`
 - `var(--accent-color-darker)`
 - `var(--accent-color-light)`
 - `var(--accent-color-lighter)`

Light and dark refer to shades.  If colors are not specified by the scheme, the main color is used for those variables, so that markup that relies on the colors won't fail.

For a (hopefully) simple example, please review [`testcase.html`](./testcase.html), which uses the above custom properties (assumed to be in a file named `output.css` in an approximation of a real webpage.  The header uses the base color; the menu uses the alternative color; the main text and footer use the third color; and separators and markers use the accent color.

