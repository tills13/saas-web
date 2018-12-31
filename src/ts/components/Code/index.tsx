import "./index.scss"

import classnames from "classnames"
import React from "react"
import * as utils from "utils"

import Button from "../form/button"

interface CodeProps extends React.AllHTMLAttributes<HTMLDivElement> {
  className?: string
  format?: boolean
  showExpand?: boolean
}

interface CodeState {
  isExpanded: boolean
}

class Code extends React.Component<CodeProps, CodeState> {
  static defaultProps = { format: false, language: "javascript", showExpand: true, wrapLines: false }
  state: CodeState = { isExpanded: false }

  onClickExpand = () => {
    this.setState(({ isExpanded }) => ({ isExpanded: !isExpanded }))
  }

  render () {
    const { children, className, format, showExpand } = this.props
    const { isExpanded } = this.state

    const mClassName = classnames("Code", className, {
      "--expanded": isExpanded
    })

    const text = (typeof children === "string" && format)
      ? utils.trimLeadingWhitespace(children)
      : children

    const lineCount = typeof children === "string"
      ? children.split(/\n|\\n|<br\/>/ig).length
      : React.Children.count(children)

    return (
      <div className="Code__container">
        { showExpand && lineCount > 1 && (
          <Button
            className="Code__toggleExpand"
            onClick={ this.onClickExpand }
          >
            { isExpanded ? "Collapse" : "Expand" }
          </Button>
        ) }
        <pre className={ mClassName }>{ text }</pre>
      </div>
    )
  }
}

export default Code
