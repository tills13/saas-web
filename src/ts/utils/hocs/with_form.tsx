import React from "react"

interface WithFormState {
  err: Error
  formData: { [ fieldName: string ]: string }
}

function isEvent (x: any): x is React.SyntheticEvent {
  return x && x.target
}

export function withForm () {
  return Component => {
    return class extends React.Component<{}, WithFormState> {
      state: WithFormState = { err: null, formData: {} }

      handleSubmit = (callback: (event: React.FormEvent, formData: any) => Promise<any>): React.FormEventHandler => {
        return (event: React.FormEvent) => {
          event.preventDefault()
          event.stopPropagation()

          callback(event, this.state.formData)
            .catch(err => this.setState({ err }))
        }
      }

      private setFieldValue = (name: string, value: any) => {
        this.setState(({ formData }) => {
          return {
            formData: { ...formData, [ name ]: value }
          }
        })
      }

      onFieldChange = (eventOrName: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => {
        if (typeof eventOrName === "string") {
          return (value: any) => {
            console.log(value)
            this.setFieldValue(eventOrName, value)
          }
        }

        eventOrName.persist()
        this.setFieldValue(eventOrName.target.name, eventOrName.target.value)
      }

      reset = () => this.setState({ err: null, formData: {} })

      render () {
        const { err, formData } = this.state

        return (
          <Component
            error={ err }
            formData={ formData }
            handleSubmit={ this.handleSubmit }
            onFieldChange={ this.onFieldChange }
            reset={ this.reset }
            { ...this.props }
          />
        )
      }
    }
  }
}
