import "./index.scss"

import classnames from "classnames"
import React from "react"

import Color from "enums/Color"

export interface ButtonProps extends React.AllHTMLAttributes<HTMLButtonElement> {
  block?: boolean
  className?: string
  color?: Color
  disabled?: boolean
  fill?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  small?: boolean
  tall?: boolean
  type?: string
}

function Button ({ block, children, className, color, disabled, fill, onClick, small, tall, type }: ButtonProps) {
  const mClassName = classnames("Button", color ? `Button--${ color }` : "Button--default", className, {
    "--block": block,
    "--disabled": disabled,
    "--fill": fill,
    "--small": small,
    "--tall": tall
  })

  const mOnClick = !disabled ? onClick : undefined

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

export default Button
