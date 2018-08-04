import "./layout.scss"

import React from "react"

import Loader from "."

interface LoaderLayoutProps extends React.AllHTMLAttributes<HTMLDivElement> { }

function LoaderLayout (props: LoaderLayoutProps) {
  return (
    <div className="LoaderLayout">
      <Loader />
    </div>
  )
}

export default LoaderLayout
