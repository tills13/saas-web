import React from "react"

import BaseModal, { BaseModalProps } from "../BaseModal"

interface FormModalComponentProps extends BaseModalProps {
  form: React.ComponentClass<any>
  formProps: any
}

function FormModal ({ form, formProps, ...rest }: FormModalComponentProps) {
  const mForm = React.createElement(form, {
    ...formProps
  })

  return <BaseModal content={ mForm } { ...rest } />
}

export default FormModal
