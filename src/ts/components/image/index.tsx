import React from "react"

export type ImageProps = {
  height: number
  src: string
  width: number
}

class Image extends React.Component<ImageProps> {
  image: HTMLImageElement

  state = { loading: true, errored: false }

  componentDidMount () {
    this.image.onload = _ => this.setState({ loading: false })
    this.image.onerror = _ => this.setState({ errored: true })
  }

  render () {
    const { height, width } = this.props
    const { errored, loading } = this.state

    return (
      <div>
        { loading && <div className="Image --loading" style={ { height, width } } /> }
        { errored && <div className="Image --errored" style={ { height, width } } /> }
        <img ref={ image => this.image = image } { ...this.props } />
      </div>
    )
  }
}

export default Image
