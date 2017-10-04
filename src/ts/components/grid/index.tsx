import "./index.scss"

import * as classnames from "classnames"
import * as React from "react"

import { chunk } from "lodash"

interface GridProps extends React.Props<any> {
  className?: string
  itemsPerRow?: number
}

function isStringOrNumber(child: React.ReactChild): child is number | string {
  return typeof child === "string" || typeof child === "number"
}

export const Grid = ({ children, className, itemsPerRow = 5 }: GridProps) => {
  const mClassName = classnames("Grid", className)
  const rows = chunk(React.Children.toArray(children), itemsPerRow)

  return (
    <div className={ mClassName }>
      { rows.map((mChildren, index) => {
        return (
          <div key={ index } className="Grid__row">
            { React.Children.map(mChildren, (child) => {
              const childProps = isStringOrNumber(child) ? {} : child.props
              const className = classnames("Grid__item", childProps.className)

              return isStringOrNumber(child) ? child : React.cloneElement(child, {
                className
              })
            }) }
          </div>
        )
      }) }
    </div>
  )
}

export default Grid
