import "./option.scss"

import classnames from "classnames"
import { isFunction } from "lodash"
import React from "react"

import { Option } from "."

interface SelectOptionProps extends Option {
  className?: string
  disabled?: boolean
  onClick: (value: any) => void
  selected: boolean
  showValue?: boolean
}

export default function SelectOption ({ className, disabled, label, onClick, selected, showValue, value }: SelectOptionProps) {
  const mClassName = classnames("SelectOption", className, {
    "--disabled": disabled,
    "--selected": selected
  })

  const mOnClick = !(selected || disabled)
    ? () => onClick(value)
    : null

  const mLabel = isFunction(label) ? label(value) : label

  return (
    <div className={ mClassName } onClick={ mOnClick }>
      <div className="SelectOption__label">{ mLabel }</div>
      { showValue && <div className="SelectOption__value">({ value })</div> }
    </div>
  )
}
