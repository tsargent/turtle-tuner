@AGENTS.md

## Project

This is a guitar tuner app.

## Pitch input

- `src/tuner/useMicrophonePitch.ts` streams mic PCM with expo-audio's `useAudioStream` (works in Expo Go) and runs YIN (`src/tuner/detectPitch.ts`) at ~24 kHz every 60 ms.
- `EXPO_PUBLIC_SIMULATE_PITCH=1 npx expo start` swaps in the fake plucked-string demo.
- expo-audio bug (SDK 58): `stop()` deactivates the audio session 100 ms later even if the stream was restarted, silently killing it. The hook waits 250 ms after a stop and has a watchdog that restarts a stalled stream.

## Design

Figma: https://www.figma.com/design/S4kNznYzgtIbo9u7D11XrL/TT3?node-id=3-6148&p=f&t=rXnZJbR1I4i27Sxj-0

The tuner screen is "Test Block 5" on the Design page; "Test Block 4 - Assets" holds its swappable parts (Letters, Numbers, Sharp-Flat-Symbol, Lights, Heads-v2). Blocks 1–2 are old drafts; hidden frames are leftover UI-kit junk.

- Artwork is stacked transparent layers in `assets/tuner/`, cropped to their bounds, with positions in the 414x896 design frame in `assets/tuner/manifest.json`. Component exports from Figma have the yellow frame fill baked in, so use the source image fills instead.
- No Hz readout. Notes are spelled C♯ E♭ F♯ G♯ B♭.
- Idle behavior (from TestFlight feedback): the screen stays awake; the display starts on A4 at 30% opacity, lights to 100% on sound, holds the last note when sound stops, and dims back after 10 s of silence (`useTunerDisplay`). The needle and lights rest whenever nothing is heard. The turtle should sleep while idle once the Sleep head exists (`SLEEP_HEAD`).
- All letters and numerals are exported. The Sleep head is still missing.
- Exporting a component variant from Figma as PNG at 3x gives a transparent full-frame 1242x2688 image: crop it to its bounds and record the rect in the manifest.
