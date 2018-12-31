import "./index.scss"

import classnames from "classnames"
import { withRouter, WithRouter } from "found"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { compose, withProps } from "recompose"

import Alert from "components/Alert"
import ButtonGroup from "components/ButtonGroup"
import Button from "components/Button"
import Select from "components/Select"
import TextInput from "components/TextInput"

import { FormProps, withForm } from "utils/hocs"

import { enumToSelect, VISIBILITY_PUBLIC, VisibilityEnum } from "relay/enums"
import { createDaemon, deleteDaemon, updateDaemon } from "relay/mutations"

import { Color } from "enums/Color"
import { CreateDaemonMutationResponse } from "../../../__artifacts__/CreateDaemonMutation.graphql"
import { UpdateDaemonMutationResponse } from "../../../__artifacts__/UpdateDaemonMutation.graphql"

interface CreateEditDaemonFormProps {
  className?: string
  daemon?: Models.Daemon | null
}

type MutationResponse = UpdateDaemonMutationResponse | CreateDaemonMutationResponse
type Props = CreateEditDaemonFormProps & FormProps & WithRouter

class CreateEditDaemonForm extends React.Component<Props> {
  onClickDelete = () => {
    const { daemon, router } = this.props

    return deleteDaemon({ daemonId: daemon!.id }).then(_ => {
      router.push("/daemons")
    })
  }

  onSubmit = (_event: any, data: any) => {
    const { daemon } = this.props

    const mutation: Promise<MutationResponse> = daemon
      ? updateDaemon({ daemonId: daemon.id, ...data })
      : createDaemon(data)

    return mutation
  }

  render () {
    const { className, daemon, error, field, handleSubmit, pristine, reset } = this.props
    const mClassName = classnames("CreateEditDaemonForm", className)

    return (
      <form className={ mClassName } onSubmit={ handleSubmit(this.onSubmit) }>
        { error && <Alert alertType="danger">{ error.message || error.name || "something went wrong" }</Alert> }

        <TextInput label="Name" placeholder="name" { ...field("name") } />
        <TextInput label="URL" placeholder="url" { ...field("url") } />

        <TextInput
          label="Description"
          placeholder="description"
          rows={ 5 }
          { ...field("description") }
        />

        <Select
          label="Visibility"
          options={ enumToSelect(VisibilityEnum) }
          { ...field("visibility") }
        />

        <div className="CreateEditDaemonForm__footer">
          <ButtonGroup>
            <Button disabled={ pristine && !error }>
              { daemon ? "Update" : "Create" } Daemon
            </Button>
            <Button onClick={ reset } type="clear">
              { daemon ? "Reset" : "Clear" }
            </Button>
            { daemon && (
              <Button color={ Color.Red } onClick={ this.onClickDelete } type="button">
                Delete
              </Button>
            ) }
          </ButtonGroup>
        </div>
      </form >
    )
  }
}

export default createFragmentContainer<CreateEditDaemonFormProps>(
  compose<any, CreateEditDaemonFormProps>(
    withRouter,
    withProps(({ daemon }: CreateEditDaemonFormProps) => ({
      initialFormData: {
        description: daemon ? daemon.description : "",
        name: daemon ? daemon.name : "",
        url: daemon ? daemon.url : "",
        visibility: daemon ? daemon.visibility : VISIBILITY_PUBLIC
      }
    })),
    withForm()
  )(CreateEditDaemonForm),
  graphql`
    fragment CreateEditDaemonForm_daemon on Daemon {
      id, name, url, description, visibility
    }
  `
)
