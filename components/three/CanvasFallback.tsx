/**
 * CanvasFallback — static CSS gradient/grid poster.
 * Shown when WebGL is unavailable, prefers-reduced-motion is set, or a scene error occurs.
 * No WebGL — intentional brand-tinted visual that fills its container.
 */
export function CanvasFallback() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 40%, oklch(0.72 0.19 145 / 0.12) 0%, transparent 70%), linear-gradient(160deg, oklch(0.16 0.01 260) 0%, oklch(0.12 0.02 240) 100%)',
        backgroundImage: `
          radial-gradient(ellipse 80% 60% at 50% 40%, oklch(0.72 0.19 145 / 0.12) 0%, transparent 70%),
          linear-gradient(160deg, oklch(0.16 0.01 260) 0%, oklch(0.12 0.02 240) 100%),
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 39px,
            oklch(0.72 0.19 145 / 0.04) 39px,
            oklch(0.72 0.19 145 / 0.04) 40px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 39px,
            oklch(0.72 0.19 145 / 0.04) 39px,
            oklch(0.72 0.19 145 / 0.04) 40px
          )
        `,
      }}
    />
  )
}
