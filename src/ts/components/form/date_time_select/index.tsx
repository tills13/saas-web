import "./index.scss"

import * as classnames from "classnames"
import * as React from "react"
import { compose, mapProps } from "recompose"

interface DateTimeSelectInnerProps extends DateTimeSelectOuterProps {

}

interface DateTimeSelectOuterProps {
  className?: string
  containerClassName?: string
  disabled?: boolean
  id?: string
  inline?: boolean
  inlineLabel?: string
  input?: any
  label?: string
  name?: string
  onBlur?: React.EventHandler<any>
  onChange?: React.EventHandler<any>
  placeholder?: string
  rows?: number
  split?: boolean
  type?: string
  value?: any
}

class DateTimeSelect extends React.Component<DateTimeSelectInnerProps> {
  renderDateField () {
    const { disabled, id, name, onBlur, onChange, placeholder, type, value } = this.props

    const mOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const mValue = event.target.value
      onChange([mValue, value[1]])
    }

    return (
      <div className="DateTimeSelect__field">
        <input
          id={ id }
          name={ name }
          onChange={ mOnChange }
          placeholder={ placeholder }
          value={ value[0] }
          disabled={ disabled }
          type="date"
        />
      </div>
    )
  }

  renderTimeField () {
    const { disabled, id, name, onBlur, onChange, placeholder, type, value } = this.props

    const mOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const mValue = event.target.value
      onChange([value[0], mValue])
    }

    return (
      <div className="DateTimeSelect__field">
        <input
          id={ id }
          name={ name }
          onChange={ mOnChange }
          placeholder={ placeholder }
          value={ value[1] }
          disabled={ disabled }
          type="time"
        />
      </div>
    )
  }

  render () {
    const {
      className,
      containerClassName,
      disabled,
      id,
      inline,
      label,
      name,
      rows,
      split
    } = this.props

    const mContainerClassName = classnames("DateTimeSelect__container", containerClassName, {
      "DateTimeSelect__container--inline": inline,
      "DateTimeSelect__container--disabled": disabled
    })

    const mClassName = classnames("DateTimeSelect", className, {
      "DateTimeSelect--disabled": disabled,
      "DateTimeSelect--split": split
    })

    return (
      <div className={ mContainerClassName }>
        { label && <label className="DateTimeSelect__label" htmlFor={ id || name }>{ label }</label> }
        <div className={ mClassName }>
          { this.renderDateField() }
          { this.renderTimeField() }
        </div>
      </div>
    )
  }
}

export default compose<DateTimeSelectInnerProps, DateTimeSelectOuterProps>(
  mapProps(({ label, inline, inlineLabel, input, ...rest }: DateTimeSelectOuterProps) => {
    const value = rest.value || input.value || ["", ""]

    return {
      label: inline || inlineLabel || label,
      inline: inline || inlineLabel,
      ...input,
      ...rest,
      value
    }
  })
)(DateTimeSelect)
