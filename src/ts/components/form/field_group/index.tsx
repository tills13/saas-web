import "./index.scss"

import classnames from "classnames"
import React from "react"

import { compose, defaultProps } from "recompose"

interface FieldGroupProps extends React.Props<any> {
  className?: string
  equalWidth?: boolean
  label?: string
  labelFor?: string
  vertical?: boolean
}

const FieldGroup = ({ children, className, equalWidth, label, labelFor, vertical }: FieldGroupProps) => {
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

export default compose<FieldGroupProps, FieldGroupProps>(
  defaultProps({ equalWidth: true })
)(FieldGroup)
