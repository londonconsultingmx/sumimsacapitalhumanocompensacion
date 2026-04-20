import React from 'react'

// Typographic brand mark: "SUMIMSA" wordmark + accent line + caption.
// Matches the "Marca placeholder — SUMIMSA en tipografía" approach from the
// intro reference design.
export default function BrandMark({
  size = 'lg',         // 'sm' (header) | 'lg' (intro)
  caption = 'Dirección de Capital Humano',
  tone = 'ink',        // 'ink' (on light bg) | 'paper' (on dark bg)
}) {
  const isLg = size === 'lg'
  const onDark = tone === 'paper'
  const mark = onDark ? 'text-paper' : 'text-ink'
  const line = onDark ? 'bg-paper/90' : 'bg-ink'
  const subt = onDark ? 'text-paper/70' : 'text-muted'

  return (
    <div className={`flex flex-col ${isLg ? 'gap-4' : 'gap-1.5'}`}>
      <span
        className={`${mark} font-sans font-extrabold uppercase leading-none ${
          isLg ? 'text-[44px]' : 'text-xl'
        }`}
        style={{ letterSpacing: isLg ? '0.22em' : '0.2em' }}
      >
        SUMIMSA
      </span>
      <div className={`${line} ${isLg ? 'h-[2px] w-64' : 'h-px w-24'} line-grow`} />
      {caption && (
        <div
          className={`${subt} font-mono uppercase tracking-[0.18em] ${
            isLg ? 'text-[11px]' : 'text-[10px]'
          }`}
        >
          {caption}
        </div>
      )}
    </div>
  )
}
