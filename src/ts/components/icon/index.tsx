import "./index.scss"

import classnames from "classnames"
import React from "react"

export interface IconProps extends React.Props<any> {
  className?: string
  containerClassName?: string
  icon: string
  onClick?: (event: React.MouseEvent<any>) => void
  style?: React.CSSProperties
}

const ICONS_FA_MDI = "mdi"
const ICON_PREFIX = ICONS_FA_MDI

const Icon = ({ className, children, containerClassName, icon, onClick, style }: IconProps) => {
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
