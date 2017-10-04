import "./index.scss"

import * as classnames from "classnames"
import * as React from "react"
import * as utils from "utils"

import { compose, defaultProps, SetStateCallback, withState } from "recompose"

import Button from "components/form/button"

import SyntaxHighlighter from "react-syntax-highlighter/dist/light"
import github from "react-syntax-highlighter/dist/styles/github"

interface CodeInnerProps extends React.Props<any>, CodeOuterProps {
  isExpanded: boolean
  setIsExpanded: SetStateCallback<boolean>
}

interface CodeOuterProps {
  className?: string
  format?: boolean
  language?: string
  showExpand?: boolean
  style?: any
  wrapLines?: boolean
}

const Code = ({
  children,
  className,
  format,
  isExpanded,
  language,
  setIsExpanded,
  showExpand,
  style,
  wrapLines
}: CodeInnerProps) => {
  const mClassName = classnames("Code", className, {
    "Code--expanded": isExpanded
  })

  const styles = { github }

  const text = typeof children === "string" && format
    ? utils.trimLeadingWhitespace(children)
    : children

  const lineCount = typeof children === "string" && format
    ? children.split(/\n|\\n|<br\/>/).length
    : React.Children.count(children)

  return (
    <div className="Code__container">
      { showExpand && lineCount > 1 && (
        <Button
          className="Code__toggleExpand"
          onClick={ () => setIsExpanded(!isExpanded) }
        >
          { isExpanded ? "Collapse" : "Expand" }
        </Button>
      ) }
      <SyntaxHighlighter
        className={ mClassName }
        language={ language }
        style={ styles[style] }
        wrapLines={ wrapLines }
      >
        { text }
      </SyntaxHighlighter>
    </div>
  )
}

export default compose<CodeInnerProps, CodeOuterProps>(
  defaultProps({
    language: "javascript",
    format: false,
    showExpand: true,
    style: "github",
    wrapLines: false
  }),
  withState("isExpanded", "setIsExpanded", false)
)(Code)
