import React from "react"
import styled from "styled-components"

interface ContainerProps {
  className?: string
}

const Container = styled.div`
  width: 1000px;
  max-width: 100%;
  flex: 0 1 1000px;
  margin: 0px auto;

  @media screen and (max-width: 1250px) {
    padding: 0px 20px;
  }
`

export default React.forwardRef<HTMLDivElement, ContainerProps>(function (props, ref) {
  return (
    <Container { ...props } ref={ ref }>
      { props.children }
    </Container>
  )
})
