import { merge } from "lodash"
import React from "react"
import Relay from "react-relay"

interface PaginationOptions {
  after: any
  limit: number
  limitOptions: number[]
  onChangeLimit: (limit: number) => void
  onClickNextPage: (after: number, limit: number) => void
  onClickPreviousPage: (after: number, limit: number) => void
  count: number
}

type PaginationPropOptions = (props: any, options: { onChangeAfter, onChangeLimit }) => Partial<PaginationOptions>

export interface PaginationProps { pagination: PaginationOptions }

interface PaginationWrapperState {
  pVars: { after: number, limit: number }
}

export function withPagination (options?: PaginationOptions | PaginationPropOptions) {
  return (Component) => {
    return class extends React.Component<any, PaginationWrapperState> {
      state = { pVars: { after: 0, limit: 10 } }

      private defaultOptions: PaginationOptions = {
        after: 0,
        count: 0,
        limit: 10,
        limitOptions: [ 5, 10, 15, 20, 50, 100 ],
        onChangeLimit: () => console.log("onChangeLimit not implemented"),
        onClickNextPage: () => console.log("onClickNextPage not implemented"),
        onClickPreviousPage: () => console.log("onClickPreviousPage not implemented")
      }

      onChangeLimit = (newLimit: number, relay: Relay.RelayRefetchProp) => {
        relay.refetch({ ...this.state.pVars, limit: newLimit }, null, (err) => {
          if (err) return
          this.setState(({ pVars }) => ({ pVars: { ...pVars, limit: newLimit } }))
        })
      }

      onChangeAfter = (newAfter: number, relay: Relay.RelayRefetchProp) => {
        relay.refetch({ ...this.state.pVars, after: newAfter }, null, (err) => {
          if (err) return
          this.setState(({ pVars }) => ({ pVars: { ...pVars, after: newAfter } }))
        })
      }

      render () {
        const mOptions = typeof options === "function"
          ? options(this.props, { onChangeAfter: this.onChangeAfter, onChangeLimit: this.onChangeLimit })
          : options

        const pagination = merge(this.defaultOptions, this.state.pVars, mOptions)

        return (
          <Component { ...this.props } pagination={ pagination } />
        )
      }
    }
  }
}
