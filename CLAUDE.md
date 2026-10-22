@AGENTS.md

## Project

This is a guitar tuner app.

## Pitch input

- `src/tuner/useMicrophonePitch.ts` streams mic PCM with expo-audio's `useAudioStream` (works in Expo Go) and runs YIN (`src/tuner/detectPitch.ts`) at ~24 kHz every 60 ms.
- A note only counts once it holds steady for 4 analysis hops (~250 ms), so short blips don't wake the turtle or replace the held note.
- `EXPO_PUBLIC_SIMULATE_PITCH=1 npx expo start` swaps in the fake plucked-string demo.
- Hot reload keeps the old `Analyzer` instance, so changes to its tuning constants need a full app reload to test.
- expo-audio bug (SDK 58): `stop()` deactivates the audio session 100 ms later even if the stream was restarted, silently killing it. The hook waits 250 ms after a stop and has a watchdog that restarts a stalled stream.

## Design

Figma: https://www.figma.com/design/S4kNznYzgtIbo9u7D11XrL/TT3?node-id=3-6148&p=f&t=rXnZJbR1I4i27Sxj-0

The tuner screen is "Test Block 5" on the Design page; "Test Block 4 - Assets" holds its swappable parts (Letters, Numbers, Sharp-Flat-Symbol, Lights, Heads-v2). Blocks 1–2 are old drafts; hidden frames are leftover UI-kit junk.

- Artwork is stacked transparent layers in `assets/tuner/`, cropped to their bounds, with positions in the 414x896 design frame in `assets/tuner/manifest.json`. Component exports from Figma have the yellow frame fill baked in, so use the source image fills instead.
- No Hz readout. Notes are spelled C♯ E♭ F♯ G♯ B♭.
- Idle behavior (from TestFlight feedback): the screen stays awake; the display starts on A4 at 30% opacity, lights to 100% on sound, holds the last note when sound stops, and dims back after 10 s of silence (`useTunerDisplay`). Lights go off whenever nothing is heard; the needle holds its last reading, then dims with the display and drifts to center when the turtle falls asleep (it never parks at -50, which reads as "very flat"). The turtle sleeps (eyes closed) until it hears something and dozes off again after 10 s.
- All letters, numerals and heads are exported. The Sleep variant exports blank from its component; take it from the Heads-v2 instance in Test Block 5 instead.
- Exporting a component variant from Figma as PNG at 3x gives a transparent full-frame 1242x2688 image: crop it to its bounds and record the rect in the manifest.
