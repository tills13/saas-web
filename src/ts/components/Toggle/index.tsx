import "./index.scss"

import classnames from "classnames"
import React from "react"

import Icon from "../Icon"

export type Option<T = any> = { icon?: string | React.ReactElement<any>, key: T, label?: string }

interface ToggleProps<T = any> extends React.AllHTMLAttributes<HTMLDivElement> {
  onSelectOption: (key: T) => void
  options: Option<T>[]
  selectedOption: T
}

function Toggle ({ className, onSelectOption, options, selectedOption }: ToggleProps) {
  const mClassName = classnames("Toggle", className)

  return (
    <div className={ mClassName }>
      { options.map((option) => {
        const oClassName = classnames("Toggle__option", {
          "--active": option.key === selectedOption
        })

        return (
          <div
            key={ option.key }
            className={ oClassName }
            onClick={ (event) => onSelectOption(option.key) }
          >
            { option.icon && (typeof option.icon === "string" ? <Icon icon={ option.icon } /> : option.icon) }
            { option.label || option.key }
          </div>
        )
      }) }
    </div>
  )
}

export default Toggle
