import React from "react"

import LoaderLayout from "components/loader/layout"

export function renderLoading(Component) {
  return ({ props, routerProps, element }) => {
    return props ? <Component {...props} /> : <LoaderLayout />
  }
}
