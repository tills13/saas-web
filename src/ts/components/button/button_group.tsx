import "./button_group.scss"

import classnames from "classnames"
import React from "react"

interface ButtonGroupProps extends React.Props<any> {
  block?: boolean
  className?: string
}

const ButtonGroup = ({ block, children, className }: ButtonGroupProps) => {
  const mClassName = classnames("ButtonGroup", className, {
    "ButtonGroup--block": block
  })

  return (
    <div className={ mClassName }>
      { children }
    </div>
  )
}

export default ButtonGroup
