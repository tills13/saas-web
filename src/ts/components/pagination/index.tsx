import "./index.scss"

import * as classnames from "classnames"
import * as React from "react"
import { compose, defaultProps } from "recompose"

import IconButton from "components/button/icon_button"
import Select from "components/form/select"
// import { PaginationProps as PaginationOptionProps } from "./paginate"

interface PaginationProps {
  adjustableItemsPerPage?: boolean
  after: number
  className?: string
  itemsPerPage: number
  itemsPerPageOptions: number[]
  onChangeItemsPerPage: (itemsPerPage: number) => void
  onClickNextPage: () => void
  onClickPreviousPage: () => void
  totalItems: number
}

class Pagination extends React.Component<PaginationProps, any> {
  static defaultProps = { after: 0, itemsPerPage: 10 }

  onClickNextPage = (event: React.MouseEvent<HTMLElement>) => {
    const { onClickNextPage } = this.props
    onClickNextPage()
  }

  onClickPreviousPage = (event: React.MouseEvent<HTMLElement>) => {
    const { onClickPreviousPage } = this.props
    onClickPreviousPage()
  }

  renderPageLimitSelect () {
    const { adjustableItemsPerPage, itemsPerPage, itemsPerPageOptions, onChangeItemsPerPage } = this.props

    if (!adjustableItemsPerPage) {
      const options = itemsPerPageOptions.map((value) => ({ label: `${ value }`, value }))
      return (
        <Select
          name="itemsPerPage"
          options={ options }
          onChange={ onChangeItemsPerPage }
          value={ itemsPerPage }
          clearable={ false }
          inline
          small
        />
      )
    }
  }

  render () {
    const { after, className, itemsPerPage, totalItems } = this.props
    const mClassName = classnames("Pagination", className)
    const mAfter = (after || 0) + 1

    return (
      <div className={ mClassName }>
        <div className="Pagination__left">

        </div>
        <div className="Pagination__right">
          <div className="Pagination__total">
            Showing { mAfter } to { Math.min(mAfter + itemsPerPage, totalItems) } of { totalItems }
          </div>
          <IconButton
            icon="chevron-left"
            onClick={ this.onClickPreviousPage }
            disabled={ mAfter === 1 }
          />
          { this.renderPageLimitSelect() }
          <IconButton
            icon="chevron-right"
            onClick={ this.onClickNextPage }
            disabled={ Math.min((mAfter - 1) + itemsPerPage, totalItems) >= totalItems }
          />
        </div>
      </div>
    )
  }
}

export default Pagination
