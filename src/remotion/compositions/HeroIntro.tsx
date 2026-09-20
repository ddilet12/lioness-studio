import { AbsoluteFill, Easing, Img, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/CormorantGaramond";
import panelFace from "../assets/panel-face.jpg";
import panelEiffel from "../assets/panel-eiffel.jpg";
import mainShot from "../assets/main-shot.jpg";
import heroPhoto from "../assets/hero.jpg";
import logoMark from "../assets/logo-mark.svg";

const { fontFamily } = loadFont("normal", { weights: ["500"], subsets: ["latin"] });

export const HERO_INTRO = { width: 1080, height: 1350, fps: 24, durationInFrames: 120 } as const;

const GOLD = "#D8AC6A";
const SIDE = 300; // width of the outer panels in the opening split-screen
const ease = Easing.bezier(0.2, 0.7, 0.2, 1);
const easeInOut = Easing.inOut(Easing.cubic);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * 5s, 4:5 intro. Three-panel opening -> panels merge into one shot -> slow dolly back
 * -> dissolves into (and ends exactly on) the site's static hero photo, so the page can
 * hand over to the photo without a visible cut.
 */
export function HeroIntro() {
  const frame = useCurrentFrame();

  // Opening split-screen: the centre panel is a window onto the main shot, so merging = widening the window.
  const merge = interpolate(frame, [46, 74], [0, 1], { ...clamp, easing: easeInOut });
  const inset = SIDE * (1 - merge);
  const sideShift = merge * 130;
  const sideOpacity = 1 - interpolate(frame, [46, 70], [0, 1], clamp);
  const dividerOpacity = 0.85 * (1 - interpolate(frame, [40, 62], [0, 1], clamp));

  // Camera: continuous slow pull-back with a barely-there handheld drift that settles before the end.
  const settle = 1 - interpolate(frame, [96, 112], [0, 1], clamp);
  const dolly = interpolate(frame, [0, 100], [1.2, 1.0], { ...clamp, easing: ease });
  const driftX = Math.sin(frame / 17) * 2.5 * settle;
  const driftY = Math.sin(frame / 13) * 3 * settle;
  const roll = Math.sin(frame / 40) * 0.15 * settle;

  // Panel-only camera moves.
  const faceScale = interpolate(frame, [0, 74], [1.0, 1.14], clamp);
  const eiffelScale = interpolate(frame, [0, 74], [1.18, 1.06], clamp);
  const eiffelShift = interpolate(frame, [0, 74], [0, -26], clamp);

  // Title card (over the centre panel).
  const titleIn = interpolate(frame, [8, 26], [0, 1], { ...clamp, easing: ease });
  const titleOut = 1 - interpolate(frame, [38, 54], [0, 1], clamp);
  const titleOpacity = titleIn * titleOut;
  const titleLift = interpolate(frame, [8, 26], [10, 0], { ...clamp, easing: ease });

  // Hand-off to the hero photo.
  const heroMix = interpolate(frame, [96, 116], [0, 1], { ...clamp, easing: easeInOut });
  const heroScale = interpolate(frame, [96, 116], [1.05, 1.0], { ...clamp, easing: easeInOut });
  const bloom = interpolate(frame, [96, 106, 118], [0, 0.32, 0], clamp);
  const grainFade = 1 - interpolate(frame, [104, 116], [0, 1], clamp);

  const fill = { width: "100%", height: "100%", objectFit: "cover" } as const;

  return (
    <AbsoluteFill style={{ background: "#050403", overflow: "hidden" }}>
      {/* Main shot: clipped to the centre window at first, then opens to full frame. */}
      <AbsoluteFill style={{ clipPath: `inset(0px ${inset}px 0px ${inset}px)` }}>
        <AbsoluteFill style={{ transform: `translate(${driftX}px, ${driftY}px) rotate(${roll}deg) scale(${dolly})`, transformOrigin: "50% 55%" }}>
          <Img src={mainShot} style={{ ...fill, objectPosition: "50% 50%" }} />
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Outer panels */}
      <div style={{ position: "absolute", left: 0, top: 0, width: SIDE, height: "100%", overflow: "hidden", opacity: sideOpacity, transform: `translateX(${-sideShift}px)` }}>
        <Img src={panelFace} style={{ ...fill, objectPosition: "57% 25%", transform: `scale(${faceScale})`, transformOrigin: "57% 30%" }} />
      </div>
      <div style={{ position: "absolute", right: 0, top: 0, width: SIDE, height: "100%", overflow: "hidden", opacity: sideOpacity, transform: `translateX(${sideShift}px)` }}>
        <Img src={panelEiffel} style={{ ...fill, objectPosition: "64% 40%", transform: `translateY(${eiffelShift}px) scale(${eiffelScale})`, transformOrigin: "64% 60%" }} />
      </div>

      {/* Hairline dividers */}
      {[SIDE - 1, 1080 - SIDE - 1].map((x) => (
        <div key={x} style={{ position: "absolute", top: 0, bottom: 0, left: x, width: 2, background: GOLD, opacity: dividerOpacity }} />
      ))}

      {/* Title card */}
      <AbsoluteFill style={{ opacity: titleOpacity }}>
        <div style={{ position: "absolute", left: SIDE, width: 1080 - SIDE * 2, bottom: 300, display: "flex", flexDirection: "column", alignItems: "center", transform: `translateY(${titleLift}px)`, textShadow: "0 2px 18px rgba(0,0,0,.65)" }}>
          <div style={{ position: "absolute", left: -40, right: -40, top: -90, bottom: -60, background: "radial-gradient(ellipse at center, rgba(0,0,0,.6), rgba(0,0,0,0) 70%)" }} />
          <Img src={logoMark} style={{ position: "relative", height: 92, marginBottom: 18 }} />
          <div style={{ position: "relative", fontFamily, fontWeight: 500, fontSize: 36, letterSpacing: "0.3em", color: GOLD, paddingLeft: "0.3em", whiteSpace: "nowrap" }}>LIONESS DRESS</div>
          <div style={{ position: "relative", fontFamily, fontWeight: 500, fontSize: 16, letterSpacing: "0.42em", color: GOLD, paddingLeft: "0.42em", marginTop: 10, whiteSpace: "nowrap" }}>PARIS FASHION WEEK</div>
        </div>
      </AbsoluteFill>

      {/* Vignette + film grain (both fade out so the last frame is the clean photo) */}
      <AbsoluteFill style={{ opacity: 0.55 * grainFade, background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,.65) 100%)" }} />
      <AbsoluteFill style={{ opacity: 0.11 * grainFade, mixBlendMode: "overlay" }}>
        <svg width="100%" height="100%">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={frame} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </AbsoluteFill>

      {/* Warm light bloom carrying the cut, then the hero photo settles in and holds */}
      <AbsoluteFill style={{ opacity: heroMix }}>
        <AbsoluteFill style={{ transform: `scale(${heroScale})`, transformOrigin: "50% 40%" }}>
          <Img src={heroPhoto} style={{ ...fill, objectPosition: "50% 50%" }} />
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: bloom, background: "radial-gradient(ellipse at 50% 45%, rgba(255,214,160,1), rgba(255,190,120,0) 70%)", mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
}
