import "./index.scss"

import { List } from "immutable"
import React from "react"

import Board from "components/board"
import LinkButton from "components/button/link_button"
import Container from "components/container"
import { generateLetters } from "utils/board"

const colors = [ "blue", "orange", "pink", "green", "yellow" ]

interface IndexComponentState {
  snakes?: any
}

class IndexComponent extends React.Component<{}, IndexComponentState> {
  state: IndexComponentState = {
    snakes: List()
  }

  componentDidMount () {
    const snakes = generateLetters("saas")
      .map((coords, id) => ({ id, coords, color: colors[ Math.floor(Math.random() * colors.length) ] }))

    document.addEventListener("keypress", (event: KeyboardEvent) => {
      const { snakes } = this.state

      const controlledSnake = snakes.get(1)
      const head = controlledSnake.coords[ 0 ]
      const key = event.key

      if (event.repeat) return

      if (key === "w") {
        controlledSnake.coords.unshift({ x: head.x, y: head.y - 1 })
        controlledSnake.coords.pop()
      } else if (key === "a") {
        controlledSnake.coords.unshift({ x: head.x - 1, y: head.y })
        controlledSnake.coords.pop()
      } else if (key === "s") {
        controlledSnake.coords.unshift({ x: head.x, y: head.y + 1 })
        controlledSnake.coords.pop()
      } else if (key === "d") {
        controlledSnake.coords.unshift({ x: head.x + 1, y: head.y })
        controlledSnake.coords.pop()
      }

      this.setState({
        snakes: snakes.set(1, controlledSnake)
      })
    })

    this.setState({ snakes: List(snakes) })
  }

  render () {
    const { snakes } = this.state

    return (
      <Container className="Index">
        <h3 className="Index__title">Snake as a Service</h3>
        <Board height={ 11 } width={ 30 } snakes={ snakes } />
        <div className="Index__footer">
          <LinkButton to="/login">Get Started</LinkButton>
          <LinkButton to="/documentation">Read the Docs</LinkButton>
        </div>
      </Container>
    )
  }
}

export default IndexComponent
