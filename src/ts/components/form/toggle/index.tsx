import "./index.scss"

import classnames from "classnames"
import React from "react"
import { compose, mapProps } from "recompose"

type ToggleOption<T = any> = {
  className?: string
  label?: string
  value: T
}

interface ToggleProps<T = any> {
  className?: string
  compact?: boolean
  disabled?: boolean
  isSwitch?: boolean
  onToggle: (value: T) => void
  options: ToggleOption<T>[]
  selectedValue: T
  toggleClassName?: string
}

/**
 * Toggle
 * renders an iOS style toggle. State is tracked in the parent component
 *
 * options: labels for values are optional - in which case just the toggle will be rendered
 */
class Toggle extends React.Component<ToggleProps> {
  static defaultProps = {
    onToggle: (value) => { console.log(`onToggle not implemented; value: ${ value }`) },
    options: [
      { value: false, label: "Off" },
      { value: true, label: "On" }
    ],
    selectedValue: false
  }

  mOnToggle = (nextValue?) => {
    const { disabled, isSwitch, onToggle, options, selectedValue } = this.props

    const mNextValue = (nextValue != null && !isSwitch) ? nextValue : (
      selectedValue === options[0].value
        ? options[1].value
        : options[0].value
    )

    if (!disabled) onToggle(mNextValue)
  }

  renderOption = (option: ToggleOption) => {
    const { className: optionClassName, label, value } = option
    const { disabled, selectedValue } = this.props

    if (!label) return null

    const onClick = disabled ? null : () => this.mOnToggle(value)
    const mOptionClassName = classnames("Toggle__option", optionClassName, {
      "Toggle__option--selected": selectedValue === value
    })

    return <span className={ mOptionClassName } onClick={ onClick }>{ label }</span>
  }

  render () {
    const { className, compact, disabled, options, selectedValue, isSwitch, toggleClassName } = this.props

    const mClassName = classnames("Toggle", className, {
      "Toggle--compact": !!compact,
      "Toggle--disabled": !!disabled,
      "Toggle--switch": !!isSwitch
    })

    const mToggleClassName = classnames("Toggle__toggle", toggleClassName, {
      "Toggle__toggle--toggled": selectedValue === options[1].value
    })

    return (
      <div className={ mClassName }>
        { this.renderOption(options[0]) }
        <div className={ mToggleClassName } onClick={ () => this.mOnToggle() }>
          <span />
        </div>
        { this.renderOption(options[1]) }
      </div>
    )
  }
}

export default Toggle
