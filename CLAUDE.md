@AGENTS.md

## Project

This is a guitar tuner app.

## Design

Figma: https://www.figma.com/design/S4kNznYzgtIbo9u7D11XrL/TT3?node-id=3-6148&p=f&t=rXnZJbR1I4i27Sxj-0

The tuner screen is "Test Block 5" on the Design page; "Test Block 4 - Assets" holds its swappable parts (Letters, Numbers, Sharp-Flat-Symbol, Lights, Heads-v2). Blocks 1–2 are old drafts; hidden frames are leftover UI-kit junk.

- Artwork is stacked transparent layers in `assets/tuner/`, cropped to their bounds, with positions in the 414x896 design frame in `assets/tuner/manifest.json`. Component exports from Figma have the yellow frame fill baked in, so use the source image fills instead.
- No Hz readout. Notes are spelled C♯ E♭ F♯ G♯ B♭.
- All letters and numerals are exported. The Sleep head is still missing.
- Exporting a component variant from Figma as PNG at 3x gives a transparent full-frame 1242x2688 image: crop it to its bounds and record the rect in the manifest.
