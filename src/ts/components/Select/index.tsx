import "./index.scss"

import classnames from "classnames"
import { find, isArray, isEqual, isFunction } from "lodash"
import React from "react"
import clickOutside from "react-click-outside"
import { compose, mapProps, SetStateCallback, withState } from "recompose"

import Icon from "../Icon"
import Option from "./option"
import SelectedValue from "./selected_value"

export type SelectValueCallback = {
  (value: any): string
}

export type Option = {
  value: any,
  label: string | SelectValueCallback
}

interface SelectInnerProps extends React.Props<any>, SelectOuterProps {
  isOpen: boolean,
  options: Option[],
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
  options: (Option | string)[],
  placeholder?: string
  searchable?: boolean
  showValue?: boolean
  up?: boolean
  small?: boolean
  value?: any
}

interface SelectState {
  options: Option[]
  searchTerm?: string
}

class Select extends React.Component<SelectInnerProps, SelectState> {
  static defaultProps = {
    emptyLabel: "Select a Value",
    clearable: false
  }

  state = { options: this.props.options, searchTerm: "" }

  containerRef: React.RefObject<HTMLDivElement> = React.createRef()
  optionsContainerRef: React.RefObject<HTMLDivElement> = React.createRef()

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

  onSelectValue = (newValue: any) => {
    const { disabled, multiple, onChange, setIsOpen, setSearchTerm, value } = this.props

    if (disabled) return

    const mValue = multiple && newValue !== null
      ? [ ...(value || []), newValue ]
      : newValue

    onChange && onChange(mValue)
    setSearchTerm("")
    setIsOpen(!!multiple)
  }

  shouldRenderUp () {
    const { up } = this.props

    if (!this.containerRef.current) return up

    const container = this.containerRef.current
    const oContainer = this.optionsContainerRef.current

    const offset = document.body.scrollTop - container.offsetTop
    const oContainerHeight = oContainer
      ? oContainer.clientHeight
      : 300

    if (Math.abs(offset) < oContainerHeight) return false
    else if (!up && (window.outerHeight - container.offsetTop < oContainerHeight)) return true
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
              onChange && onChange(value.filter((vValue) => mValue !== vValue))
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
      <div className={ mContainerClassName } ref={ this.containerRef }>
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
              icon="close"
              onClick={ this.clearValue }
            />
          ) }
          <Icon
            containerClassName="Select__icon Select__toggle"
            icon={ isOpen ? "expand_less" : "expand_more" }
            onClick={ this.toggleOpen }
          />
        </div>
        { isOpen && (
          <div
            className="Select__optionsContainer"
            ref={ this.optionsContainerRef }
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
