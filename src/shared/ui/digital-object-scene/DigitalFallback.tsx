type DigitalFallbackProps = {
  variant: 'hero' | 'contact'
}

export function DigitalFallback({ variant }: DigitalFallbackProps) {
  if (variant === 'hero') {
    return (
      <div className="digital-fallback digital-fallback--hero" aria-hidden="true">
        <div className="digital-fallback__side digital-fallback__side--right" data-testid="hero-digital-right">
          <span />
        </div>
      </div>
    )
  }

  return (
    <div className={`digital-fallback digital-fallback--${variant}`} aria-hidden="true">
      <span />
      <i />
    </div>
  )
}
