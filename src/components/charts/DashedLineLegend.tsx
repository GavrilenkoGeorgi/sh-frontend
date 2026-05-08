type DashedLineLegendProps = {
  className?: string
  color?: string
  strokeWidth?: number
  dashLength?: number
  gapLength?: number
  dashOffset?: number
  lineCap?: 'butt' | 'round' | 'square'
  ariaLabel?: string
}

export const DashedLineLegend = ({
  className,
  color = 'var(--color-primary-muted)',
  strokeWidth = 1,
  dashLength = 6,
  gapLength = 4,
  dashOffset = 0,
  lineCap = 'butt',
  ariaLabel = 'Dashed line legend'
}: DashedLineLegendProps) => {
  const dashArray = `${dashLength} ${gapLength}`

  return (
    <svg
      className={className}
      width="100%"
      height={Math.max(strokeWidth, 1)}
      viewBox="0 0 100 1"
      preserveAspectRatio="none"
      role="img"
      aria-label={ariaLabel}
      focusable="false"
      style={{
        display: 'block',
        overflow: 'visible'
      }}
    >
      <line
        x1="0"
        y1="0.5"
        x2="100"
        y2="0.5"
        vectorEffect="non-scaling-stroke"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        strokeDashoffset={dashOffset}
        strokeLinecap={lineCap}
      />
    </svg>
  )
}
