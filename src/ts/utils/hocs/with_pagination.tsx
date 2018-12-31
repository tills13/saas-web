import { merge } from "lodash"
import React from "react"
import Relay from "react-relay"
import { Variables } from "relay-runtime";

interface PaginationOptions {
  after: any
  limit: number
  limitOptions: number[]
  onChangeLimit: (limit: number) => void
  onClickNextPage: (after: number, limit: number) => void
  onClickPreviousPage: (after: number, limit: number) => void
  count: number
}

type ChangeAfterHelper = (newAfter: number, relay: Relay.RelayRefetchProp) => void
type ChangeLimitHelper = (newLimit: number, relay: Relay.RelayRefetchProp) => void
type PaginationPropHelpers = { onChangeAfter: ChangeAfterHelper, onChangeLimit: ChangeLimitHelper }
type GetPaginationProp = (props: any, helpers: PaginationPropHelpers) => Partial<PaginationOptions>

export interface PaginationProps { pagination: PaginationOptions }

interface PaginationWrapperState {
  pVars: { after: number, limit: number }
}

function refetch (relay: Relay.RelayRefetchProp, variables: Variables, renderVariables?: Variables) {
  return new Promise((resolve, reject) => {
    relay.refetch(variables, renderVariables, err => {
      if (err) reject(err)
      else resolve()
    })
  })
}

export function withPagination (options?: PaginationOptions | GetPaginationProp): (Component: React.ComponentType<any>) => React.ComponentClass<any> {
  return (Component: React.ComponentType<any>) => {
    return class extends React.Component<any, PaginationWrapperState> {
      state: PaginationWrapperState = { pVars: { after: 0, limit: 10 } }

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
        refetch(relay, { ...this.state.pVars, limit: newLimit }).then(
          _ => this.setState(({ pVars }) => ({ pVars: { ...pVars, limit: newLimit } }))
        )
      }

      onChangeAfter = (newAfter: number, relay: Relay.RelayRefetchProp) => {
        refetch(relay, { ...this.state.pVars, after: newAfter }).then(
          _ => this.setState(({ pVars }) => ({ pVars: { ...pVars, after: newAfter } }))
        )
      }

      render () {
        const mOptions = typeof options === "function"
          ? options(this.props, { onChangeAfter: this.onChangeAfter, onChangeLimit: this.onChangeLimit })
          : options

        const pagination = merge(this.defaultOptions, this.state.pVars, mOptions)

        return <Component { ...this.props } pagination={ pagination } />
      }
    }
  }
}
