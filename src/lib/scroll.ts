import type { MouseEvent } from "react";

/**
 * Click handler for links like /#collection. On the home page the router does nothing when the address already ends in
 * the same #hash, so the button looked dead; this scrolls to the block every time. On other pages it lets the router
 * navigate to the home page as usual.
 */
export function scrollToBlock(id: string) {
  return (event: MouseEvent<HTMLElement>) => {
    const target = document.getElementById(id);
    if (!target || window.location.pathname !== "/") return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `/#${id}`);
  };
}
