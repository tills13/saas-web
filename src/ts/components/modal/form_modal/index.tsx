import React from "react"

import { compose, withState } from "recompose"
import { BaseModal, BaseModalProps } from "../base"

interface FormModalComponentProps extends BaseModalProps {
  form: React.ComponentClass<any>
  formProps: any
}

export const FormModal = (props: FormModalComponentProps) => {
  const { form, formProps, ...rest } = props

  const mForm = React.createElement(form, {
    ...formProps
  })

  return <BaseModal content={ mForm } {...rest} />
}

export default FormModal
