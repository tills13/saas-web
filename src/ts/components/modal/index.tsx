import classnames from "classnames"
import React from "react"
import ReactDOM from "react-dom"

interface ModalProps {
  className?: string
}

const modalRoot = document.getElementById("modal-root")

function ModalBody ({ children }: React.AllHTMLAttributes<HTMLDivElement>) {
  return (
    <div className="Modal__footer">{ children }</div>
  )
}

function ModalFooter ({ children }: React.AllHTMLAttributes<HTMLDivElement>) {
  return (
    <div className="Modal__footer">{ children }</div>
  )
}

function ModalHeader ({ children }: React.AllHTMLAttributes<HTMLDivElement>) {
  return (
    <div className="Modal__header">{ children }</div>
  )
}

class Modal extends React.Component<ModalProps> {
  el: HTMLDivElement

  static ModalHeader = ModalHeader
  static ModalFooter = ModalFooter
  // static ModalHeader = ModalHeader

  constructor (props: ModalProps) {
    super(props)

    this.el = document.createElement("div")
    this.el.className = classnames("Modal", props.className)
  }

  componentDidMount () {
    modalRoot.appendChild(this.el)
  }

  componentWillUnmount () {
    modalRoot.removeChild(this.el)
  }

  render () {
    return ReactDOM.createPortal(
      this.props.children,
      this.el
    )
  }
}

export default Modal
