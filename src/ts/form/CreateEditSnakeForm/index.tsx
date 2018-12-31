import "./index.scss"

import { WithRouter, withRouter } from "found"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { compose, withProps } from "recompose"

import Alert from "components/Alert"
import ButtonGroup from "components/ButtonGroup"
import Button from "components/Button"
import Checkbox from "components/Checkbox"
import ColorPicker from "components/ColorPicker"
import FieldGroup from "components/FieldGroup"
import FileUpload from "components/FileUpload"
import Modal from "components/Modal"
import MessageModal from "components/Modal/MessageModal"
import Select from "components/Select"
import TextInput from "components/TextInput"

import { enumToSelect, VISIBILITY_PUBLIC, VisibilityEnum } from "relay/enums"
import { createSnake, deleteSnake, updateSnake } from "relay/mutations"

import { FormProps, withForm } from "utils/hocs"

import { CreateSnakeMutationResponse } from "../../../__artifacts__/CreateSnakeMutation.graphql"
import { UpdateSnakeMutationResponse } from "../../../__artifacts__/UpdateSnakeMutation.graphql"

import Color from "enums/Color"

interface CreateEditSnakeFormProps {
  snake: Models.Snake | null
}

interface CreateEditSnakeFormState {
  showDeleteModal: boolean
}

type Props = CreateEditSnakeFormProps & FormProps & WithRouter

const apiVersionOptions = [
  { label: "2017", value: "VERSION_2017" },
  { label: "2018", value: "VERSION_2018" }
]

class CreateEditSnakeForm extends React.Component<Props, CreateEditSnakeFormState> {
  state: CreateEditSnakeFormState = { showDeleteModal: false }

  handleDelete = () => {
    const { router, snake } = this.props

    return deleteSnake({ snakeId: snake!.id })
      .then(() => router.push("/snakes"))
      .catch(err => console.log(err))
  }

  onSubmit = (_: React.FormEvent, { head, ...rest }: any) => {
    const { router, snake } = this.props
    const data = { ...rest, headId: head.id }

    const mutation: Promise<CreateSnakeMutationResponse | UpdateSnakeMutationResponse> = snake
      ? updateSnake({ snakeId: snake.id, ...data })
      : createSnake(data)

    return mutation.then((data) => {
      if (!snake) {
        const snakeId = (data as CreateSnakeMutationResponse).createSnakeMutation!.snake!.id
        router.push(`/snakes/${ snakeId }/edit`)
      }
    })
      .catch(err => console.log("err", err))
  }

  onClickDelete = (_: React.MouseEvent<any>) => {
    this.setState({ showDeleteModal: true })
  }

  render () {
    const { error, field, formData, handleSubmit, snake } = this.props
    const { showDeleteModal } = this.state
    const { apiVersion, isBountySnake } = formData

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
          { ...field("bountyDescription") }
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
            label="BattleSnake API Version"
            options={ apiVersionOptions }
            clearable
            { ...field("apiVersion") }
          />
          <Select
            label="Visibility"
            options={ enumToSelect(VisibilityEnum) }
            { ...field("visibility") }
          />
        </FieldGroup>

        { apiVersion && (
          <Alert alertType="warning">
            { !snake && "Looks like you intend to create a legacy snake. " }
            It is recommend that you update your snake to support SaaS specific features
            such as teleporters, wrapping edges (coming soon), and gold.
          </Alert>
        ) }

        { showDeleteModal && (
          <Modal className="MessageModal">
            <MessageModal
              body={ `Are you sure you want to delete ${ snake!.name }?` }
              onClickPrimaryButton={ this.handleDelete }
              primaryButtonColor={ Color.Red }
              primaryButtonText={ `Delete ${ snake!.name }` }
              secondaryButtonColor={ Color.Green }
              secondaryButtonText="Cancel"
              title="`Delete Snake?"
            />
          </Modal>
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

export default createFragmentContainer<CreateEditSnakeFormProps>(
  compose<any, any>(
    withRouter,
    withProps((props: CreateEditSnakeFormProps) => ({
      initialFormData: {
        defaultColor: "#BADA55",
        visibility: VISIBILITY_PUBLIC,
        ...props.snake
      }
    })),
    withForm()
  )(CreateEditSnakeForm),
  graphql`
    fragment CreateEditSnakeForm_snake on Snake {
      id, apiVersion, name, defaultColor, devUrl, url, isBountySnake
      bountyDescription, visibility, head { id, name, url }
    }
  `
)
