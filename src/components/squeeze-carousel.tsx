import { useEffect, useId, useMemo, useState, type KeyboardEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { GalleryItem } from '@envitepkg/template-sdk';

type SqueezeCarouselProps = {
  slides: GalleryItem[];
  label: string;
  previousLabel: string;
  nextLabel: string;
  autoplay?: boolean;
  interval?: number;
};

const wrap = (index: number, count: number) => ((index % count) + count) % count;

export function SqueezeCarousel({
  slides,
  label,
  previousLabel,
  nextLabel,
  autoplay = true,
  interval = 6000,
}: SqueezeCarouselProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const panelId = useId();
  const count = slides.length;

  useEffect(() => {
    if (active >= count) setActive(0);
  }, [active, count]);

  useEffect(() => {
    if (!autoplay || paused || reducedMotion || count < 2) return;
    const timer = window.setTimeout(() => setActive((index) => wrap(index + 1, count)), interval);
    return () => window.clearTimeout(timer);
  }, [active, autoplay, count, interval, paused, reducedMotion]);

  const orderedSlides = useMemo(
    () => slides.map((_, offset) => {
      const index = wrap(active + offset, count);
      return { slide: slides[index], index, position: offset };
    }),
    [active, count, slides],
  );

  if (!count) return null;

  const move = (by: number) => setActive((index) => wrap(index + by, count));
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  };

  return (
    <div
      className="squeeze-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="squeeze-carousel__topline">
        <p>{label}</p>
        {count > 1 && (
          <div className="squeeze-carousel__controls">
            <button type="button" onClick={() => move(-1)} aria-label={previousLabel}>
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" onClick={() => move(1)} aria-label={nextLabel}>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </div>

      <div
        className="squeeze-carousel__track"
        role="tablist"
        aria-label={label}
        aria-orientation="horizontal"
        onKeyDown={onKeyDown}
      >
        {orderedSlides.map(({ slide, index, position }) => {
          const isActive = position === 0;
          const flexGrow = isActive ? 7 : Math.max(0.35, 2.2 - position * 0.55);

          return (
            <motion.button
              layout
              initial={false}
              animate={{ flexGrow }}
              transition={{ duration: reducedMotion ? 0 : 1, ease: [0.16, 1, 0.3, 1] }}
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              aria-label={slide.alt || `${label} ${index + 1}`}
              tabIndex={isActive ? 0 : -1}
              className={`squeeze-carousel__slide${isActive ? ' is-active' : ''}`}
              onClick={() => setActive(index)}
            >
              <img src={slide.src} alt={slide.alt || ''} draggable={false} loading="lazy" />
              <span className="squeeze-carousel__shade" />
              <span className="squeeze-carousel__number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div id={panelId} className="squeeze-carousel__caption" role="tabpanel" aria-live="polite">
        <p>{slides[active]?.alt || label}</p>
        <span>{String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}</span>
      </div>
    </div>
  );
}
