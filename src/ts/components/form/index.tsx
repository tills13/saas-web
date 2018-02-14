import "./index.scss"

import * as classnames from "classnames"
import * as React from "react"

interface FormProps {
  className?: string
  onSubmit: any
}

interface ContainerProps extends React.Props<any> {
  className?: string
}

interface FooterProps extends React.Props<any> {
  alignment?: "left" | "center" | "right"
  className?: string
}

interface HeaderProps extends React.Props<any> {
  className?: string
  size?: number
}

interface SectionProps extends React.Props<any> {
  className?: string
}

interface SubHeaderProps extends React.Props<any> {
  className?: string
  size?: number
}

/**
 * common form components and styles
 *
 * @example
 * <Form onSubmit={ handleSubmit(this.onSubmit) }>
 *   <Form.Header>Some Header</Form.Header>
 *   <Form.Container>
 *     <Form.Subheader size={ 3 }>Some Subheader</Form.Subheader>
 *     <Field/>
 *     ...
 *   </Form.Container>
 * </Form>
 */
export class Form extends React.Component<FormProps> {
  public static Container = ({ className, children }: ContainerProps) => (
    <div className={ classnames("Form__container", className) }>
      { children }
    </div>
  )

  public static Footer = ({ alignment = "right", className, children }: FooterProps) => (
    <div className={ classnames("Form__footer", `--${ alignment }`, className) }>
      { children }
    </div>
  )

  public static Header = ({ className, children, size = 4 }: HeaderProps) => {
    const HeaderComponent = `h${ size }`

    return (
      <HeaderComponent className={ classnames("Form__header", className) }>
        { children }
      </HeaderComponent>
    )
  }

  /* Section - part of a Container */
  public static Section = ({ className, children }: SectionProps) => (
    <div className={ classnames("Form__section", className) }>
      { children }
    </div>
  )

  public static SubHeader = ({ className, children, size = 4 }: SubHeaderProps) => {
    const HeaderComponent = `h${ size }`

    return (
      <HeaderComponent className={ classnames("Form__subHeader", className) }>
        { children }
      </HeaderComponent>
    )
  }

  render() {
    const { className, children, onSubmit } = this.props
    const mClassName = classnames("Form", className)

    return (
      <form className={ mClassName } onSubmit={ onSubmit }>
        { children }
      </form>
    )
  }
}

export default Form
