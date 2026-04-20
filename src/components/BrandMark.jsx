import React from 'react'

// Text-first brand mark matching the intro reference. If you drop a real logo
// at public/assets/sumimsa-logo.png, pass `logoSrc` and it will be used instead.
export default function BrandMark({
  size = 'lg',         // 'sm' (header) | 'lg' (intro)
  caption = 'Dirección de Capital Humano',
  tone = 'ink',        // 'ink' (light bg) | 'paper' (dark bg)
  logoSrc,
}) {
  const isLg = size === 'lg'
  const onDark = tone === 'paper'
  const mark = onDark ? 'text-paper' : 'text-ink'
  const line = onDark ? 'bg-paper/90' : 'bg-ink'
  const subt = onDark ? 'text-paper/70' : 'text-muted'

  const finalSrc = logoSrc ?? `${import.meta.env.BASE_URL}assets/sumimsa-logo.png`

  return (
    <div className={`flex flex-col ${isLg ? 'gap-4' : 'gap-1.5'}`}>
      <div className="flex items-center gap-3">
        <LogoWithFallback
          src={finalSrc}
          alt="SUMIMSA"
          className={isLg ? 'h-16 w-auto' : 'h-8 w-auto'}
          fallback={
            <span
              className={`${mark} font-sans font-extrabold tracking-[0.24em] ${
                isLg ? 'text-4xl' : 'text-xl'
              }`}
              style={{ letterSpacing: isLg ? '0.22em' : '0.2em' }}
            >
              SUMIMSA
            </span>
          }
        />
      </div>
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

// Render the image; if it fails to load (no logo file yet), swap in fallback.
function LogoWithFallback({ src, alt, className, fallback }) {
  const [failed, setFailed] = React.useState(false)
  if (failed) return fallback
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  )
}
