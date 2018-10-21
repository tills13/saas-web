import React from "react"

interface ImageProps {
  height: number
  src: string
  width: number
}

interface ImageState {
  errored: boolean
  loading: boolean
}

class Image extends React.Component<ImageProps, ImageState> {
  state = { loading: true, errored: false }

  imageRef: React.RefObject<HTMLImageElement>

  constructor (props: ImageProps) {
    super(props)

    this.imageRef = React.createRef()
  }

  componentDidMount () {
    const image = this.imageRef.current!

    image.onload = _ => this.setState({ loading: false })
    image.onerror = _ => this.setState({ errored: true })
  }

  render () {
    const { height, width } = this.props
    const { errored, loading } = this.state

    return (
      <div>
        { loading && <div className="Image --loading" style={ { height, width } } /> }
        { errored && <div className="Image --errored" style={ { height, width } } /> }
        <img ref={ this.imageRef } { ...this.props } />
      </div>
    )
  }
}

export default Image
