import "./index.scss"

import classnames from "classnames"
import React from "react"

type IconOffsetType = { [ icon: string ]: React.CSSProperties }

export interface IconProps extends React.AllHTMLAttributes<HTMLSpanElement> {
  containerClassName?: string
  icon: string
}

const ICONS_FA_MDI = "mdi"
const ICON_PREFIX = ICONS_FA_MDI

const OFFSET_FIXES: IconOffsetType = {
  // "chevron-left": { position: "relative", left: "-2px" }
  "av-timer": { position: "relative", top: "1.5px" }
}

function Icon ({ className, children, containerClassName, icon, onClick, style }: IconProps) {
  const mClassName = classnames(ICON_PREFIX, "material-icons", `${ ICON_PREFIX }-${ icon }`, icon)
  const mContainerClassName = classnames("Icon", containerClassName, className)

  const mStyle = OFFSET_FIXES[ icon ] ? { ...style, ...OFFSET_FIXES[ icon ] } : style

  return <i className="Icon material-icons">{ icon }</i>

  return (
    <span
      className={ mContainerClassName }
      onClick={ onClick }
      style={ mStyle }
    >
      <i className={ mClassName } />{ children }
    </span>
  )
}

export default Icon
