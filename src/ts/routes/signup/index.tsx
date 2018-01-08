import "./index.scss"

import * as React from "react"

import Container from "components/container/route_container"
import Header from "components/header"
import SignupForm from "forms/signup"

export const Signup = () => {
  return (
    <Container className="Signup">
      <Header>
        <div><h2 className="Header__title">Sign Up</h2></div>
      </Header>
      <SignupForm />
    </Container>
  )
}

export default Signup
