import { range } from "lodash"
import * as React from "react"
import * as Relay from "react-relay/classic"
import { compose, defaultProps, withState } from "recompose"
import { Field, reduxForm } from "redux-form"

import ErrorBoundary from "components/error_boundary"
import Button from "components/form/button"
import FileUpload from "components/form/file_upload"
import Select from "components/form/select"
import Loader from "components/loader"
import Pagination from "components/pagination"
import ProgressBar from "components/progress_bar"

import createRelayContainer from "components/create_relay_container"
import { showNotification } from "components/notification"
import { paginate, PaginationProps } from "components/pagination/paginate"

class Test extends React.Component<any, any> {
  renderButtons() {
    return (
      <div className="Test__Buttons">
        <Button>Test</Button>
        <Button color={ Button.COLOR_GREEN }>Test</Button>
        <Button color={ Button.COLOR_BLUE }>Test</Button>
        <Button color={ Button.COLOR_RED }>Test</Button>
        <br />
        <Button fill>Test</Button>
        <Button color={ Button.COLOR_GREEN } fill>Test</Button>
        <Button color={ Button.COLOR_BLUE } fill>Test</Button>
        <Button color={ Button.COLOR_RED } fill>Test</Button>
        <br />
        <Button disabled>Test</Button>
        <Button color={ Button.COLOR_GREEN } disabled>Test</Button>
        <Button color={ Button.COLOR_BLUE } disabled>Test</Button>
        <Button color={ Button.COLOR_RED } disabled>Test</Button>
        <br />
        <Button fill disabled>Test</Button>
        <Button color={ Button.COLOR_GREEN } fill disabled>Test</Button>
        <Button color={ Button.COLOR_BLUE } fill disabled>Test</Button>
        <Button color={ Button.COLOR_RED } fill disabled>Test</Button>
      </div>
    )
  }

  renderLoaders() {
    return (
      <div className="Test__loaders">
        <Loader sideLength={ 2 } />
        <Loader sideLength={ 3 } />
        <Loader sideLength={ 4 } />
        <Loader sideLength={ 5 } />
      </div>
    )
  }

  renderNotification() {
    const onClick = () => {
      showNotification(`${ Math.random() * 10000 }`)
    }

    return (
      <Button onClick={ onClick }>Show Notification</Button>
    )
  }

  render() {
    const { above, setIsAbove, application: { games }, pagination } = this.props
    const { selected, setSelected } = this.props

    const after = pagination.after
    const itemsPerPage = pagination.itemsPerPage

    const options = [
      { label: "Something", value: 0 },
      { label: "Something", value: 1 },
      { label: "Something", value: 2 },
      { label: "Something", value: 3 },
      { label: "Something", value: 4 },
      { label: (value) => `Something ${ value }`, value: 5 }
    ]

    return (
      <div className="Test">
        { this.renderButtons() }
        { this.renderNotification() }
      </div>
    )

    /*return (
      <div style={ { height: 1200 } }>
        <div style={ { marginTop: 600 } }>
          <Select
            name="test"
            onChange={ setSelected }
            options={ options }
            value={ selected }
            up={ above }
            inline
          />
          <Button onClick={ () => setIsAbove(!above) }>Toggle Above</Button>
        </div>
      </div>
    )*/
  }
}

export default compose(
  createRelayContainer({
    initialVariables: {
      after: null,
      limit: 10
    },
    fragments: {
      application: () => Relay.QL`
        fragment on Application {
          games(limit: $limit) {
            items { id }
            pageInfo { count }
          }
        }
      `
    }
  }),
  paginate(({ application, relay, ...rest }) => {
    const { games: { pageInfo: { count } } } = application
    const { after, limit } = relay.variables

    return {
      after,
      itemsPerPage: limit,
      onChangeItemsPerPage: (mLimit) => relay.setVariables({ limit: mLimit }),
      totalItems: count,
      onClickNextPage: () => relay.setVariables({ after: after + limit }),
      onClickPreviousPage: () => relay.setVariables({ after: after - limit })
    }
  }),
  withState("above", "setIsAbove", true),
  withState("selected", "setSelected", 0)
)(Test)

// export default reduxForm({ form: "Test" })(Test)
