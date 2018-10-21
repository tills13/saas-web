import "./index.scss"

import classnames from "classnames"
import React from "react"

export interface IconProps extends React.AllHTMLAttributes<HTMLSpanElement> {
  containerClassName?: string
  icon: string
}

const ICONS_FA_MDI = "mdi"
const ICON_PREFIX = ICONS_FA_MDI

function Icon ({ className, children, containerClassName, icon, onClick, style }: IconProps) {
  const mClassName = classnames(ICON_PREFIX, `${ ICON_PREFIX }-${ icon }`, className)
  const mContainerClassName = classnames("Icon", containerClassName, { "content": children != null })

  return (
    <span
      className={ mContainerClassName }
      onClick={ onClick }
      style={ style }
    >
      <i className={ mClassName } />{ children }
    </span>
  )
}

export default Icon
