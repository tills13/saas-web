import "./link_button.scss"

import classnames from "classnames"
import { Link } from "found"
import React from "react"

import { ButtonProps, default as Button } from "components/form/button"

export interface LinkButtonProps extends ButtonProps {
  to: string
}

const LinkButton = ({ children, className, to, ...props }: LinkButtonProps) => {
  const mClassName = classnames("LinkButton", className)

  return (
    <Link to={ to } className={ mClassName }>
      <Button {...props}>{ children }</Button>
    </Link>
  )
}

export default LinkButton
