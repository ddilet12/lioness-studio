import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Props = {
  images: string[];
  /** Index of the photo that is open, or null when closed. */
  index: number | null;
  label: string;
  onClose: () => void;
  onChange: (index: number) => void;
};

/**
 * Full-screen photo viewer for product pages. Click (or tap) the photo to zoom in on that spot, click again to
 * zoom out; while zoomed, drag/scroll to move around. Arrows or the keyboard switch between photos.
 */
export function ImageLightbox({ images, index, label, onClose, onChange }: Props) {
  const [zoomed, setZoomed] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const open = index !== null;
  const count = images.length;

  useEffect(() => setZoomed(false), [index]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (count > 1 && event.key === "ArrowRight") onChange(((index ?? 0) + 1) % count);
      if (count > 1 && event.key === "ArrowLeft") onChange(((index ?? 0) - 1 + count) % count);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, index, count, onClose, onChange]);

  if (index === null) return null;

  const toggleZoom = (event: MouseEvent<HTMLImageElement>) => {
    if (zoomed) {
      setZoomed(false);
      return;
    }
    const box = scroller.current;
    const rect = event.currentTarget.getBoundingClientRect();
    const fx = (event.clientX - rect.left) / rect.width;
    const fy = (event.clientY - rect.top) / rect.height;
    setZoomed(true);
    // After the photo has grown, bring the spot that was clicked to the middle of the screen.
    requestAnimationFrame(() => {
      if (!box) return;
      box.scrollLeft = fx * box.scrollWidth - box.clientWidth / 2;
      box.scrollTop = fy * box.scrollHeight - box.clientHeight / 2;
    });
  };

  const button = "fixed z-[110] flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur hover:bg-black/75";

  return (
    <div role="dialog" aria-modal="true" aria-label={label} className="fixed inset-0 z-[100] bg-black/95">
      <div ref={scroller} className="absolute inset-0 overflow-auto" style={{ touchAction: "pan-x pan-y pinch-zoom" }}>
        <div className={zoomed ? "w-[230vw] md:w-[160vw]" : "flex h-full w-full items-center justify-center"}>
          <img
            src={images[index]}
            alt={label}
            onClick={toggleZoom}
            draggable={false}
            className={zoomed ? "block h-auto w-full cursor-zoom-out select-none" : "max-h-full max-w-full cursor-zoom-in select-none object-contain"}
          />
        </div>
      </div>
      <button type="button" aria-label="Close" onClick={onClose} className={`${button} right-4 top-4`}>
        <X className="h-5 w-5" />
      </button>
      {count > 1 && (
        <>
          <button type="button" aria-label="Previous photo" onClick={() => onChange((index - 1 + count) % count)} className={`${button} left-4 top-1/2 -translate-y-1/2`}>
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" aria-label="Next photo" onClick={() => onChange((index + 1) % count)} className={`${button} right-4 top-1/2 -translate-y-1/2`}>
            <ChevronRight className="h-5 w-5" />
          </button>
          <span className="fixed bottom-4 left-1/2 z-[110] -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-xs text-white">
            {index + 1} / {count}
          </span>
        </>
      )}
    </div>
  );
}
