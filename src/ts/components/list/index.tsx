import "./index.scss"

import classnames from "classnames"
import React from "react"

interface ListProps extends React.Props<any> {
  className?: string
}

function isStringOrNumber(child: React.ReactChild): child is number | string {
  return typeof child === "string" || typeof child === "number"
}

export const List = ({ children, className }: ListProps) => {
  const mClassName = classnames("List", className)

  return (
    <div className={ mClassName }>
      { React.Children.map(children, (child) => {
        const childProps = isStringOrNumber(child) ? {} : child.props
        const className = classnames("List__item", childProps.className)

        return isStringOrNumber(child) ? child : React.cloneElement(child, {
          className
        })
      }) }
    </div>
  )
}

export default List
