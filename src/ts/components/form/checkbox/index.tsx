import "./index.scss"

import * as classnames from "classnames"
import * as React from "react"

import { compose, mapProps } from "recompose"

import Icon from "components/icon"

interface CheckboxInnerProps extends React.Props<any>, CheckboxOuterProps {

}

interface CheckboxOuterProps {
  check?: string
  checked?: boolean
  className?: string
  containerClassName?: string
  input?: any
  label?: string
  name?: string
  onChange: React.ChangeEventHandler<any>
  value?: any
}

const Checkbox = (props: CheckboxInnerProps) => {
  const { check, checked, className, containerClassName, label, name, onChange } = props
  const mContainerClassName = classnames("Checkbox__container", containerClassName)
  const mClassName = classnames("Checkbox", className, {
    "Checkbox--checked": checked
  })

  //onClick={ () => onChange(!checked) }

  return (
    <div className={ mContainerClassName } >
      <div className={ mClassName }>
        <Icon className="Checkbox__icon" icon={ check || "check" } />
      </div>
      { label && <div className="Checkbox__label">{ label }</div> }
    </div>
  )
}

export default compose<CheckboxInnerProps, CheckboxOuterProps>(
  mapProps(({ input, value, ...rest }: CheckboxOuterProps) => {
    return { checked: !!(value || (input && input.value) || rest.checked), ...input, ...rest }
  })
)(Checkbox)
