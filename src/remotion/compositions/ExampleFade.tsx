import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

/**
 * Starter template — not used anywhere yet.
 * Shows the pattern for a Remotion composition meant to be embedded
 * on the site via <Player>, not exported to a video file.
 */
export function ExampleFade() {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: "var(--background, #fdfaf5)", alignItems: "center", justifyContent: "center" }}>
      <h1 style={{ opacity, fontFamily: "Cormorant Garamond, serif", fontSize: 64 }}>LIONESS DRESS</h1>
    </AbsoluteFill>
  );
}
