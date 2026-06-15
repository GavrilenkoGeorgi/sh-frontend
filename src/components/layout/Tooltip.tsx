import React from 'react'
import {
  OverlayArrow,
  Tooltip as AriaTooltip,
  type TooltipProps as AriaTooltipProps,
  TooltipTrigger as AriaTooltipTrigger,
  type TooltipTriggerComponentProps as AriaTooltipTriggerProps
} from 'react-aria-components/Tooltip'
import { DialogTrigger, Popover, Dialog } from 'react-aria-components'
import * as styles from './Tooltip.module.sass'
import { useIsMobile } from '../../hooks/useIsMobile'

export interface TooltipProps extends Omit<AriaTooltipProps, 'children'> {
  children: React.ReactNode
}

function Arrow() {
  return (
    <OverlayArrow className={styles.reactAriaOverlayArrow}>
      <svg width={8} height={8} viewBox="0 0 8 8">
        <path d="M0 0 L4 4 L8 0" />
      </svg>
    </OverlayArrow>
  )
}

export function Tooltip({ children, ...props }: TooltipProps) {
  return (
    <AriaTooltip {...props} className={styles.reactAriaTooltip}>
      <Arrow />
      {children}
    </AriaTooltip>
  )
}

type TooltipTriggerComponentProps = Omit<
  AriaTooltipTriggerProps,
  'children'
> & {
  children: [React.ReactElement, React.ReactElement<TooltipProps>]
}

export function TooltipTrigger({
  children,
  ...props
}: TooltipTriggerComponentProps) {
  const isMobile = useIsMobile()
  const [trigger, tooltipElement] = children

  if (isMobile) {
    return (
      <DialogTrigger>
        {trigger}
        <Popover className={styles.reactAriaTooltip} placement="top" offset={0}>
          <Arrow />
          <Dialog aria-label="info">{tooltipElement?.props?.children}</Dialog>
        </Popover>
      </DialogTrigger>
    )
  }

  return <AriaTooltipTrigger {...props}>{children}</AriaTooltipTrigger>
}
