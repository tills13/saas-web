import "./index.scss"

import classnames from "classnames"
import React from "react"
import * as utils from "utils"

import { compose, defaultProps, SetStateCallback, withState } from "recompose"

import Button from "../form/button"

import SyntaxHighlighter from "react-syntax-highlighter/dist/light"
import github from "react-syntax-highlighter/dist/styles/github"

interface CodeProps extends React.AllHTMLAttributes<HTMLDivElement> {
  className?: string
  format?: boolean
  language?: string
  showExpand?: boolean
  wrapLines?: boolean
}

interface CodeState {
  isExpanded: boolean
}

class Code extends React.Component<CodeProps, CodeState> {
  static defaultProps = { format: false, language: "javascript", showExpand: true, wrapLines: false }
  state = { isExpanded: false }

  onClickExpand = () => {
    this.setState(({ isExpanded }) => ({ isExpanded: !isExpanded }))
  }

  render () {
    const { children, className, format, language, showExpand, wrapLines } = this.props
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

    console.log(children, lineCount)

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
        <SyntaxHighlighter
          className={ mClassName }
          language={ language }
          style={ github }
          wrapLines={ wrapLines }
        >
          { text }
        </SyntaxHighlighter>
      </div>
    )
  }
}

export default Code
