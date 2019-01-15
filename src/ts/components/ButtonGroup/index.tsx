import React from "react"
import styled, { css } from "styled-components"

interface ButtonGroupProps extends React.AllHTMLAttributes<HTMLDivElement> {
  block?: boolean
}

const ButtonGroup = styled.div`
  display: inline-flex;

  > * {
    flex: 1;
    border-radius: 0;

    :first-child {
      border-top-left-radius: 2px;
      border-bottom-left-radius: 2px;
    }

    :last-child {
      border-top-right-radius: 2px;
      border-bottom-right-radius: 2px;
    }

    :not(:first-child) {
      border-left: 0;
    }
  }

  ${ (props: ButtonGroupProps) => props.block && css`display: flex;` }
`

export default ButtonGroup
