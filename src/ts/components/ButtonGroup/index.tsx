import "./index.scss"

import classnames from "classnames"
import React from "react"

interface ButtonGroupProps extends React.AllHTMLAttributes<HTMLDivElement> {
  block?: boolean
}

function ButtonGroup ({ block, children, className }: ButtonGroupProps) {
  const mClassName = classnames("ButtonGroup", className, {
    "--block": block
  })

  return (
    <div className={ mClassName }>
      { children }
    </div>
  )
}

export default ButtonGroup
