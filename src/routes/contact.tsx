import { createFileRoute } from "@tanstack/react-router";
import { Check, Copy, Instagram, Mail, MessageCircle } from "lucide-react";
import { useState } from "react";
import { ContentPage } from "@/components/content-page";
import { useI18n } from "@/lib/i18n";

const EMAIL = "info@lionessdress.com";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact Us — Lioness Dress" }] }),
  component: Contact,
});

function Contact() {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  // The mail link needs a mail app on the device; copying the address works everywhere (also inside Instagram/Telegram).
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      window.prompt(t("contact.copy"), EMAIL);
    }
  };

  return (
    <ContentPage titleKey="footer.contact">
      <p className="content-page__intro">{t("contact.intro")}</p>
      <div className="contact-list">
        <a className="contact-card" href="https://wa.me/77789654642" target="_blank" rel="noopener noreferrer">
          <MessageCircle aria-hidden="true" />
          <span><strong>WhatsApp</strong><small>+7 778 965 4642</small></span>
        </a>
        <div className="contact-card contact-card--split">
          <a href={`mailto:${EMAIL}`}>
            <Mail aria-hidden="true" />
            <span><strong>{t("contact.email")}</strong><small>{EMAIL}</small></span>
          </a>
          <button type="button" onClick={copyEmail} aria-live="polite">
            {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
            {copied ? t("contact.copied") : t("contact.copy")}
          </button>
        </div>
        <a className="contact-card" href="https://www.instagram.com/lioness.dress" target="_blank" rel="noopener noreferrer">
          <Instagram aria-hidden="true" />
          <span><strong>Instagram</strong><small>@lioness.dress</small></span>
        </a>
      </div>
    </ContentPage>
  );
}
