import { RouteRenderArgs } from "found"
import React from "react"

import LoaderLayout from "components/loader/layout"

export function renderLoading ({ props, Component }: RouteRenderArgs) {
  return (Component && props) ? <Component { ...props } /> : <LoaderLayout />
}
