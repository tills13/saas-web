import * as React from "react"
import * as Relay from "react-relay/classic"

type GetMutationCallback = any// (props: any) => void // Relay.Mutation<any, any>

export function withMutation<T = any, S = any>(mutation: GetMutationCallback | Relay.Mutation<T, S>) {
  return (Component: React.ComponentType<any>) => {
    return class extends React.Component<any> {
      render() {
        const mutate = (data: T) => {
          return new Promise<S>((resolve, reject) => {
            const mMutation: Relay.Mutation<T, S> = typeof mutation === "function"
              ? new (mutation(this.props))(data)
              : new (mutation as any)(data)

            Relay.Store.commitUpdate(mMutation, {
              onSuccess: resolve,
              onFailure: ((transaction) => {
                reject({
                  errors: transaction.getError().source.errors,
                  transaction
                })
              })
            })
          })
        }

        return <Component {...this.props} mutate={ mutate } />
      }
    }
  }
}
