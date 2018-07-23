import "./index.scss"

import ButtonGroup from "components/button/button_group"
import LinkButton from "components/button/link_button"
import Code from "components/code"
import Container from "components/container"
import createContainer from "components/create_relay_container"
import Checkbox from "components/form/checkbox"
import FieldGroup from "components/form/field_group"
import Select from "components/form/select"
import TextInput from "components/form/text_input"
import Table from "components/table"
import Well from "components/well"
import { PropTypes } from "prop-types"
import React from "react"
import Relay from "react-relay/classic"
import { compose, getContext, SetStateCallback, withState } from "recompose"

import Anchor from "./anchor"
import Example from "./example"
import Section from "./section"

interface DocumentationInnerProps {
  exampleUrl: string
  isLegacy: boolean
  selectedSnake?: Models.Snake
  setExampleUrl: SetStateCallback
  setIsLegacy: SetStateCallback
  setSelectedSnake: SetStateCallback
  viewer: GraphQL.Schema.Viewer
}

const defaultExampleUrl = "https://battlesnake.sbstn.ca/"

export class Documentation extends React.Component<DocumentationInnerProps, {}> {
  getExampleJson () {
    const { isLegacy } = this.props

    let requestJson: any = {
      gameId: "5ac7cf8b-4b04-476a-b6a6-16bd8c83c048",
      game_id: "5ac7cf8b-4b04-476a-b6a6-16bd8c83c048",
      you: "5ac7cf8b-4b04-476a-b6a6-16bd8c83c048",
      isLegacy,
      width: 20,
      height: 20,
      turn: 1,
      food: isLegacy ? [[5, 5], [15, 15]] : [{ x: 5, y: 5 }, { x: 10, y: 10 }],
      gold: isLegacy ? [[10, 10]] : [{ x: 10, y: 10 }],
      walls: [{ x: 0, y: 0 }],
      snakes: [{
        id: "5ac7cf8b-4b04-476a-b6a6-16bd8c83c048",
        health: 50,
        health_points: 50,
        coords: isLegacy ? [[2, 2], [2, 3]] : [{ x: 2, y: 2, color: "white" }, { x: 2, y: 3 }]
      }]
    }

    if (!isLegacy) {
      requestJson["teleporters"] = [
        { x: 5, y: 15, channel: 1 },
        { x: 15, y: 5, channel: 1 }
      ]
    }

    return requestJson
  }

  renderDaemons () {
    const { viewer } = this.props

    return (
      <div>
        <Container>
          <a className="Documentation__anchor" href="#daemons">
            <h2 id="daemons" className="Documentation__title">Daemons</h2>
          </a>
        </Container>

        <Anchor anchor="move" endpoint="/" method="POST" title="Update" />
        <Container>
          <Section>
            <h4 className="Documentation__title">What are Daemons?</h4>
            <p>
              Daemons run along side games, updating the board on every "tick." They can add and remove
              features from the board as well as adjust parameters of board itself - such as the height/width.
              Daemons are effectively <a href="#bounty/check" className="u">headless non-legacy bounty snakes</a>.
              Daemons only have to accept non-legacy type requests and return non-legacy type responses
              see the <a href="#types" className="u">type</a> section for more information
            </p>
            <div className="Documentation__more">
              <ButtonGroup>
                <LinkButton to="/daemons">See Daemons</LinkButton>
                { viewer && <LinkButton to="/daemons/create">Register a Daemon</LinkButton> }
              </ButtonGroup>
            </div>
            <div>
              <h4 className="Documentation__title">Request Schema</h4>
              <Table className="Documentation__table" columns={ ["Field", "Type", "Example"] } striped>
                <tr>
                  <td colSpan={ 3 }>
                    The <code>Daemon Update</code> endpoint receives almost the same data as the <a href="#move"><code>Move</code></a> endpoint.
                    The primary difference is the absense of the <code>you</code> field, and any <i>legacy</i> features.
                  </td>
                </tr>
              </Table>

              <div className="Documentation__more">
                <a href="#move">Go to <code>/move</code></a>
              </div>

              <h4 className="Documentation__title">Response Schema</h4>
              <Table className="Documentation__table" columns={ ["Field", "Type", "Example"] } striped>
                <tr>
                  <td><code>$spawn</code></td>
                  <td>Object</td>
                  <td>...</td>
                </tr>
                <tr>
                  <td><code>$spawn</code></td>
                  <td>Object</td>
                  <td>...</td>
                </tr>
              </Table>
            </div>
          </Section>
        </Container>
      </div>
    )
  }

