import { merge } from "lodash"
import React from "react"

interface PaginationOptions {
  after: any
  itemsPerPage: number
  itemsPerPageOptions: number[]
  onChangeItemsPerPage: (newItemsPerPage: number) => void
  onClickNextPage: () => void
  onClickPreviousPage: () => void
  totalItems: number
}

type PaginationPropOptions = (props: any) => Partial<PaginationOptions>

export interface PaginationProps { pagination: PaginationOptions }

export const paginate = (options?: PaginationOptions | PaginationPropOptions) => {
  return (Component) => {
    return class extends React.Component<any, any> {
      private defaultOptions: PaginationOptions = {
        after: 0,
        itemsPerPage: 10,
        itemsPerPageOptions: [5, 10, 15, 20, 50, 100],
        onChangeItemsPerPage: (newItemsPerPage: number) => console.log("onChangeItemsPerPage not implemented"),
        onClickNextPage: () => console.log("onClickNextPage not implemented"),
        onClickPreviousPage: () => console.log("onClickPreviousPage not implemented"),
        totalItems: 0
      }

      render() {
        const mOptions = typeof options === "function"
          ? options(this.props)
          : options

        const pagination = merge(this.defaultOptions, mOptions)

        return (
          <Component
            {...this.props}
            pagination={ pagination }
          />
        )
      }
    }
  }
}
