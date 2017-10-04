import "./index.scss"

import * as classnames from "classnames"
import * as React from "react"
import { SketchPicker } from "react-color"
import { compose, defaultProps, mapProps, SetStateCallback, withState } from "recompose"

import TextInput from "components/form/text_input"

interface ColorPickerInnerProps extends React.Props<any>, ColorPickerOuterProps {
  setShowColorPicker: SetStateCallback<boolean>
  showColorPicker: boolean
}

export type ColorChangeHandler =
  (newValue: string) => void |
    React.ChangeEventHandler<any>

interface ColorPickerOuterProps {
  className?: string
  id?: string
  input?: any
  inputClassName?: string
  label?: string
  name?: string
  onChange?: ColorChangeHandler
  placeholder?: string
  value?: any
}

const ColorPicker = ({
  className,
  id,
  inputClassName,
  label,
  name,
  onChange,
  setShowColorPicker,
  showColorPicker,
  value,
  ...rest
}: ColorPickerInnerProps) => {
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
          onChangeComplete={ ({ hex }) => onChange(hex) }
        />
      ) }
    </div>
  )
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
  withState("showColorPicker", "setShowColorPicker", false)
)(ColorPicker)
