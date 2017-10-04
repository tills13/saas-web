import "./icon_button.scss"

import * as classnames from "classnames"
import * as React from "react"

import { ButtonProps, default as Button } from "components/form/button"
import Icon from "components/icon"

interface IconButtonProps extends ButtonProps {
  icon: string
}

type IconOffsetType = { [icon: string]: React.CSSProperties }
const OFFSET_FIXES: IconOffsetType = {
  // "chevron-left": { position: "relative", left: "-2px" }
}

const IconButton = ({ children, className, icon, ...rest }: IconButtonProps) => {
  const mClassName = classnames("IconButton", className)

  return (
    <Button className={ mClassName } { ...rest }>
      <Icon icon={ icon } style={ OFFSET_FIXES[icon] } />
    </Button>
  )
}

export default IconButton

