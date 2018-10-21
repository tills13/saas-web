import "./link_button.scss"

import classnames from "classnames"
import { Link } from "found"
import React from "react"

import Button, { ButtonProps } from "../form/button"

export interface LinkButtonProps extends ButtonProps {
  to: string
}

function LinkButton ({ block, children, className, to, ...props }: LinkButtonProps) {
  const mClassName = classnames("LinkButton", className, { "--block": block })

  return (
    <Link to={ to } className={ mClassName }>
      <Button { ...props }>{ children }</Button>
    </Link>
  )
}

export default LinkButton
