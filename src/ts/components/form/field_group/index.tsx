import "./index.scss"

import classnames from "classnames"
import React from "react"

interface FieldGroupProps extends React.AllHTMLAttributes<HTMLDivElement> {
  equalWidth?: boolean
  label?: string
  labelFor?: string
  vertical?: boolean
}

function FieldGroup ({ children, className, equalWidth = true, label, labelFor, vertical }: FieldGroupProps) {
  const mClassName = classnames("FieldGroup", className, {
    "FieldGroup--equalWidth": equalWidth,
    "FieldGroup--vertical": vertical
  })

  return (
    <div className="FieldGroup__container">
      { label && <label className="FieldGroup__label" htmlFor={ labelFor }>{ label }</label> }
      <div className={ mClassName }>
        { children }
      </div>
    </div>
  )
}

export default FieldGroup
