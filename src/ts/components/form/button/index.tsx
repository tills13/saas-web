import "./index.scss"

import * as classnames from "classnames"
import * as React from "react"
import { compose, defaultProps, hoistStatics } from "recompose"

export interface ButtonProps extends React.Props<any> {
  block?: boolean
  className?: string
  color?: string
  disabled?: boolean
  fill?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  small?: boolean
  tall?: boolean
  type?: string
}

export class Button extends React.Component<ButtonProps> {
  public static COLOR_BLUE = "blue"
  public static COLOR_GREEN = "green"
  public static COLOR_RED = "red"

  render() {
    const { block, children, className, color, disabled, fill, onClick, small, tall, type } = this.props

    const mClassName = classnames("Button", color ? `Button--${ color }` : "Button--default", className, {
      "Button--block": block,
      "Button--disabled": disabled,
      "Button--fill": fill,
      "Button--small": small,
      "Button--tall": tall
    })

    const mOnClick = !disabled ? onClick : null

    return (
      <button
        className={ mClassName }
        onClick={ mOnClick }
        type={ type || "submit" }
      >
        { children }
      </button>
    )
  }
}

// export default hoistStatics(Button)
export default Button
