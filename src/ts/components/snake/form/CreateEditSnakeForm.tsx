import "./CreateEditSnakeForm.scss"

import { showModal } from "actions"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

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
import { CreateSnakeMutation, DeleteSnakeMutation, UpdateSnakeMutation } from "relay/mutations"

import { showNotification } from "../../notification"
import { withForm } from "utils/hocs"

interface CreateEditSnakeFormProps {
  formValues: { [ field: string ]: any }
  router: any
  showModal: typeof showModal
  snake?: Models.Snake
}

class CreateEditSnakeForm extends React.Component<any, any> {
  handleDelete = () => {
    const { router, snake } = this.props

    const mutation = new DeleteSnakeMutation({
      snakeId: snake.id
    })

    // Relay.Store.commitUpdate(mutation, {
    //   onSuccess: () => router.push("/snakes"),
    //   onFailure: () => { }
    // })
  }

  onSubmit = (event: React.FormEvent, data: any) => {
    console.log(data)

    return new Promise(resolve => {
      resolve()
    })


    // const { router, snake } = this.props
    // const data = { headId: head.id, ...rest }

    // const mutation = snake
    //   ? new UpdateSnakeMutation({ snakeId: snake.id, ...data })
    //   : new CreateSnakeMutation(data)

    // return new Promise((resolve, reject) => {
    //   // Relay.Store.commitUpdate(mutation, {
    //   //   onSuccess: (mMutation) => {
    //   //     const mSnake = snake
    //   //       ? mMutation.updateSnakeMutation.snake
    //   //       : mMutation.createSnakeMutation.snake

    //   //     showNotification(`Successfully ${ snake ? "updated" : "created" } ${ mSnake.name }`)

    //   //     if (!snake) router.push(`/snakes/${ mSnake.id }/edit`)
    //   //     resolve()
    //   //   },
    //   //   onFailure: (transaction) => {
    //   //     reject(new SubmissionError({ _error: `unable to ${ snake ? "update" : "create" } snake` }))
    //   //   }
    //   // })
    // })
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
    const { error, formData, handleSubmit, onFieldChange, snake } = this.props
    const { apiVersion, defaultColor, isBountySnake } = formData
    const apiVersionOptions = [
      { label: "2017", value: "VERSION_2017" },
      { label: "2018", value: "VERSION_2018" }
    ]

    return (
      <form className="CreateEditSnakeForm" onSubmit={ handleSubmit(this.onSubmit) }>
        { error && <div className="alert alert-danger">{ error }</div> }

        <FieldGroup>
          <TextInput label="Name" name="name" onChange={ onFieldChange } placeholder="Name" />
          <ColorPicker label="Default Color" name="defaultColor" onChange={ onFieldChange("defaultColor") } value={ defaultColor } placeholder="Color" />
        </FieldGroup>

        <FieldGroup>
          <TextInput label="URL" name="url" onChange={ onFieldChange } placeholder="URL" />
          <TextInput label="Dev URL" name="devUrl" onChange={ onFieldChange } placeholder="Development URL" />
        </FieldGroup>

        <Checkbox
          label="Bounty Snake"
          name="isBountySnake"
          containerClassName="InlineFields__labelOffset"
        />

        <TextInput
          label="Bounty Description"
          name="bountyDescription"
          disabled={ !isBountySnake }
          rows={ 4 }
        />

        <FileUpload
          label="Head Image"
          name="head"
          placeholder="Head Image"
          uploadType="snake-head"
          limit={ 1 }
        />

        <FieldGroup>
          <Select
            containerClassName="InlineFields__labelOffset"
            label="API Version"
            name="apiVersion"
            options={ apiVersionOptions }
          />
          <Select
            label="Visibility"
            name="visibility"
            options={ enumToSelect(VisibilityEnum) }
            clearable={ false }
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
            color={ Button.COLOR_RED }
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
  withForm()(CreateEditSnakeForm),
  graphql`
    fragment CreateEditSnakeForm_snake on Snake {
      id, apiVersion, name, defaultColor, devUrl, url, isBountySnake
      bountyDescription, visibility, head { id, name, url }
    }
  `
)

// export default compose<CreateEditSnakeFormInnerProps, CreateEditSnakeFormOuterProps>(
//   creatRelayContainer({
//     fragments: {
//       snake: () => Relay.QL`
//         fragment on Snake {
//           id
//           apiVersion
//           name
//           defaultColor
//           devUrl
//           url
//           isBountySnake
//           bountyDescription
//           visibility

//           head {
//             id
//             name
//             url
//           }
//         }
//       `
//     }
//   }),
//   connect((state) => ({
//     formValues: mFormValueSelector(state) || {}
//   }), { showModal }),
//   mapProps(({ snake, ...rest }) => {
//     return {
//       initialValues: {
//         apiVersion: snake ? snake.apiVersion : null,
//         bountyDescription: snake ? snake.bountyDescription : "",
//         defaultColor: snake ? snake.defaultColor : "#114B5F",
//         devUrl: snake ? snake.devUrl : "",
//         head: snake ? snake.head : null,
//         isBountySnake: snake ? snake.isBountySnake : false,
//         name: snake ? snake.name : "",
//         url: snake ? snake.url : "",
//         visibility: snake ? snake.visibility : "PUBLIC"
//       },
//       snake,
//       ...rest
//     }
//   }),
//   reduxForm({ form: "CreateEditSnakeForm" }),
//   getContext({ router: PropTypes.object })
// )(CreateEditSnakeForm)
