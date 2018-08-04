import "./icon_button.scss"

import classnames from "classnames"
import React from "react"

import { ButtonProps, default as Button } from "../form/button"
import Icon from "../icon"

export interface IconButtonProps extends ButtonProps {
  icon: string
}

type IconOffsetType = { [ icon: string ]: React.CSSProperties }
export const OFFSET_FIXES: IconOffsetType = {
  // "chevron-left": { position: "relative", left: "-2px" }
}

export const IconButton = ({ children, className, icon, ...rest }: IconButtonProps) => {
  const mClassName = classnames("IconButton", className)

  return (
    <Button className={ mClassName } { ...rest }>
      <Icon icon={ icon } style={ OFFSET_FIXES[ icon ] } />
    </Button>
  )
}

export default IconButton

