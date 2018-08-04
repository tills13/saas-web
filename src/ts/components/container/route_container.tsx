import "./index.scss"

import classnames from "classnames"
import React from "react"

import Container from "."

interface RouteContainerProps extends React.AllHTMLAttributes<HTMLDivElement> {
  className?: string
}

function RouteContainer ({ children, className }: RouteContainerProps) {
  const mClassName = classnames("RouteContainer", className)
  return <Container className={ mClassName }>{ children }</Container>
}

export default RouteContainer
