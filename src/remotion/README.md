# Remotion — animations for the site (Player, not video export)

This folder is scaffolding only. Nothing here is wired into the live
site yet.

## What this is for

We're using Remotion's **Player** (`@remotion/player`), which renders
a composition live in the browser as a React component — scrubbable,
interactive, no video file, no rendering pipeline, no cloud account
needed. This is different from Remotion's video-export workflow
(`remotion render`, Lambda, etc.), which we are **not** using.

## Layout

- `Root.tsx` — registers every composition so Remotion Studio can find
  and preview them (`npm run remotion`).
- `compositions/` — one file per animation. `ExampleFade.tsx` is a
  placeholder showing the pattern; delete it once real compositions
  exist.
- `index.ts` — Studio's entry point, do not import this from the app.

## Building a new animation

1. Add a component in `compositions/` (plain React + Remotion's
   `useCurrentFrame`/`interpolate`/`spring` for animating over time).
2. Register it in `Root.tsx` with a `<Composition>`.
3. Preview/tune it visually with `npm run remotion`.
4. Embed it on a page with `@remotion/player`:

   ```tsx
   import { Player } from "@remotion/player";
   import { ExampleFade } from "@/remotion/compositions/ExampleFade";

   <Player
     component={ExampleFade}
     durationInFrames={60}
     fps={30}
     compositionWidth={1280}
     compositionHeight={720}
     autoPlay
     loop
     style={{ width: "100%" }}
   />;
   ```
