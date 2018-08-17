import classnames from "classnames"
import React from "react"

import Toggle from "../toggle"

export enum ViewMode { List, Quilt }

interface ViewModeToggleProps<T = ViewMode> extends React.AllHTMLAttributes<HTMLDivElement> {
  className?: string
  onSelectView: (selectedView: T) => void
  options?: { icon: string, key: T }[]
  selectedView: T
}

export const defaultViewOptions: ViewModeToggleProps<ViewMode>[ "options" ] = [
  { icon: "view-list", key: ViewMode.List },
  { icon: "view-quilt", key: ViewMode.Quilt }
]

function ViewModeToggle<T> ({ className, onSelectView, options = defaultViewOptions, selectedView }: ViewModeToggleProps<T>) {
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


