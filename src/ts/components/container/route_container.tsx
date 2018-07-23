import "./index.scss"

import classnames from "classnames"
import React from "react"

import Container from "./index"

interface RouteContainerProps extends React.Props<any> {
  className?: string
}

export const RouteContainer = ({ children, className }: RouteContainerProps) => {
  const mClassName = classnames("RouteContainer", className)
  return <Container className={ mClassName }>{ children }</Container>
}

export default RouteContainer
