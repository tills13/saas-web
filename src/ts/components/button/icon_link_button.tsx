import classnames from "classnames"
import { Link } from "found"
import React from "react"

import Button from "../form/button"
import Icon from "../icon"
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
