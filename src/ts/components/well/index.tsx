import "./index.scss"

import classnames from "classnames"
import React from "react"

interface WellProps extends React.Props<any> {
  className?: string
}

const Well = ({ children, className }: WellProps) => {
  const mClassName = classnames("Well", className)

  return (
    <div className={ mClassName }>
      { children }
    </div>
  )
}

export default Well
