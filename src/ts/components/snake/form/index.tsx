import "./index.scss"

import { showModal } from "actions"
import { PropTypes } from "prop-types"
import * as React from "react"
import { connect } from "react-redux"
import * as Relay from "react-relay/classic"
import { compose, getContext, mapProps } from "recompose"
import { Field, formValueSelector, InjectedFormProps, reduxForm, SubmissionError } from "redux-form"

import Alert from "components/alert"
import ButtonGroup from "components/button/button_group"
import Button from "components/form/button"
import Checkbox from "components/form/checkbox"
import ColorPicker from "components/form/color_picker"
import FieldGroup from "components/form/field_group"
import FileUpload from "components/form/file_upload"
import Select from "components/form/select"
import TextInput from "components/form/text_input"
import { MessageModal, MessageModalProps } from "components/modal/message_modal"

import { enumToSelect, VisibilityEnum } from "relay/enums"
import { CreateSnakeMutation, DeleteSnakeMutation, UpdateSnakeMutation } from "relay/mutations"

import creatRelayContainer from "components/create_relay_container"
import { showNotification } from "components/notification"
import { getFormValues } from "redux-form";

interface CreateEditSnakeFormInnerProps extends CreateEditSnakeFormOuterProps, InjectedFormProps {
  formValues: { [field: string]: any }
  router: any
  showModal: typeof showModal
}

interface CreateEditSnakeFormOuterProps {
  snake: Models.SnakeInterface
}

export class CreateEditSnakeForm extends React.Component<CreateEditSnakeFormInnerProps, any> {
  handleDelete = () => {
    const { router, snake } = this.props

    const mutation = new DeleteSnakeMutation({
      snakeId: snake.id
    })

    Relay.Store.commitUpdate(mutation, {
      onSuccess: () => router.push("/snakes"),
      onFailure: () => { }
    })
  }

  handleSubmit = ({ head, ...rest }: any) => {
    const { router, snake } = this.props
    const data = {
      headId: head.id,
      ...rest
    }

    const mutation = snake
      ? new UpdateSnakeMutation({ snakeId: snake.id, ...data })
      : new CreateSnakeMutation(data)

    return new Promise((resolve, reject) => {
      Relay.Store.commitUpdate(mutation, {
        onSuccess: (mMutation) => {
          const mSnake = snake
            ? mMutation.updateSnakeMutation.snake
            : mMutation.createSnakeMutation.snake

          showNotification(`Successfully ${ snake ? "updated" : "created" } ${ mSnake.name }`)

          if (!snake) router.push(`/snakes/${ mSnake.id }/edit`)
          resolve()
        },
        onFailure: (transaction) => {
          reject(new SubmissionError({ _error: `unable to ${ snake ? "update" : "create" } snake` }))
        }
      })
    })
  }

  onClickDelete = (event: React.MouseEvent<any>) => {
    const { snake } = this.props

    event.stopPropagation()

    this.props.showModal<MessageModalProps>(MessageModal, {
      body: `Are you sure you want to delete ${ snake.name }?`,
      onClickPrimaryButton: this.handleDelete,
      primaryButtonColor: Button.COLOR_RED,
      primaryButtonText: `Delete ${ snake.name }`,
      secondaryButtonColor: Button.COLOR_GREEN,
      secondaryButtonText: "Cancel",
      title: `Delete Snake?`
    })
  }

  render () {
    const { error, handleSubmit, pristine, snake } = this.props
    const { formValues: { isBountySnake, apiVersion } } = this.props
    const apiVersionOptions = [
      { label: "2017", value: "VERSION_2017" },
      { label: "2018", value: "VERSION_2018" }
    ]

    return (
      <form className="CreateEditSnakeForm" onSubmit={ handleSubmit(this.handleSubmit) }>
        { error && <div className="alert alert-danger">{ error }</div> }

        <FieldGroup>
          <Field
            label="Name"
            name="name"
            placeholder="Name"
            component={ TextInput }
          />
          <Field
            label="Default Color"
            name="defaultColor"
            placeholder="Color"
            component={ ColorPicker }
          />
        </FieldGroup>

        <FieldGroup>
          <Field
            label="URL"
            name="url"
            placeholder="URL"
            component={ TextInput }
          />
          <Field
            label="Dev URL"
            name="devUrl"
            placeholder="Development URL"
            component={ TextInput }
          />
        </FieldGroup>

        <Field
          label="Bounty Snake"
          name="isBountySnake"
          containerClassName="InlineFields__labelOffset"
          component={ Checkbox }
        />

        <Field
          label="Bounty Description"
          name="bountyDescription"
          component={ TextInput }
          disabled={ !isBountySnake }
          rows={ 4 }
        />

        <Field
          label="Head Image"
          name="head"
          placeholder="Head Image"
          component={ FileUpload }
          uploadType="snake-head"
          limit={ 1 }
        />

        <FieldGroup>
          <Field
            containerClassName="InlineFields__labelOffset"
            component={ Select }
            label="API Version"
            name="apiVersion"
            options={ apiVersionOptions }
          />
          <Field
            label="Visibility"
            name="visibility"
            component={ Select }
            options={ enumToSelect(VisibilityEnum) }
            clearable={ false }
          />
        </FieldGroup>

        { apiVersion && (
          <Alert type="warning">
            { !snake && "Looks like you intend to create a legacy snake. " }
            It is recommend that you update your snake to support SaaS specific features
            such as teleporters, wrapping edges (coming soon), and gold.
          </Alert>
        ) }

        <ButtonGroup className="CreateEditSnakeForm__footer">
          <Button disabled={ pristine }>
            { snake ? "Update" : "Create" } Snake
          </Button>
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

const mFormValueSelector = getFormValues("CreateEditSnakeForm")

export default compose<CreateEditSnakeFormInnerProps, CreateEditSnakeFormOuterProps>(
  creatRelayContainer({
    fragments: {
      snake: () => Relay.QL`
        fragment on Snake {
          id
          apiVersion
          name
          defaultColor
          devUrl
          url
          isBountySnake
          bountyDescription
          visibility

          head {
            id
            name
            url
          }
        }
      `
    }
  }),
  connect((state) => ({
    formValues: mFormValueSelector(state) || {}
  }), { showModal }),
  mapProps(({ snake, ...rest }) => {
    return {
      initialValues: {
        apiVersion: snake ? snake.apiVersion : null,
        bountyDescription: snake ? snake.bountyDescription : "",
        defaultColor: snake ? snake.defaultColor : "#114B5F",
        devUrl: snake ? snake.devUrl : "",
        head: snake ? snake.head : null,
        isBountySnake: snake ? snake.isBountySnake : false,
        name: snake ? snake.name : "",
        url: snake ? snake.url : "",
        visibility: snake ? snake.visibility : "PUBLIC"
      },
      snake,
      ...rest
    }
  }),
  reduxForm({ form: "CreateEditSnakeForm" }),
  getContext({ router: PropTypes.object })
)(CreateEditSnakeForm)
