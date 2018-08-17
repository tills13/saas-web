import React from "react"

interface WithFormState {
  err: Error
  formData: { [ fieldName: string ]: string }
  pristine: boolean
}

export interface FormProps<F extends { [ fieldName: string ]: string } = any> {
  error: Error
  field: (name: string) => any
  formData: F
  handleSubmit: (callback: (event: React.FormEvent, formData: any) => Promise<any>) => React.FormEventHandler
  pristine: boolean
  reset: () => void
}

function isEvent (x: any): x is React.SyntheticEvent {
  return x && x.target
}

export type WithFormContainer<P> = React.ComponentType<Pick<P, Exclude<keyof P, keyof FormProps>>>

export function withForm<T = any> () {
  return function (Component: React.ComponentType<T & FormProps>): WithFormContainer<T> {
    return class extends React.Component<T & FormProps, WithFormState> {
      constructor (props) {
        super(props)

        this.state = { err: null, formData: props.initialFormData || {}, pristine: true }
      }

      private createField = (name: string) => {
        return {
          name,
          onChange: value => this.onFieldChange(name, value),
          value: this.state.formData[ name ] || ""
        }
      }

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
            pristine: false,
            formData: { ...formData, [ name ]: value }
          }
        })
      }

      onFieldChange = (name: string, eOrV: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string) => {
        if (isEvent(eOrV)) {
          eOrV.persist()
          this.setFieldValue(eOrV.target.name, eOrV.target.value)
          return
        }

        this.setFieldValue(name, eOrV)
      }

      reset = () => this.setState({ err: null, formData: {} })

      render () {
        const { err, formData, pristine } = this.state

        return (
          <Component
            error={ err }
            field={ this.createField }
            formData={ formData }
            handleSubmit={ this.handleSubmit }
            pristine={ pristine }
            reset={ this.reset }
            { ...this.props }
          />
        )
      }
    }
  }
}
