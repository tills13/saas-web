import "./selected_value.scss"

import React from "react"

import Icon from "../Icon"

interface SelectedValueProps extends React.Props<any> {
  label?: string
  unselect: (event: React.MouseEvent<any>) => void
}

function SelectedValue ({ children, label, unselect }: SelectedValueProps) {
  return (
    <div className="SelectedValue" onClick={ unselect }>
      { label || children }
      <Icon
        className="SelectedValue__icon"
        icon="times"
      />
    </div>
  )
}

export default SelectedValue
