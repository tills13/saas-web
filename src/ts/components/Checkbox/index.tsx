import "./index.scss"

import classnames from "classnames"
import React from "react"

import { mapProps } from "recompose"

import Icon from "../Icon"

interface CheckboxProps {
  check?: string
  checked?: boolean
  className?: string
  containerClassName?: string
  input?: any
  label?: string
  name?: string
  onChange?: (checked: boolean) => void
  value?: any
}

function Checkbox (props: CheckboxProps) {
  const { check, className, containerClassName, label, name, onChange, value } = props
  const mContainerClassName = classnames("Checkbox__container", containerClassName)
  const mClassName = classnames("Checkbox", className, { "Checkbox--checked": value })

  return (
    <label className={ mContainerClassName } htmlFor={ name }>
      <div className={ mClassName }>
        <Icon className="Checkbox__icon" icon={ check || "check" } />
        <input
          id={ name }
          checked={ value || false }
          name={ name }
          onChange={ event => onChange(event.target.checked) }
          type="checkbox"
        />
      </div>
      { label && <span className="Checkbox__label">{ label }</span> }
    </label>
  )
}

export default mapProps(function ({ input, value, ...rest }: CheckboxProps) {
  return { value: value || rest.checked, ...input, ...rest }
})(Checkbox)
