import { Children, cloneElement, Fragment, isValidElement, type ReactNode } from "react";

const EMAIL = "info@lionessdress.com";
const WHATSAPP_URL = "https://wa.me/77789654642";
const INSTAGRAM_URL = "https://www.instagram.com/lioness.dress/";

// Longest alternatives first; the capture group keeps the matched text when splitting.
const CONTACT_PATTERN = /(info@lionessdress\.com|WhatsApp|Instagram|\+7[\s\d-]{9,}\d)/g;

function hrefFor(match: string): string {
  if (match === EMAIL) return `mailto:${EMAIL}`;
  if (match === "WhatsApp") return WHATSAPP_URL;
  if (match === "Instagram") return INSTAGRAM_URL;
  return `tel:+${match.replace(/\D/g, "")}`;
}

/** Turns the email, WhatsApp, Instagram and phone numbers inside a plain string into real links. */
export function Linkified({ text }: { text: string }) {
  return (
    <>
      {text.split(CONTACT_PATTERN).map((part, index) => {
        if (index % 2 === 0) return <Fragment key={index}>{part}</Fragment>;
        const href = hrefFor(part);
        const external = href.startsWith("http");
        return (
          <a key={index} href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
            {part}
          </a>
        );
      })}
    </>
  );
}

/** Walks a React tree and linkifies every plain-text child, leaving existing links and components alone. */
export function linkifyChildren(node: ReactNode): ReactNode {
  return Children.map(node, (child) => {
    if (typeof child === "string") return <Linkified text={child} />;
    if (isValidElement<{ children?: ReactNode }>(child) && typeof child.type === "string" && child.type !== "a") {
      return cloneElement(child, undefined, linkifyChildren(child.props.children));
    }
    return child;
  });
}
