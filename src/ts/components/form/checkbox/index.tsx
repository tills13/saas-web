import "./index.scss"

import classnames from "classnames"
import React from "react"

import { compose, mapProps } from "recompose"

import Icon from "../../icon"

interface CheckboxInnerProps extends React.Props<any>, CheckboxOuterProps {
  meta?: any
}

interface CheckboxOuterProps {
  check?: string
  checked?: boolean
  className?: string
  containerClassName?: string
  input?: any
  label?: string
  name?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  value?: any
}

const Checkbox = (props: CheckboxInnerProps) => {
  const { check, checked, className, containerClassName, label, meta, ...rest } = props
  const mContainerClassName = classnames("Checkbox__container", containerClassName)
  const mClassName = classnames("Checkbox", className, {
    "Checkbox--checked": checked
  })

  return (
    <label className={ mContainerClassName } htmlFor={ rest.name }>
      <div className={ mClassName }>
        <Icon className="Checkbox__icon" icon={ check || "check" } />
        <input id={ rest.name } type="checkbox" checked={ checked } { ...rest } />
      </div>
      { label && <span className="Checkbox__label">{ label }</span> }
    </label>
  )
}

export default compose<CheckboxInnerProps, CheckboxOuterProps>(
  mapProps(({ input, value, ...rest }: CheckboxOuterProps) => {
    return { checked: !!(value || (input && input.value) || rest.checked), ...input, ...rest }
  })
)(Checkbox)
