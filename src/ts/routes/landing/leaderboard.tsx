import * as React from "react"

import { OrderedSet } from "immutable"
import { connect } from "react-redux"
import { compose } from "recompose"

interface LeaderboardComponentOwnProps {

}


/*interface LeaderboardComponentStateProps {
  currentUser: Models.
  topSnakes: OrderedSet<Snake>
  topUsers?: OrderedSet<User>
}

type LeaderboardComponentProps =
  LeaderboardComponentOwnProps &
  LeaderboardComponentDispatchProps &
  LeaderboardComponentStateProps*/

class LeaderboardComponent extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = { page: 0, itemsPerPage: 10 }
  }

  componentDidMount() { }

  render() {
    return (
      <div>

      </div>
    )
  }
}

export default compose(
  connect(null, {})
)(LeaderboardComponent)
