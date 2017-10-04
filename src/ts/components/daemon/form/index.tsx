import "./index.scss"

import * as classnames from "classnames"
import * as React from "react"
import * as Relay from "react-relay/classic"

import { connect } from "react-redux"
import { compose, mapProps } from "recompose"
import { Field, InjectedFormProps, reduxForm, SubmissionError } from "redux-form"
import { ApplicationState } from "../../../store"

import Alert from "components/alert"
import ButtonGroup from "components/button/button_group"
import Button from "components/form/button"
import Select from "components/form/select"
import TextInput from "components/form/text_input"

import { enumToSelect, VISIBILITY_PRIVATE, VisibilityEnum } from "relay/enums"
import { CreateDaemonMutation, UpdateDaemonMutation } from "relay/mutations"

import createRelayContainer from "components/create_relay_container"
import { showNotification } from "components/notification"
import { withMutation } from "utils/enhancers"

interface CreateOrEditDaemonFormInnerProps extends CreateOrEditDaemonFormOuterProps, InjectedFormProps {
  mutate: (data: any) => Promise<any>
}

interface CreateOrEditDaemonFormOuterProps {
  daemon?: Models.DaemonInterface
}



export class CreateOrEditDaemonForm extends React.Component<CreateOrEditDaemonFormInnerProps, any> {
  handleSubmit = (data: any) => {
    const { daemon, mutate } = this.props
    return mutate({ daemonId: daemon ? daemon.id : null, ...data }).then((response) => {
      const mDaemon = daemon
        ? response.updateDaemonMutation.daemon
        : response.createDaemonMutation.daemon

      showNotification(`Successfully ${ daemon ? "updated" : "created" } ${ mDaemon.name }`)
    }).catch((err) => {
      return new SubmissionError({ _error: "Something went wrong..." })
    })
  }

  render() {
    const mClassName = classnames("CreateOrEditDaemonForm")
    const { error, handleSubmit, pristine, reset } = this.props
    const { daemon } = this.props

    return (
      <form id="create-edit-game" className={ mClassName } onSubmit={ handleSubmit(this.handleSubmit) }>
        { error && <Alert type={ Alert.TYPE_DANGER }>{ error }</Alert> }

        <Field
          name="name"
          label="Name"
          placeholder="name"
          component={ TextInput }
        />
        <Field
          name="url"
          label="URL"
          placeholder="url"
          component={ TextInput }
        />
        <Field
          name="description"
          label="Description"
          placeholder="description"
          rows={ 5 }
          component={ TextInput }
        />
        <Field
          name="visibility"
          label="Visibility"
          component={ Select }
          options={ enumToSelect(VisibilityEnum) }
        />

        <div className="CreateOrEditDaemonForm__footer">
          <ButtonGroup>
            <Button disabled={ pristine && !error }>
              { daemon ? "Update" : "Create" } Daemon
            </Button>
            <Button onClick={ reset } type="clear">
              { daemon ? "Reset" : "Clear" }
            </Button>
          </ButtonGroup>
        </div>
      </form >
    )
  }
}

export default compose<CreateOrEditDaemonFormInnerProps, CreateOrEditDaemonFormOuterProps>(
  createRelayContainer({
    fragments: {
      daemon: () => Relay.QL`
        fragment on Daemon {
          id
          name
          url
          description
          visibility
        }
      `
    }
  }),
  connect((state, props) => {
    return {}
  }),
  mapProps(({ daemon, ...rest }) => {
    return {
      daemon,
      ...rest,
      initialValues: {
        name: daemon ? daemon.name : null,
        url: daemon ? daemon.url : null,
        description: daemon ? daemon.description : null,
        visibility: daemon ? daemon.visibility : VISIBILITY_PRIVATE
      }
    }
  }),
  reduxForm({
    enableReinitialize: true,
    keepDirtyOnReinitialize: true,
    form: "create-or-edit-daemon"
  }),
  withMutation((props) => props.daemon ? UpdateDaemonMutation : CreateDaemonMutation)
)(CreateOrEditDaemonForm)




