import React from "react"

interface ErrorBoundaryState {
  error?: Error
}

class ErrorBoundary extends React.Component<{}, ErrorBoundaryState> {
  componentDidCatch (error: Error, info: React.ErrorInfo) {
    this.setState({ error })
  }

  render () {
    const { error } = this.state
    const { children } = this.props

    if (error) {
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
