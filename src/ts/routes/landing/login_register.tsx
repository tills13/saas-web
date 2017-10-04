import * as React from "react"

import { RouteComponentProps } from "react-router"
import { getContext } from "recompose"
import { PropTypes } from "prop-types"
// import { SubNav } from "../../components/subnav"

type LoginRegisterComponentProps =
  React.Props<any> &
  RouteComponentProps<any, any>

export const LoginRegister = ({ children }: LoginRegisterComponentProps) => {
  return (
    <div className="row login-register">
      <div className="col-md-10">
        {children}
      </div>
      <div className="col-md-2 sidebar">

      </div>
    </div>
  )
}

export default getContext({ router: PropTypes.object })(LoginRegister)
