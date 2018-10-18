import React from "react"

interface ErrorBoundaryState {
  error: Error
  hasError: boolean
}

class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null, hasError: false }

  componentDidCatch (error: Error, info: React.ErrorInfo) {
    this.setState({ error, hasError: true })
  }

  render () {
    const { error, hasError } = this.state
    const { children } = this.props

    if (hasError) {
      return (
        <pre>
          { error.stack }
          { error.message }
        </pre>
      )
    }

    return React.Children.only(children)
  }
}

export default ErrorBoundary