  renderBountyCheck () {
    const { exampleUrl } = this.props

    return (
      <Section>
        <h4 className="Documentation__title">Request Schema</h4>
        <Table className="Documentation__table" columns={ ["Field", "Type", "Example"] } striped>
          <tr>
            <td colSpan={ 3 }>
              The <code>Check Bounty</code> endpoint receives the same data as the <a href="#move"><code>Move</code></a> endpoint.
            </td>
          </tr>
        </Table>

        <div className="Documentation__more">
          <a href="#move">Go to <code>/move</code></a>
        </div>

        <h4 className="Documentation__title">Response Schema</h4>
        <Table className="Documentation__table" columns={ ["Field", "Type", "Example"] } striped>
          <tr>
            <td>continue</td>
            <td>Boolean</td>
            <td><code>true</code>/<code>false</code></td>
          </tr>
          <tr>
            <td>message</td>
            <td>String</td>
            <td>...</td>
          </tr>
        </Table>

        <h4 className="Documentation__title">Example</h4>
        <Example endpoint="bounty/check" data={ this.getExampleJson() } url={ exampleUrl } />
      </Section>
    )
  }

  renderMove (bounty = false) {
    const { exampleUrl, isLegacy } = this.props

    return (
      <Section>
        <h4 className="Documentation__title">Request Schema</h4>
        <Table className="Documentation__table" columns={ ["Field", "Type", "Example"] } striped>
          <tr>
            <td><code>you</code></td>
            <td>String (UUIDv4)</td>
            <td><code>5ac7cf8b-4b04-476a-b6a6-16bd8c83c048</code></td>
          </tr>
          <tr>
            <td><code>width</code></td>
            <td>Number</td>
            <td>20</td>
          </tr>
          <tr>
            <td><code>height</code></td>
            <td>Number</td>
            <td>20</td>
          </tr>
          <tr>
            <td><code>legacy</code></td>
            <td>Boolean</td>
            <td><code>true</code>/<code>false</code></td>
          </tr>
          <tr>
            <td><code>turn</code></td>
            <td>Number</td>
            <td>1</td>
          </tr>
          <tr>
            <td><code>{ isLegacy ? "game_id" : "gameId" }</code></td>
            <td>String (UUIDv4)</td>
            <td><code>5ac7cf8b-4b04-476a-7c7c-16bd8c83c048</code></td>
          </tr>
          <tr>
            <td><code>food</code></td>
            <td><a href="#type/position">Position</a>[]</td>
            <td>
              <code>
                { isLegacy
                  ? `[[5, 5], [15, 15], ...]`
                  : `[{ x: 5, y: 5 }, { x: 15, y: 15 }, ...]`
                }
              </code>
            </td>
          </tr>
          <tr>
            <td><code>gold</code></td>
            <td><a href="#type/position">Position</a>[]</td>
            <td>
              <code>
                { isLegacy
                  ? `[[10, 10], ...]`
                  : `[{ x: 10, y: 10 }, ...]`
                }
              </code>
            </td>
          </tr>
          { !isLegacy && (
            <tr>
              <td><code>teleporters</code></td>
              <td>(<a href="#type/position">Position</a>{ ` & { channel: boolean }` })[]</td>
              <td><code>[{ `{ x: 5, y: 15, channel: 1 }` }, ...]</code></td>
            </tr>
          ) }
          <tr>
            <td><code>snakes</code></td>
            <td><a href="#type/snake">Snake</a>[]</td>
            <td><code>/* See Snake Type */</code></td>
          </tr>
          <tr>
            <td><code>{ isLegacy ? "dead_snakes" : "deadSnakes" }</code></td>
            <td><a href="#type/snake">Snake</a>[]</td>
            <td><code>/* See Snake Type */</code></td>
          </tr>
        </Table>

        <h4 className="Documentation__title">Response Schema</h4>
        <Table className="Documentation__table" columns={ ["Field", "Type", "Example"] } striped>
          <tr>
            <td><code>name</code></td>
            <td>String</td>
            <td>SaaSnake</td>
          </tr>
          <tr>
            <td><code>head_image</code></td>
            <td>String (url)</td>
            <td>...</td>
          </tr>
          <tr>
            <td><code>taunt</code> - Optional</td>
            <td>String</td>
            <td>...</td>
          </tr>
          { bounty && (
            <tr>
              <td><code>meta</code> - Optional</td>
              <td><a href="#type/moveresponsemeta"><code>MoveResponseMeta</code></a> - JSON</td>
              <td>...</td>
            </tr>
          ) }
        </Table>

        <h4 className="Documentation__title">Example</h4>
        <Example endpoint="move" data={ this.getExampleJson() } url={ exampleUrl } />
      </Section>
    )
  }

