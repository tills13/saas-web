import classnames from "classnames"
import { Link } from "found"
import React from "react"

import IconButton, { IconButtonProps } from "../IconButton"
import { LinkButtonProps } from "../LinkButton"

type IconLinkButtonProps = IconButtonProps & LinkButtonProps & {
  className?: string
}

function IconLinkButton ({ children, className, to, ...props }: IconLinkButtonProps) {
  const mClassName = classnames("IconLinkButton", "LinkButton", "IconButton")

  return (
    <Link to={ to } className={ mClassName }>
      <IconButton { ...props }>{ children }</IconButton>
    </Link>
  )
}

export default IconLinkButton
