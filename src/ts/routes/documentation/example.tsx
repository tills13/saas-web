import "./example.scss"

import * as classnames from "classnames"
import * as React from "react"
import { compose, mapProps, SetStateCallback, withState } from "recompose"

import Code from "components/code"
import Button from "components/form/button"

import { http } from "utils/fetch"

const exampleResponse = (url: string, endpoint: string, data = {}) => {
  if (!url.endsWith("/")) url = `${ url }/`

  return http.post(`${ url }${ endpoint }`, data, {
    overrideBaseUrl: true,
    includeCredentials: false
  })
}

interface ExampleInnerProps extends React.Props<any>, ExampleOuterProps {
  error: any
  loading: boolean
  response: any
  setError: SetStateCallback
  setLoading: SetStateCallback<boolean>
  setResponse: SetStateCallback
}

interface ExampleOuterProps {
  className?: string
  endpoint: string
  data?: object
  onClickShowExample?: () => Promise<any>
  requestExampleText?: string | object
  url: string
}

const Example = ({
  className,
  endpoint,
  error,
  data,
  loading,
  onClickShowExample,
  requestExampleText,
  response,
  setError,
  setLoading,
  setResponse,
  url
}: ExampleInnerProps) => {
  const mClassName = classnames("Example", className)

  const mOnClickShowExample = (event) => {
    setLoading(true, () => {
      const beforeRun = onClickShowExample
        ? onClickShowExample()
        : Promise.resolve()

      beforeRun.then(() => {
        return exampleResponse(url, endpoint, data)
      }).then((response) => {
        setLoading(false)
        setResponse(response)
      }).catch((err) => {
        setLoading(false)
        setError("Something went wrong...")
      })
    })
  }

  if (!url.endsWith("/")) url = `${ url }/`

  return (
    <div className={ mClassName }>
      { requestExampleText && [
        <h5 key="0" className="Example__title">Request</h5>,
        <Code key="1" className="Example__code">{ requestExampleText }</Code>
      ] }

      <h5 className="Example__title">Response</h5>
      <Code className="Example__code">
        { loading ? "Loading..." : (response || "Click \"Show Example Response\" below") }
      </Code>

      { error && <div className="Example__error">{ error }</div> }

      <div className="Example__footer">
        <code>{ url }{ endpoint }</code>
        <Button
          onClick={ mOnClickShowExample }
          disabled={ !!loading }
        >
          Show Example Response
        </Button>
      </div>
    </div>
  )
}

export default compose<ExampleInnerProps, ExampleOuterProps>(
  withState("error", "setError", null),
  withState("loading", "setLoading", false),
  withState("response", "setResponse", null),
  mapProps(({ data, requestExampleText, response, ...rest }) => {
    return {
      data,
      requestExampleText: requestExampleText || JSON.stringify(data, null, 2),
      response: response ? JSON.stringify(response, null, 2) : null,
      ...rest
    }
  })
)(Example)
