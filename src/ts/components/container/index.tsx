import "./index.scss"

import classnames from "classnames"
import React from "react"

interface ContainerProps extends React.AllHTMLAttributes<HTMLDivElement> {
  className?: string
}

export default React.forwardRef<HTMLDivElement, ContainerProps>(function (props, ref) {
  const mClassName = classnames("Container", props.className)

  return (
    <div className={ mClassName } ref={ ref }>
      { props.children }
    </div>
  )
})
