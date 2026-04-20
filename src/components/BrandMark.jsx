import React from 'react'

// SUMIMSA brand mark: uses the official PNG at public/assets/sumimsa-logo.png.
// Falls back to a typographic wordmark if the image fails to load.
export default function BrandMark({
  size = 'lg',         // 'sm' (header) | 'lg' (intro)
  caption = 'Dirección de Capital Humano',
  tone = 'ink',        // 'ink' (on light bg) | 'paper' (on dark bg)
}) {
  const isLg = size === 'lg'
  const onDark = tone === 'paper'
  const line = onDark ? 'bg-paper/90' : 'bg-ink'
  const subt = onDark ? 'text-paper/70' : 'text-muted'

  const src = `${import.meta.env.BASE_URL}assets/sumimsa-logo.png`

  return (
    <div className={`flex flex-col ${isLg ? 'gap-4' : 'gap-1.5'}`}>
      <LogoWithFallback
        src={src}
        alt="SUMIMSA — Un Solo Proveedor"
        className={`${isLg ? 'h-16 md:h-20' : 'h-9'} w-auto ${
          onDark ? 'brightness-0 invert' : ''
        }`}
        tone={tone}
        isLg={isLg}
      />
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

function LogoWithFallback({ src, alt, className, tone, isLg }) {
  const [failed, setFailed] = React.useState(false)
  if (failed) {
    const mark = tone === 'paper' ? 'text-paper' : 'text-ink'
    return (
      <span
        className={`${mark} font-sans font-extrabold uppercase leading-none ${
          isLg ? 'text-[44px]' : 'text-xl'
        }`}
        style={{ letterSpacing: isLg ? '0.22em' : '0.2em' }}
      >
        SUMIMSA
      </span>
    )
  }
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />
}
