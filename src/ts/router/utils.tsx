import { RenderArgs } from "found"
import React from "react"

import LoaderLayout from "components/loader/layout"

export function renderLoading ({ props, Component }: RenderArgs) {
  return (Component && props) ? <Component { ...props } /> : <LoaderLayout />
}
