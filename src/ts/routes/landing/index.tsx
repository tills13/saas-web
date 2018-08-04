import "./index.scss"

import React from "react"

import { List } from "immutable"
import { connect } from "react-redux"
import { compose } from "recompose"
import { hideModal, showModal } from "actions"
import Select from "components/form/select"

import Board from "components/board"
import LinkButton from "components/button/link_button"
import Container from "components/container"

interface IndexComponentState {
  snakes?: any
}

interface IndexComponentDispatchProps {
  hideModal: typeof hideModal
  showModal: typeof showModal
}

type IndexComponentProps = IndexComponentDispatchProps

class IndexComponent extends React.Component<IndexComponentProps, IndexComponentState> {
  state: IndexComponentState = {
    snakes: List()
  }

  componentDidMount () {
    const snakes = "saas".split("").map((letter, index) => {
      return {
        id: index,
        coords: this.convertLetterToCoords(letter, {
          x: 2 + (index * 7),
          y: 2
        }),
        color: index === 1 ? "orange" : "lightgrey"
      }
    })

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

  convertLetterToCoords (letter, startingPosition: GameAPI.Position) {
    const letterVector = this.generateRawLetter(letter)
    const letterOffset = this.getLetterOffset(letter)
    const finalPositions = [ {
      x: startingPosition.x + letterOffset[ 0 ],
      y: startingPosition.y + letterOffset[ 1 ]
    } ]

    letterVector.forEach((section, index) => {
      section.forEach(([ deltaX, deltaY ]) => {
        const previousPosition = finalPositions[ finalPositions.length - 1 ]

        finalPositions.push({
          x: previousPosition.x + deltaX,
          y: previousPosition.y - deltaY
        })
      })
    })

    return finalPositions
  }

  getLetterOffset (letter: string) {
    return {
      a: [ 0, 1 ],
      s: [ 4, 0 ]
    }[ letter ]
  }

  generateRawLetter (letter: string, scaleX: number = 1, scaleY: number = 1): number[][][] {
    const a = [
      [ [ 1, 0 ], [ 1, 0 ], [ 1, 0 ], [ 1, 0 ] ], // top
      [ [ 0, -1 ], [ 0, -1 ] ], // down to middle
      [ [ -1, 0 ], [ -1, 0 ], [ -1, 0 ], [ -1, 0 ] ], // middle
      [ [ 0, -1 ], [ 0, -1 ], [ 0, -1 ] ], // down to bottom
      [ [ 1, 0 ], [ 1, 0 ], [ 1, 0 ], [ 1, 0 ] ], // bottom
      [ [ 0, 1 ], [ 0, 1 ] ] // up to middle
    ]

    const s = [
      [ [ -1, 0 ], [ -1, 0 ], [ -1, 0 ], [ -1, 0 ] ], // top
      [ [ 0, -1 ], [ 0, -1 ], [ 0, -1 ] ], // down to middle
      [ [ 1, 0 ], [ 1, 0 ], [ 1, 0 ], [ 1, 0 ] ], // middle
      [ [ 0, -1 ], [ 0, -1 ], [ 0, -1 ] ], // down to bottom
      [ [ -1, 0 ], [ -1, 0 ], [ -1, 0 ], [ -1, 0 ] ] // bottom
    ]

    const map = { a, s }
    const mLetter = map[ letter ]

    return mLetter
  }

  render () {
    const { snakes } = this.state
    const options = [
      { label: "1", value: 1 },
      { label: "2", value: 2 },
      { label: "3", value: 3 },
      { label: "4", value: 4 },
      { label: "5", value: 5 },
      { label: "6", value: 6 },
      { label: "7", value: 7 },
      { label: "8", value: 8 },
      { label: "9", value: 9 },
      { label: "0", value: 0 }
    ].filter(item => !this.state.filter || item.label === this.state.filter)

    return (
      <Container className="Index">
        <h3 className="Index__title">Snake as a Service</h3>
        <Select
          name="test"
          onChange={ newValue => this.setState({ value: newValue }) }
          onSearch={ filter => this.setState({ filter }) }
          options={ [ ...(this.state.value || []), options ] }
          value={ this.state.value }
          searchable
          multiple
        />
        <Board
          boardRows={ 11 }
          boardColumns={ 30 }
          className="Index__board"
          snakes={ snakes }
        />
        <div className="Index__footer">
          <LinkButton to="/login">Get Started</LinkButton>
          <LinkButton to="/documentation">Read the Docs</LinkButton>
        </div>
      </Container>
    )
  }
}

export default compose(
  connect<{}, IndexComponentDispatchProps, {}>(null, { hideModal, showModal })
)(IndexComponent)
