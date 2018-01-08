import * as classnames from "classnames"
import * as React from "react"
import { Link } from "react-router"

import Button from "components/form/button"
import Icon from "components/icon"
import { IconButton, IconButtonProps, OFFSET_FIXES } from "./icon_button"
import { LinkButtonProps } from "./link_button"

type IconLinkButtonProps = IconButtonProps & LinkButtonProps & {
  className?: string
}

export const IconLinkButton = ({ children, className, to, ...props }: IconLinkButtonProps) => {
  const mClassName = classnames("IconLinkButton", "LinkButton", "IconButton")

  return (
    <Link to={ to } className={ mClassName }>
      <IconButton { ...props }>{ children }</IconButton>
    </Link>
  )
}

export default IconLinkButton
