import * as classnames from "classnames"
import * as moment from "moment"
import * as React from "react"

import { List } from "immutable"

interface SnakeListItemComponentOwnProps {
  snake: Models.SnakeInterface
  onClickEditSnake?: any
}

export const SnakeListItem = (props: SnakeListItemComponentOwnProps) => {
  const { snake } = props

  let reachable =
    (snake.lastCheckedAt && snake.lastSuccessfullyCheckedAt) &&
    snake.lastCheckedAt === snake.lastSuccessfullyCheckedAt

  const lastCheckedAt = moment(snake.lastCheckedAt)
  const daysSinceSuccessfulCheck = moment().diff(lastCheckedAt, "days")
  const status = reachable ? ((daysSinceSuccessfulCheck < 5) ? "ok" : "warn") : "danger"

  return (
    <div className="snake-container" key={ snake.id }>
      <div className="clearfix header">
        <img
          className="head-image"
          src={ snake.head.url }
          width={ 40 }
          height={ 40 }
        />
        <h3 className="name">{ snake.name }</h3>
        <code className="pull-right">{ snake.id }</code>
      </div>
      <div className="footer">
        <div className="row">
          <div className="col-sm-6 col-md-6">
            <pre className="endpoint">{ snake.url }</pre>
          </div>
          <div className="col-sm-6 col-md-6 text-right">
            <div className="btn btn-default btn-small" onClick={ props.onClickEditSnake }>
              Edit
                        </div>
            <span
              className={ `status ${ status }` }
              title={ `Last checked ${ daysSinceSuccessfulCheck } day(s) ago` }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

interface SnakeListComponentOwnProps {
  className?: string
  snakes: Models.SnakeInterface[]
  onClickEditSnake?: (snake: Models.SnakeInterface) => void
}

export class SnakeList extends React.Component<SnakeListComponentOwnProps, {}> {
  onClickEditSnake = (snake) => {
    const { onClickEditSnake } = this.props

    if (onClickEditSnake) onClickEditSnake(snake)
  }

  renderSnakes() {
    const { snakes } = this.props

    return snakes.map((snake) => {
      return (
        <SnakeListItem
          key={ snake.id }
          snake={ snake }
          onClickEditSnake={ () => { } }
        />)
    })
  }

  render() {
    const { className } = this.props
    const mClassName = classnames("SnakeList", className)

    return (
      <div className={ mClassName }>
        { this.renderSnakes() }
      </div>
    )
  }
}
