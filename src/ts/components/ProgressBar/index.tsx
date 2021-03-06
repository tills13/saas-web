import "./index.scss"

import classnames from "classnames"
import React from "react"

interface ProgressBarProps {
  className?: string
  containerClassName?: string
  progress?: number
  small?: boolean
  total?: number
}

function ProgressBar ({ className, containerClassName, progress, small, total }: ProgressBarProps) {
  const mContainerClassName = classnames("ProgressBar__container", containerClassName, {
    "--small": small
  })

  const mClassName = classnames("ProgressBar", className)
  const mProgress = total != null ? (progress || 0 / total) * 100 : progress

  return (
    <div className={ mContainerClassName }>
      <div className={ mClassName } style={ { width: `${ mProgress }%` } } />
    </div>
  )
}

export default ProgressBar
