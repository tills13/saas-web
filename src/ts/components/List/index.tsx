import React, { ReactNode } from "react"
import styled from "styled-components"

interface ListProps<T = any> extends React.AllHTMLAttributes<HTMLDivElement> {
  cacheKey?: keyof T
  emptyMessage?: ReactNode | Function
  items: T[]
  onItemClick?: (item: T) => void
  renderItem: (item: T, onClick?: React.MouseEventHandler) => ReactNode
}

const StyledList = styled.div`
  margin-bottom: 12px;

  > * {
    margin-left: -12px;
    margin-right: -12px;
    padding: 12px;

    &:nth-child(even) {
      background: #fafafa;
    }
  }
`

class List<T> extends React.Component<ListProps<T>> {
  static defaultProps = { cacheKey: "id" }

  private onClickCache: { [ id: string ]: React.MouseEventHandler<any> } = {}

  getOnClick (item: T) {
    const { cacheKey, onItemClick } = this.props
    const key = item[ cacheKey! ] as unknown as string

    if (!onItemClick) return

    let onClick = this.onClickCache[ key ]

    if (!onClick) {
      onClick = () => onItemClick(item)
      this.onClickCache[ key ] = onClick
    }

    return onClick
  }

  renderEmpty (): ReactNode {
    const { items, emptyMessage } = this.props

    if (items && items.length !== 0) {
      return null
    }

    if (typeof emptyMessage === "function") {
      return emptyMessage()
    }

    return emptyMessage
  }

  render () {
    const { className, items, renderItem } = this.props

    return (
      <StyledList className={ className }>
        { this.renderEmpty() }
        { items.map(item => renderItem(item, this.getOnClick(item))) }
      </StyledList>
    )
  }
}

export default List
