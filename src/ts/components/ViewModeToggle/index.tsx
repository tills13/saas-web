import classnames from "classnames"
import React from "react"

import Toggle from "../Toggle"

export enum ViewMode { List, Quilt }

interface ViewModeToggleProps extends React.AllHTMLAttributes<HTMLDivElement> {
  onSelectView: (selectedView: any) => void
  options?: { icon: string, key: any }[]
  selectedView: any
}

export const defaultViewOptions: ViewModeToggleProps[ "options" ] = [
  { icon: "view-list", key: ViewMode.List },
  { icon: "view-quilt", key: ViewMode.Quilt }
]

function ViewModeToggle ({ className, onSelectView, options, selectedView }: ViewModeToggleProps) {
  const mClassName = classnames("ViewModeToggle", className)
  const mOptions = options || defaultViewOptions

  return (
    <Toggle
      className={ mClassName }
      options={ mOptions! }
      onSelectOption={ onSelectView }
      selectedOption={ selectedView }
    />
  )
}

export default ViewModeToggle


