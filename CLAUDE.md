@AGENTS.md

## Project

This is a guitar tuner app.

## Design

Figma: https://www.figma.com/design/S4kNznYzgtIbo9u7D11XrL/TT3?node-id=3-6148&p=f&t=rXnZJbR1I4i27Sxj-0

The tuner screen is "Test Block 5" on the Design page; "Test Block 4 - Assets" holds its swappable parts (Letters, Numbers, Sharp-Flat-Symbol, Lights, Heads-v2). Blocks 1–2 are old drafts; hidden frames are leftover UI-kit junk.

- Artwork is stacked transparent layers in `assets/tuner/`, cropped to their bounds, with positions in the 414x896 design frame in `assets/tuner/manifest.json`. Component exports from Figma have the yellow frame fill baked in, so use the source image fills instead.
- No Hz readout. Notes are spelled C♯ E♭ F♯ G♯ B♭.
- Only the E letter and 6 numeral are exported so far; other glyphs fall back to text (`LETTER_ART` / `NUMBER_ART` in `src/tuner/artwork.ts`). The Sleep head is also missing.
