import * as React from "react"
import { createContainer, CreateContainerOpts, RelayContainerClass } from "react-relay/classic"

export default (params?: CreateContainerOpts) => {
  return <T1 = any>(Component: React.ComponentType<T1>): RelayContainerClass<T1> => {
    return createContainer(Component, params)
  }
}
