import type { MouseEvent } from "react";

/**
 * Click handler for links like /#collection. On the home page the router does nothing when the address already ends in
 * the same #hash, so a repeated click looked dead; in that case the block is scrolled to by hand. The first click (and
 * clicks from other pages) is left to the router, which navigates and scrolls as usual.
 */
export function scrollToBlock(id: string) {
  return (event: MouseEvent<HTMLElement>) => {
    const target = document.getElementById(id);
    if (!target || window.location.pathname !== "/" || window.location.hash !== `#${id}`) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  };
}
