import { AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/CormorantGaramond";
import walk from "../assets/ai-walk.mp4";
import heroPhoto from "../assets/hero.jpg";
import logoMark from "../assets/logo-mark.svg";

const { fontFamily } = loadFont("normal", { weights: ["500"], subsets: ["latin"] });

export const HERO_WALK = { width: 1080, height: 1350, fps: 24, durationInFrames: 158 } as const;

const GOLD = "#D8AC6A";
const easeInOut = Easing.inOut(Easing.cubic);
const ease = Easing.bezier(0.2, 0.7, 0.2, 1);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/**
 * AI-generated 9:16 runway walk, framed into the site's 4:5 hero, then dissolved into (and ending on)
 * the static hero photo so the page hands over with a plain cross-fade.
 */
export function HeroWalk() {
  const frame = useCurrentFrame();

  // The source is 1080x1920; slide a 1080x1350 window down->up so it follows the model, at native sharpness.
  const top = interpolate(frame, [0, 130], [330, 120], { ...clamp, easing: easeInOut });

  // Title card, lower third.
  const titleIn = interpolate(frame, [14, 36], [0, 1], { ...clamp, easing: ease });
  const titleOut = 1 - interpolate(frame, [70, 92], [0, 1], clamp);
  const titleLift = interpolate(frame, [14, 36], [10, 0], { ...clamp, easing: ease });

  // Hand-off to the hero photo.
  const heroMix = interpolate(frame, [124, 148], [0, 1], { ...clamp, easing: easeInOut });
  const heroScale = interpolate(frame, [124, 148], [1.05, 1.0], { ...clamp, easing: easeInOut });
  const bloom = interpolate(frame, [124, 136, 150], [0, 0.3, 0], clamp);

  const fill = { width: "100%", height: "100%", objectFit: "cover" } as const;

  return (
    <AbsoluteFill style={{ background: "#050403", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transform: `translateY(${-top}px)` }}>
        <OffthreadVideo src={walk} muted style={{ width: 1080, height: 1920 }} />
      </div>

      <AbsoluteFill style={{ opacity: titleIn * titleOut }}>
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 70, display: "flex", flexDirection: "column", alignItems: "center", transform: `translateY(${titleLift}px)`, textShadow: "0 2px 18px rgba(0,0,0,.7)" }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: -130, bottom: -70, background: "linear-gradient(0deg, rgba(0,0,0,.7), rgba(0,0,0,0))" }} />
          <Img src={logoMark} style={{ position: "relative", height: 76, marginBottom: 14 }} />
          <div style={{ position: "relative", fontFamily, fontWeight: 500, fontSize: 34, letterSpacing: "0.3em", color: GOLD, paddingLeft: "0.3em", whiteSpace: "nowrap" }}>LIONESS DRESS</div>
          <div style={{ position: "relative", fontFamily, fontWeight: 500, fontSize: 16, letterSpacing: "0.42em", color: GOLD, paddingLeft: "0.42em", marginTop: 8, whiteSpace: "nowrap" }}>PARIS FASHION WEEK</div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: heroMix }}>
        <AbsoluteFill style={{ transform: `scale(${heroScale})`, transformOrigin: "50% 40%" }}>
          <Img src={heroPhoto} style={{ ...fill, objectPosition: "50% 50%" }} />
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: bloom, background: "radial-gradient(ellipse at 50% 45%, rgba(255,214,160,1), rgba(255,190,120,0) 70%)", mixBlendMode: "screen" }} />
    </AbsoluteFill>
  );
}
