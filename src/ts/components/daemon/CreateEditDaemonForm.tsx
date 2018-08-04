import "./CreateEditDaemonForm.scss"

import classnames from "classnames"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { connect } from "react-redux"
import { compose, mapProps } from "recompose"

import Alert, { AlertType } from "../alert"
import ButtonGroup from "../button/button_group"
import Button from "../form/button"
import Select from "../form/select"
import TextInput from "../form/text_input"

import { enumToSelect, VISIBILITY_PRIVATE, VisibilityEnum } from "relay/enums"
// import { CreateDaemonMutation, UpdateDaemonMutation } from "relay/mutations"

import createRelayContainer from "../create_relay_container"
import { showNotification } from "../notification"
import { withMutation } from "utils/enhancers"
import { withForm } from "utils/hocs";

interface CreateEditDaemonFormProps {
  className?: string
  daemon?: Models.Daemon
}

class CreateEditDaemonForm extends React.Component<any, {}> {
  onSubmit = (data: any) => {
    const { daemon } = this.props
    // return mutate({ daemonId: daemon ? daemon.id : null, ...data }).then((response) => {
    //   const mDaemon = daemon
    //     ? response.updateDaemonMutation.daemon
    //     : response.createDaemonMutation.daemon

    //   showNotification(`Successfully ${ daemon ? "updated" : "created" } ${ mDaemon.name }`)
    // }).catch((err) => {
    //   return new SubmissionError({ _error: "Something went wrong..." })
    // })
  }

  render () {
    const { className, daemon, error, handleSubmit, pristine, reset } = this.props
    const mClassName = classnames("CreateEditDaemonForm", className)

    return (
      <form className={ mClassName } onSubmit={ handleSubmit(this.onSubmit) }>
        { error && <Alert alertType={ AlertType.Danger }>{ error }</Alert> }

        <TextInput
          name="name"
          label="Name"
          placeholder="name"
        />
        <TextInput
          name="url"
          label="URL"
          placeholder="url"
        />
        <TextInput
          name="description"
          label="Description"
          placeholder="description"
          rows={ 5 }
        />
        <Select
          name="visibility"
          label="Visibility"
          options={ enumToSelect(VisibilityEnum) }
        />

        <div className="CreateEditDaemonForm__footer">
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

export default createFragmentContainer(
  withForm()(CreateEditDaemonForm),
  graphql`
    fragment CreateEditDaemonForm_daemon on Daemon {
      id, name, url, description, visibility
    }
  `
)