  renderStart () {
    const { exampleUrl, isLegacy } = this.props

    const requestJson = {
      gameId: "5ac7cf8b-4b04-476a-b6a6-16bd8c83c048",
      game_id: "5ac7cf8b-4b04-476a-b6a6-16bd8c83c048",
      width: 20,
      height: 20
    }

    return (
      <Section>
        <h4 className="Documentation__title">Request Schema</h4>
        <Table className="Documentation__table" columns={ ["Field", "Type", "Example"] } striped>
          <tr>
            <td>{ isLegacy ? <code>game_id</code> : <code>gameId</code> }</td>
            <td>String (UUIDv4)</td>
            <td><code>5ac7cf8b-4b04-476a-b6a6-16bd8c83c048</code></td>
          </tr>
          <tr>
            <td><code>width</code></td>
            <td>Number</td>
            <td>20</td>
          </tr>
          <tr>
            <td><code>height</code></td>
            <td>Number</td>
            <td>20</td>
          </tr>
        </Table>

        <h4 className="Documentation__title">Response Schema</h4>
        <Table className="Documentation__table" columns={ ["Field", "Type", "Example"] } striped>
          <tr>
            <td><code>name</code></td>
            <td>String</td>
            <td>SaaSnake</td>
          </tr>
          <tr>
            <td><code>head_url</code> - Optional</td>
            <td>String (url)</td>
            <td>...</td>
          </tr>
          <tr>
            <td><code>taunt</code> - Optional</td>
            <td>String</td>
            <td>...</td>
          </tr>
          <tr>
            <td><code>color</code> - Optional</td>
            <td>String (Hex)</td>
            <td>...</td>
          </tr>
          <tr>
            <td><code>tail_type</code> - Optional</td>
            <td>Coming Soon</td>
            <td>...</td>
          </tr>
          <tr>
            <td><code>head_type</code> - Optional</td>
            <td>Coming Soon</td>
            <td>...</td>
          </tr>
        </Table>

        <h4 className="Documentation__title">Example</h4>
        <Example endpoint="start" data={ requestJson } url={ exampleUrl } />
      </Section>
    )
  }

  renderTypes () {
    const { isLegacy } = this.props

    const snakeSchema = isLegacy
      ? `
        {
          id: UUID
          name: String
          head_url: String
          color: String
          health_points: Number
          coords: [x, y][]
          taunt: String
        }`
      : `
        {
          id: UUID
          name: String
          head_url: String
          color: String
          health: Number
          coords: { x: number, y: number, channel: number }[]
          taunt: String
        }`

    return (
      <div>
        <Container>
          <a className="Documentation__anchor" href="#types">
            <h2 id="types" className="Documentation__title">Types</h2>
          </a>
        </Container>

        <Anchor anchor="type/snake" title="Snake Schema" />
        <Section wrapper={ Container }>
          <Code className="Documentation__code" format={ true }>{ snakeSchema }</Code>

          <p>
            <b>notes</b>: the <code>color</code> field is the default color.
            However, body segment colors can be overriden in a <code>/move</code> endpoint response.
          </p>
        </Section>

        { !isLegacy && (
          <div>
            <Anchor anchor="type/moveresponsemeta" title="MoveResponseMeta Schema" />
            <Section wrapper={ Container }>
              <p><code>MoveResponseMeta</code></p>
              <Code>
                { `
                  {
                  snakes: {
                    [snakeId]: {
                      health: Number
                      coords: Position[]
                    }
                  },
                  food: {
                    $spawn: Position[],
                    $destroy: Position[]
                  },
                  gold: {
                    $spawn: Position[],
                    $destroy: Position[]
                  }
                }
              ` }
              </Code>
            </Section>
          </div>
        ) }

        <Anchor anchor="type/position" title="Position Schema" />
        <Section wrapper={ Container }>
          <Code className="Documentation__code">
            { isLegacy ? `[x, y] // [0, 0]` : `{ x: number, y: number }` }
          </Code>
          <p>
            <b>notes</b>: the board is zero indexed from the top, left corner.
          </p>
        </Section>
      </div>
    )
  }

