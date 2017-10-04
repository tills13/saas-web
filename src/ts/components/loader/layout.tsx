import "./layout.scss"

import * as React from "react"

import Loader from "."

interface LoaderLayoutProps extends React.Props<any> {

}

export const LoaderLayout = (props: LoaderLayoutProps) => {
  return (
    <div className="LoaderLayout">
      <Loader />
    </div>
  )
}

export default LoaderLayout
