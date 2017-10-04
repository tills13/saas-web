import * as Relay from "react-relay/classic"

interface CreateUserMutationProps {
  username: string
  password: string
  confirmPassword: string
  email: string
}

export class CreateUserMutation extends Relay.Mutation<CreateUserMutationProps, any> {
  getMutation() {
    return Relay.QL`mutation { createUserMutation }`
  }

  getVariables() {
    return {
      createUserInput: {
        username: this.props.username,
        password: this.props.password,
        confirmPassword: this.props.confirmPassword,
        email: this.props.email
      }
    }
  }

  getFatQuery() {
    return Relay.QL`
      fragment on CreateUserMutationPayload {
        user
        token
      }
    `
  }

  getConfigs() {
    return [{
      type: "REQUIRED_CHILDREN",
      children: [
        Relay.QL`
          fragment on CreateUserMutationPayload {
            user
            token
          }
        `
      ]
    }]
  }
}