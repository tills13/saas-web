import "./index.scss"

import classnames from "classnames"
import React from "react"
import clickOutside from "react-click-outside"

import { find, isArray, isFunction, map, isEqual } from "lodash"

import Icon from "../../icon"
import Option from "./option"
import SelectedValue from "./selected_value"

import { compose, defaultProps, mapProps, SetStateCallback, withState } from "recompose"

export type SelectValueCallback = {
  (value: any): string
}

export type SelectOption = {
  value: any,
  label: string | SelectValueCallback
}

interface SelectInnerProps extends React.Props<any>, SelectOuterProps {
  isOpen: boolean,
  options: SelectOption[],
  searchTerm: string
  setSearchTerm: SetStateCallback<string>
  setIsOpen: SetStateCallback<boolean>
}

interface SelectOuterProps {
  className?: string,
  clearable?: boolean
  containerClassName?: string,
  disabled?: boolean
  emptyLabel?: string
  id?: string,
  inline?: boolean,
  inlineLabel?: string,
  input?: any
  label?: string,
  multiple?: boolean
  name: string,
  onChange?: (newValue: any) => void
  onSearch?: (term: string) => void
  options: (SelectOption | string)[],
  placeholder?: string
  searchable?: boolean
  showValue?: boolean
  up?: boolean
  small?: boolean
  value?: any
}

interface SelectState {
  options: SelectOption[]
  searchTerm?: string
}

class Select extends React.Component<SelectInnerProps, SelectState> {
  container: HTMLElement
  optionsContainer: HTMLElement

  static defaultProps = {
    emptyLabel: "Select a Value",
    clearable: false
  }

  constructor (props) {
    super(props)

    this.state = {
      options: props.options,
      searchTerm: ""
    }
  }

  componentWillUpdate (nextProps: SelectInnerProps) {
    if (!isEqual(nextProps.options, this.props.options)) {
      this.setState({ options: nextProps.options })
    }
  }

  clearValue = (event?: React.MouseEvent<any>) => {
    const { disabled, setIsOpen } = this.props
    event && event.stopPropagation()

    if (disabled) return

    this.onSelectValue(null)
    setIsOpen(false)
  }

  handleClickOutside = () => {
    const { setIsOpen } = this.props
    setIsOpen(false)
  }

  onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { onSearch, options: defaultOptions } = this.props
    const searchTerm = event.target.value

    if (onSearch) {
      this.setState({ searchTerm }, () => {
        onSearch(this.state.searchTerm)
      })

      return
    }

    const options = (!searchTerm || searchTerm === "")
      ? defaultOptions
      : defaultOptions.filter(({ label, value }) => {
        const mLabel = isFunction(label) ? label(value) : label

        return mLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
          value.toLowerCase().includes(searchTerm.toLowerCase())
      })

