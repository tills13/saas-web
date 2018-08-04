import "./index.scss"

import classnames from "classnames"
import React from "react"

import IconButton from "../button/icon_button"
import Select from "../form/select"

interface PaginationProps {
  adjustableItemsPerPage?: boolean
  after: number
  className?: string
  count: number
  limit: number
  limitOptions: number[]
  onChangeLimit: (itemsPerPage: number) => void
  onClickNextPage: (after: number, limit: number) => void
  onClickPreviousPage: (after: number, limit: number) => void
}

class Pagination extends React.Component<PaginationProps, any> {
  static defaultProps = { after: 0, itemsPerPage: 10 }

  onClickNextPage = (event: React.MouseEvent<HTMLElement>) => {
    const { onClickNextPage } = this.props
    onClickNextPage(this.props.after, this.props.limit)
  }

  onClickPreviousPage = (event: React.MouseEvent<HTMLElement>) => {
    const { onClickPreviousPage } = this.props
    onClickPreviousPage(this.props.after, this.props.limit)
  }

  renderPageLimitSelect () {
    const { adjustableItemsPerPage, limit, limitOptions, onChangeLimit } = this.props

    if (!adjustableItemsPerPage) {
      const options = limitOptions.map((value) => ({ label: `${ value }`, value }))

      return (
        <Select
          name="itemsPerPage"
          options={ options }
          onChange={ onChangeLimit }
          value={ limit }
          clearable={ false }
          inline
          small
        />
      )
    }
  }

  render () {
    const { after, className, limit, count } = this.props
    const mClassName = classnames("Pagination", className)
    const mAfter = (after || 0) + 1

    return (
      <div className={ mClassName }>
        <div className="Pagination__left">

        </div>
        <div className="Pagination__right">
          <div className="Pagination__total">
            Showing { mAfter } to { Math.min(mAfter + limit, count) } of { count }
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
            disabled={ Math.min((mAfter - 1) + limit, count) >= count }
          />
        </div>
      </div>
    )
  }
}

export default Pagination
