import "./section.scss"

import * as classnames from "classnames"
import * as React from "react"

interface SectionProps extends React.Props<any> {
  className?: string
  wrapper?: any
}

const Section = ({ children, className, wrapper }: SectionProps) => {
  const mClassName = classnames("Section", className)

  return (
    <div className={ mClassName }>
      { wrapper
        ? React.createElement(wrapper, {}, children)
        : children
      }
    </div>
  )
}

export default Section
