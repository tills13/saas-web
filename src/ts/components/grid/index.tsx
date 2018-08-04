import "./index.scss"

import classnames from "classnames"
import React from "react"

import { chunk } from "lodash"

interface GridProps extends React.Props<any> {
  className?: string
  itemsPerRow?: number
}

function isStringOrNumber (child: React.ReactChild): child is number | string {
  return typeof child === "string" || typeof child === "number"
}

export const Grid = ({ children, className, itemsPerRow = 5 }: GridProps) => {
  const mClassName = classnames("Grid", className)
  // const rows = chunk(React.Children.toArray(children), itemsPerRow)

  return (
    <div className={ mClassName }>
      { children }
    </div>
  )
}

export default Grid
