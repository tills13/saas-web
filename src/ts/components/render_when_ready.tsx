import * as React from "react"

export default (Component?) => {
  return ({ props, element }) => {
    return props
      ? React.cloneElement(element, props)
      : <div>Loading...</div>
  }
}
