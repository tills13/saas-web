import "./index.scss"

import classnames from "classnames"
import React from "react"
import withClickOutside from "react-click-outside"
import { SketchPicker } from "react-color"
import { compose, defaultProps, mapProps, SetStateCallback, withState } from "recompose"

import TextInput from "../text_input"

interface ColorPickerInnerProps extends React.Props<any>, ColorPickerOuterProps {
  setShowColorPicker: SetStateCallback<boolean>
  showColorPicker: boolean
}

interface ColorPickerOuterProps {
  className?: string
  id?: string
  input?: any
  inputClassName?: string
  label?: string
  name?: string
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  placeholder?: string
  value?: any
}

class ColorPicker extends React.Component<ColorPickerInnerProps> {
  handleClickOutside = () => {
    this.props.setShowColorPicker(false)
  }

  onChangeColorPicker = ({ hex }) => {
    this.props.onChange(hex)
  }

  render () {
    const {
      className, id, inputClassName, label, onChange,
      showColorPicker, setShowColorPicker, value, ...rest
    } = this.props

    const mClassName = classnames("ColorPicker", className)
    const mInputClassName = classnames("ColorPicker__input", inputClassName)
    const swatchStyle = { background: value, backgroundColor: value }

    return (
      <div className="ColorPicker__container">
        { label && (
          <label className="ColorPicker__label" htmlFor={ id || name }>
            { label }
          </label>
        ) }
        <div className={ mClassName }>
          <TextInput
            className={ mInputClassName }
            id={ id }
            name={ name }
            value={ value }
            onChange={ onChange }
            { ...rest }
          />
          <div
            className="ColorPicker__swatch"
            style={ swatchStyle }
            onClick={ () => setShowColorPicker(!showColorPicker) }
          />
        </div>
        { showColorPicker && (
          <SketchPicker
            className="ColorPicker__picker"
            color={ value }
            disableAlpha={ true }
            onChangeComplete={ this.onChangeColorPicker }
          />
        ) }
      </div>
    )
  }
}

export default compose<ColorPickerInnerProps, ColorPickerOuterProps>(
  defaultProps({ value: "#114B5F" }),
  mapProps(({ input, onChange, value, ...rest }) => {
    return {
      input,
      onChange: input ? input.onChange : onChange,
      value: input ? input.value : value,
      ...rest
    }
  }),
  withState("showColorPicker", "setShowColorPicker", false),
  withClickOutside
)(ColorPicker)
