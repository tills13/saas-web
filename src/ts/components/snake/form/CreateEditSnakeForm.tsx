import "./CreateEditSnakeForm.scss"

import { showModal } from "actions"
import { WithRouter, withRouter } from "found"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { compose, withProps } from "recompose"

import Alert, { AlertType } from "../../alert"
import ButtonGroup from "../../button/button_group"
import Button from "../../form/button"
import Checkbox from "../../form/checkbox"
import ColorPicker from "../../form/color_picker"
import FieldGroup from "../../form/field_group"
import FileUpload from "../../form/file_upload"
import Select from "../../form/select"
import TextInput from "../../form/text_input"
import { MessageModal, MessageModalProps } from "modals/message_modal"

import { enumToSelect, VisibilityEnum } from "relay/enums"
import { createSnake, deleteSnake, updateSnake, CreateSnakeMutationInput } from "relay/mutations"

import { showNotification } from "../../notification"
import { withForm, FormProps } from "utils/hocs"

import { CreateSnakeMutationResponse } from "../../../../__artifacts__/CreateSnakeMutation.graphql"
import { UpdateSnakeMutationResponse } from "../../../../__artifacts__/UpdateSnakeMutation.graphql"

import Color from "enums/Color"

interface CreateEditSnakeFormProps extends FormProps, WithRouter {
  formValues: { [ field: string ]: any }
  snake?: Models.Snake
}

class CreateEditSnakeForm extends React.Component<CreateEditSnakeFormProps, any> {
  handleDelete = () => {
    const { router, snake } = this.props

    return deleteSnake({ snakeId: snake.id })
      .then(() => router.push("/snakes"))
      .catch(err => console.log(err))
  }

  onSubmit = (_: React.FormEvent, { head, ...rest }: any) => {
    const { router, snake } = this.props
    const data = { ...rest, headId: head.id }

    const mutation: Promise<CreateSnakeMutationResponse | UpdateSnakeMutationResponse> = snake
      ? updateSnake({ snakeId: snake.id, ...data })
      : createSnake(data)

    return mutation
      .then((data) => {
        if (!snake) {
          const snakeId = (data as CreateSnakeMutationResponse).createSnakeMutation.snake.id
          router.push(`/snakes/${ snakeId }/edit`)
        }
      })
      .catch(err => console.log("err", err))
  }

  onClickDelete = (event: React.MouseEvent<any>) => {
    const { snake } = this.props

    event.stopPropagation()

    // this.props.showModal<MessageModalProps>(MessageModal, {
    //   body: `Are you sure you want to delete ${ snake.name }?`,
    //   onClickPrimaryButton: this.handleDelete,
    //   primaryButtonColor: Button.COLOR_RED,
    //   primaryButtonText: `Delete ${ snake.name }`,
    //   secondaryButtonColor: Button.COLOR_GREEN,
    //   secondaryButtonText: "Cancel",
    //   title: `Delete Snake?`
    // })
  }

  render () {
    const { error, field, formData, handleSubmit, snake } = this.props
    const { apiVersion, defaultColor, isBountySnake } = formData
    const apiVersionOptions = [
      { label: "2017", value: "VERSION_2017" },
      { label: "2018", value: "VERSION_2018" }
    ]

    return (
      <form className="CreateEditSnakeForm" onSubmit={ handleSubmit(this.onSubmit) }>
        { error && <div className="alert alert-danger">{ error }</div> }

        <FieldGroup>
          <TextInput label="Name" placeholder="Name" { ...field("name") } />
          <ColorPicker label="Default Color" placeholder="Color" { ...field("defaultColor") } />
        </FieldGroup>

        <FieldGroup>
          <TextInput label="URL" placeholder="URL" { ...field("url") } />
          <TextInput label="Dev URL" placeholder="Development URL" { ...field("devUrl") } />
        </FieldGroup>

        <Checkbox
          label="Bounty Snake"
          containerClassName="InlineFields__labelOffset"
          { ...field("isBountySnake") }
        />

        <TextInput
          label="Bounty Description"
          disabled={ !isBountySnake }
          rows={ 4 }
          { ...field("bountDescriptiony") }
        />

        <FileUpload
          label="Head Image"
          placeholder="Head Image"
          uploadType="snake-head"
          limit={ 1 }
          { ...field("head") }
        />

        <FieldGroup>
          <Select
            containerClassName="InlineFields__labelOffset"
            label="API Version"
            options={ apiVersionOptions }
            { ...field("apiVersion") }
          />
          <Select
            label="Visibility"
            options={ enumToSelect(VisibilityEnum) }
            { ...field("visibility") }
          />
        </FieldGroup>

        { apiVersion && (
          <Alert alertType={ AlertType.Warning }>
            { !snake && "Looks like you intend to create a legacy snake. " }
            It is recommend that you update your snake to support SaaS specific features
            such as teleporters, wrapping edges (coming soon), and gold.
          </Alert>
        ) }

        <ButtonGroup className="CreateEditSnakeForm__footer">
          <Button>{ snake ? "Update" : "Create" } Snake</Button>
          <Button
            color={ Color.Red }
            disabled={ !snake }
            onClick={ this.onClickDelete }
            type="button"
          >
            Delete Snake
          </Button>
        </ButtonGroup>
      </form>
    )
  }
}

export default createFragmentContainer<any>(
  compose(
    withRouter,
    withProps((props: CreateEditSnakeFormProps) => ({ initialFormData: props.snake })),
    withForm()
  )(CreateEditSnakeForm),
  graphql`
    fragment CreateEditSnakeForm_snake on Snake {
      id, apiVersion, name, defaultColor, devUrl, url, isBountySnake
      bountyDescription, visibility, head { id, name, url }
    }
  `
)
