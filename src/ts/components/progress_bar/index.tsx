import "./index.scss"

import * as classnames from "classnames"
import * as React from "react"

interface ProgressBarProps {
  className?: string
  containerClassName?: string
  progress?: number
  small?: boolean
  total?: number
}

const ProgressBar = ({ className, containerClassName, progress, small, total }: ProgressBarProps) => {
  const mContainerClassName = classnames("ProgressBar__container", containerClassName, {
    "ProgressBar__container--small": small
  })

  const mClassName = classnames("ProgressBar", className)
  const mProgress = total != null ? (progress / total) * 100 : progress

  return (
    <div className={ mContainerClassName }>
      <div className={ mClassName } style={ { width: `${ mProgress }%` } } />
    </div>
  )
}

export default ProgressBar
