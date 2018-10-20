import "./index.scss"

import classnames from "classnames"
import fetch from "isomorphic-fetch"
import React from "react"

import Code from "components/Code"
import Button from "components/form/button"

interface ExampleProps extends React.AllHTMLAttributes<HTMLDivElement> {
  className?: string
  url: string
  data?: any
  onClickShowExample?: () => Promise<any>
  path: string
}

interface ExampleState {
  error: string
  loading: boolean
  response: string
}

function getExampleResponse (url: string | URL, data = {}) {
  const mUrl = typeof url === "string" ? new URL(url) : url
  return fetch(mUrl.href, { method: "POST", body: JSON.stringify(data) })
}

class DocumentationExample extends React.Component<ExampleProps, ExampleState> {
  onClickShowExample () {
    const { data, url, onClickShowExample, path } = this.props
    const mUrl = new URL(url + path);

    (onClickShowExample || Promise.resolve)()
      .then(() => getExampleResponse(mUrl, data))
      .then(res => res.json())
      .then(response => this.setState({ loading: false, response }))
      .catch((err: Error) => {
        this.setState({
          error: err ? err.message : "Something went wrong...",
          loading: false
        })
      })
  }

  render () {
    const { className, data, url, path } = this.props
    const { loading, response } = this.state

    const mClassName = classnames("Example", className)
    const mUrl = new URL(url)
    mUrl.pathname = path

    return (
      <div className={ mClassName }>
        <h5 className="Example__title">Response</h5>
        <Code className="Example__code">
          { JSON.stringify(data) }
        </Code>

        <h5 className="Example__title">Response</h5>
        <Code className="Example__code">
          { loading ? "Loading..." : (response || "Click \"Show Example Response\" below") }
        </Code>

        <div className="Example__footer">
          <code>{ mUrl }</code>
          <Button onClick={ this.onClickShowExample } disabled={ !!loading }>
            Show Example Response
          </Button>
        </div>
      </div>
    )
  }
}

export default DocumentationExample
