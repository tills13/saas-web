import * as React from "react"

interface ErrorBoundaryState {
  error: Error
  hasError: boolean
}

class ErrorBoundary extends React.Component {
  state: ErrorBoundaryState = { error: null, hasError: false }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ error, hasError: true })
    console.log(error, info)
  }

  render() {
    const { error, hasError } = this.state
    const { children } = this.props

    if (hasError) {
      return <div>{ error.message }</div>
    }

    return React.Children.only(children)
  }
}

export default ErrorBoundary
