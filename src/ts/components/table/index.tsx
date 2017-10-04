import "./index.scss"

import * as classnames from "classnames"
import * as React from "react"

interface TableProps extends React.Props<any> {
  className?: string
  columns?: string[]
  rows?: React.ReactNode[],
  striped?: boolean
}

const Table = ({ children, className, columns, rows, striped }: TableProps) => {
  const mClassName = classnames("Table", className, {
    "Table--striped": striped
  })

  return (
    <table className={ mClassName }>
      { columns && (
        <thead className="Table__thead">
          <tr className="Table__row">
            { columns.map((column) => <th key={ column }>{ column }</th>) }
          </tr>
        </thead>
      ) }
      <tbody>
        { React.Children.map(children, (child: React.ReactElement<any>) => {
          return child && React.cloneElement(child, {
            ...child.props,
            className: classnames(child.props.className, "Table__row")
          })
        }) }
      </tbody>
    </table>
  )
}

export default Table
