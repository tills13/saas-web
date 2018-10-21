import "./index.scss"

import classnames from "classnames"
import React from "react"

import Container from "../Container"

function RouteContainer ({ children, className }: React.AllHTMLAttributes<HTMLDivElement>) {
  const mClassName = classnames("RouteContainer", className)
  return <Container className={ mClassName }>{ children }</Container>
}

export default RouteContainer
