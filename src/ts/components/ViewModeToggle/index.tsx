import classnames from "classnames"
import React from "react"

import Toggle from "../toggle"

export enum ViewMode { List, Quilt }

interface ViewModeToggleProps extends React.AllHTMLAttributes<HTMLDivElement> {
  className?: string
  onSelectView: (selectedView: any) => void
  options?: { icon: string, key: any }[]
  selectedView: any
}

export const defaultViewOptions: ViewModeToggleProps[ "options" ] = [
  { icon: "view-list", key: ViewMode.List },
  { icon: "view-quilt", key: ViewMode.Quilt }
]

function ViewModeToggle ({ className, onSelectView, options = defaultViewOptions, selectedView }: ViewModeToggleProps) {
  const mClassName = classnames("ViewModeToggle", className)

  return (
    <Toggle
      className={ mClassName }
      options={ options }
      onSelectOption={ onSelectView }
      selectedOption={ selectedView }
    />
  )
}

export default ViewModeToggle