  render () {
    const { exampleUrl, isLegacy, selectedSnake, setExampleUrl, setIsLegacy, setSelectedSnake } = this.props
    const { viewer } = this.props

    const onSnakeChanged = (snakeId: string) => {
      const snake = snakeId
        ? viewer.snakes.edges.find(({ node: { id } }) => id === snakeId).node
        : null

      setSelectedSnake(snakeId)
      setIsLegacy(snake && !!snake.apiVersion)
      setExampleUrl(snake ? snake.url : defaultExampleUrl)
    }

    const snakes = viewer
      ? viewer.snakes.edges
      : []

    return (
      <div className="Documentation">
        <Container>
          <h2 className="Documentation__title">Testing</h2>
          <Well className="Documentation__settings">
            <p>Use the interactive components of this page to test your snake</p>
            <FieldGroup equalWidth>
              <Select
                disabled={ !viewer }
                name="snake"
                onChange={ (value) => onSnakeChanged(value) }
                options={ snakes.map(({ node: snake }) => {
                  return { label: snake.name, value: snake.id }
                }) }
                placeholder="Select a snake"
                value={ selectedSnake }
                showValue
              />
              <TextInput
                name="exampleUrl"
                inlineLabel="Testing URL"
                value={ exampleUrl }
                onChange={ ({ target }) => setExampleUrl(target.value) }
                onBlur={ ({ target }) => setExampleUrl(target.value && target.value.length ? target.value : defaultExampleUrl) }
              />
            </FieldGroup>
            <p>
              Make sure the proper <code>Access-Control-*</code> headers are set
              to allow either the wildcard (<code>"*"</code>) or <code>{ window.location.origin }</code> origin as
              well as the <code>OPTIONS, GET, POST</code> verbs. The example request is sent via the local browser session and
              is restricted by CORS. Your production snake does not need these headers.
            </p>
            <div>
              <h4 className="Documentation__title">Legacy Mode</h4>
              <p>
                Legacy mode conforms to the traditional BattleSnake data schema. Unless you've written your snake specifically
                for SaaS, you'll want to enable legacy mode here and in your snake settings.
              </p>
              <Checkbox
                name="isLegacy"
                label={ selectedSnake ? "Automatically set based on selected snake" : "Legacy mode" }
                checked={ isLegacy }
                onChange={ (isChecked) => setIsLegacy(isChecked) }
              />
            </div>
          </Well>
        </Container>

        <Container>
          <a className="Documentation__anchor" href="#general">
            <h2 id="general" className="Documentation__title">General</h2>
          </a>
        </Container>


        <Anchor anchor="start" endpoint="/start" method="POST" title="Start" />
        <Container>
          { this.renderStart() }
        </Container>

        <Anchor anchor="move" endpoint="/move" method="POST" title="Move" />
        <Container>
          { this.renderMove() }
        </Container>

        { !isLegacy && (
          <div>
            <Container>
              <a className="Documentation__anchor" href="#bounty">
                <h2 id="bounty" className="Documentation__title">Bounty</h2>
              </a>
            </Container>

            <Anchor anchor="bounty/check" endpoint="/bounty/check" method="POST" title="Check Bounty Win Conditions" />
            <Container>{ this.renderBountyCheck() }</Container>


            <Anchor anchor="bounty/move" endpoint="/bounty/move" method="POST" title="Move" />
            <Container>{ this.renderMove(true) }</Container>
          </div>
        ) }

        { this.renderDaemons() }
        { this.renderTypes() }
      </div>
    )
  }
}

export default compose<any, any>(
  createContainer({
    fragments: {
      viewer: () => Relay.QL`
        fragment on User {
          snakes(first: 10) {
            edges {
              node {
                id
                name
                url
              }
            }
          }
        }
      `
    }
  }),
  getContext({ router: PropTypes.object }),
  withState("exampleUrl", "setExampleUrl", defaultExampleUrl),
  withState("isLegacy", "setIsLegacy", false),
  withState("selectedSnake", "setSelectedSnake", null)
)(Documentation)
