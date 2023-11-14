import React from 'react'
import type { PropsWithChildren, ReactElement } from 'react'
import { DragOverlay, defaultDropAnimationSideEffects } from '@dnd-kit/core'
import type { DropAnimation } from '@dnd-kit/core'

const dropAnimationConfig: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.4'
      }
    }
  })
}

export function SortableOverlay ({ children }: PropsWithChildren): ReactElement {
  return (
    <DragOverlay dropAnimation={dropAnimationConfig}>{children}</DragOverlay>
  )
}
