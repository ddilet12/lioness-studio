import { Composition } from "remotion";
import { ExampleFade } from "./compositions/ExampleFade";
import { HERO_INTRO, HeroIntro } from "./compositions/HeroIntro";
import { HERO_WALK, HeroWalk } from "./compositions/HeroWalk";

/**
 * Registers every Remotion composition so they're visible in Remotion
 * Studio (`npm run remotion`) for building/previewing, and so they can
 * later be embedded on the site via <Player component={...} />.
 *
 * None of these are wired into the live site yet — this is scaffolding
 * only, per the current task.
 */
export function RemotionRoot() {
  return (
    <>
      <Composition
        id="ExampleFade"
        component={ExampleFade}
        durationInFrames={60}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition id="HeroIntro" component={HeroIntro} {...HERO_INTRO} />
      <Composition id="HeroWalk" component={HeroWalk} {...HERO_WALK} />
    </>
  );
}