    this.setState({ options, searchTerm })
  }

  onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.stopPropagation()

    return false
  }

  onSelectValue = (newValue) => {
    const { disabled, multiple, onChange, setIsOpen, setSearchTerm, value } = this.props

    if (disabled) return

    const mValue = multiple && newValue !== null
      ? [ ...(value || []), newValue ]
      : newValue

    onChange(mValue)
    setSearchTerm("")
    setIsOpen(multiple)
  }

  shouldRenderUp () {
    const { up } = this.props
    if (!this.container) return up

    const offset = document.body.scrollTop - this.container.offsetTop
    const optionsContainerHeight = this.optionsContainer ? this.optionsContainer.clientHeight : 300

    if (Math.abs(offset) < optionsContainerHeight) return false
    else if (!up && (window.outerHeight - this.container.offsetTop < optionsContainerHeight)) return true
    else return up
  }

  toggleOpen = (event: React.MouseEvent<any>) => {
    const { isOpen, setIsOpen } = this.props
    event.stopPropagation()

    setIsOpen(!isOpen)
  }

  renderOptions () {
    const { multiple, value } = this.props
    const { options, searchTerm } = this.state

    if (options.length === 0) {
      return (
        <div className="SelectOption">
          { searchTerm
            ? `Nothing found for ${ searchTerm }`
            : "Nothing here..." }
        </div>
      )
    }

    return options.map(({ label, value: mValue }) => {
      const alreadySelected = multiple && isArray(value)
        ? value.indexOf(mValue) >= 0
        : value === mValue

      return (
        <Option
          key={ mValue }
          label={ label }
          onClick={ this.onSelectValue }
          value={ mValue }
          selected={ alreadySelected }
          showValue
        />
      )
    })
  }

  renderSearch () {
    const { setIsOpen } = this.props
    const { searchTerm } = this.state

    const onFocus = () => setIsOpen(true)
    const onKeyDown = (event: React.KeyboardEvent<any>) => {
      const keyCode = event.keyCode

      if (keyCode === 13) {
        event.preventDefault()
        event.stopPropagation()
      }
    }

    return (
      <input
        className="Select__search"
        name="search"
        placeholder="Search..."
        onChange={ this.onSearch }
        onFocus={ onFocus }
        onKeyDown={ onKeyDown }
        value={ searchTerm }
        autoComplete="off"
      />
    )
  }

  renderValue () {
    const { emptyLabel, multiple, onChange, options, searchable, showValue, value } = this.props

    if (multiple && isArray(value)) {
      const mValues = options.filter((option) => {
        return value.indexOf(option.value) >= 0
      })

      return (
        <div className="Select__value">
          { mValues.map(({ label, value: mValue }) => {
            const unselectOption = (event: React.MouseEvent<any>) => {
              event.stopPropagation()
              onChange(value.filter((vValue) => mValue !== vValue))
            }

            return (
              <SelectedValue
                key={ mValue }
                unselect={ unselectOption }
              >
                { label }
              </SelectedValue>
            )
          }) }
          { searchable && this.renderSearch() }
        </div>
      )
    } else {
      if (value === null) return searchable ? this.renderSearch() : null
      const mValue = find(options, (option) => option.value === value)

      if (!mValue) {
        return (
          <div className="Select__placeholder">
            { emptyLabel }
          </div>
        )
      }

      const mLabel = isFunction(mValue.label) ? mValue.label(mValue.value) : mValue.label

      return (
        <div className="Select__value">
          { mLabel }
          { showValue && <span>({ mValue.value })</span> }
        </div>
      )
    }
  }

  render () {
    const {
      className, clearable, containerClassName, disabled, emptyLabel, id,
      inline, isOpen, label, multiple, placeholder, searchable, setIsOpen, small, value
    } = this.props

    const mContainerClassName = classnames("Select__container", containerClassName, {
      "--inline": inline,
      "--up": this.shouldRenderUp(),
      "--hasLabel": !!label
    })

    const mClassName = classnames("Select", className, {
      "--disabled": disabled,
      "--multiple": multiple,
      "--small": small
    })

    return (
      <div className={ mContainerClassName } ref={ (mRef) => this.container = mRef }>
        { label && <label className="Select__label" htmlFor={ id || name }>{ label }</label> }
        <div className={ mClassName } onClick={ () => setIsOpen(true) }>
          { !searchable && (value == null) && (placeholder || emptyLabel) && (
            <div className="Select__placeholder">
              { placeholder || emptyLabel }
            </div>
          ) }
          { this.renderValue() }
          { (value != null) && clearable && (
            <Icon
              containerClassName="Select__icon"
              className="Select__clearIcon"
              icon="times"
              onClick={ this.clearValue }
            />
          ) }
          <Icon
            containerClassName="Select__icon Select__toggle"
            icon={ isOpen ? "chevron-up" : "chevron-down" }
            onClick={ this.toggleOpen }
          />
        </div>
        { isOpen && (
          <div
            className="Select__optionsContainer"
            ref={ (mRef) => this.optionsContainer = mRef }
            onScroll={ this.onScroll }
          >
            <div className="Select__options">
              { this.renderOptions() }
            </div>
          </div>
        ) }
      </div >
    )
  }
}

export default compose<SelectInnerProps, SelectOuterProps>(
  mapProps(({ inline, inlineLabel, input, label, multiple, options, value, ...rest }: SelectOuterProps) => {
    const mValue = input ? input.value : value
    const mOptions = options.map(option => {
      return typeof option === "string"
        ? { label: option, value: option }
        : option
    })

    return {
      ...input,
      ...rest,
      inline: inline || inlineLabel,
      label: (inline && inlineLabel) || label,
      multiple,
      options: mOptions,
      value: (mValue == null || mValue === "") ? (multiple ? [] : null) : mValue
    }
  }),
  withState("isOpen", "setIsOpen", false),
  withState("searchTerm", "setSearchTerm", "")
)(clickOutside(Select))
