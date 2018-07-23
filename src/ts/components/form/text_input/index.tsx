import "./index.scss"

import classnames from "classnames"
import React from "react"
import { compose, mapProps } from "recompose"

interface TextInputInnerProps extends TextInputOuterProps {

}

interface TextInputOuterProps {
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
  textarea?: boolean
  type?: string
  value?: any
}

class TextInput extends React.Component<TextInputInnerProps> {
  renderField() {
    const { rows, textarea } = this.props

    if (rows || textarea) return this.renderTextArea()
    else return this.renderTextInput()
  }

  renderTextArea() {
    const { disabled, id, name, onBlur, onChange, placeholder, rows, value } = this.props

    return (
      <textarea
        id={ id }
        name={ name }
        onChange={ onChange }
        onBlur={ onBlur }
        placeholder={ placeholder }
        rows={ rows }
        value={ value }
        disabled={ disabled }
      />
    )
  }

  renderTextInput() {
    const { disabled, id, name, onBlur, onChange, placeholder, type, value } = this.props

    return (
      <input
        id={ id }
        name={ name }
        onChange={ onChange }
        onBlur={ onBlur }
        placeholder={ placeholder }
        value={ value }
        disabled={ disabled }
        type={ type || "text" }
      />
    )
  }

  render() {
    const {
      className,
      containerClassName,
      disabled,
      id,
      inline,
      label,
      name,
      rows,
      textarea
    } = this.props

    const mContainerClassName = classnames("TextInput__container", containerClassName, {
      "TextInput__container--inline": inline,
      "TextInput__container--disabled": disabled
    })

    const mClassName = classnames("TextInput", className, {
      "TextInput--disabled": disabled,
      "TextInput--textArea": textarea || rows != null
    })

    return (
      <div className={ mContainerClassName }>
        { label && <label className="TextInput__label" htmlFor={ id || name }>{ label }</label> }
        <div className={ mClassName }>
          { this.renderField() }
        </div>
      </div>
    )
  }
}

export default compose<TextInputInnerProps, TextInputOuterProps>(
  mapProps(({ label, inline, inlineLabel, input, ...rest }: TextInputOuterProps) => {
    return {
      label: inline || inlineLabel || label,
      inline: inline || inlineLabel,
      ...input,
      ...rest
    }
  })
)(TextInput)
