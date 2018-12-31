import "./index.scss"

import classnames from "classnames"
import React from "react"

import Button, { ButtonProps } from "../Button"
import Icon from "../Icon"

export interface IconButtonProps extends ButtonProps {
  icon: string
}

function IconButton ({ children, className, icon, ...rest }: IconButtonProps) {
  const mClassName = classnames("IconButton", className)

  return (
    <Button className={ mClassName } { ...rest }>
      <Icon icon={ icon } />
    </Button>
  )
}

export default IconButton

