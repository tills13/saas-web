import "./index.scss"

import classnames from "classnames"
import React from "react"

interface ContainerProps {
  className?: string
  containerRef?: React.Ref<any>
}

class Container extends React.Component<ContainerProps> {
  render() {
    const { children, className, containerRef } = this.props
    const mClassName = classnames("Container", className)

    return (
      <div className={ mClassName } ref={ containerRef }>
        { children }
      </div>
    )
  }
}

export default Container
