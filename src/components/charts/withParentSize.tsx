import React, { type ReactElement, type ComponentType } from 'react'
import { ParentSize } from '@visx/responsive'

interface ChildrenProps {
  parentHeight: number
  parentWidth: number
}

export interface WithParentSizeProps {
  className?: string
}

// eslint-disable-next-line
export function withParentSize<Props extends {}> (
  Component: ComponentType<Props & ChildrenProps>,
  withParentSizeProps?: WithParentSizeProps
) {
  function Wrapped (props: Omit<Props, keyof ChildrenProps>): ReactElement {
    return (
      <ParentSize {...withParentSizeProps}>
        {(parent) => {
          return parent.height === 0 || parent.width === 0
            ? null
            : React.createElement(Component, { ...(props as Props), parentHeight: parent.height, parentWidth: parent.width })
        }}
      </ParentSize>
    )
  }

  return Wrapped
}
