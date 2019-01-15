import React from "react"
import Alert from "components/Alert"
import ButtonGroup from "components/ButtonGroup";
import Button from "components/Button";

class Test extends React.Component {
  render () {
    return (
      <div>
        <ButtonGroup>
          <Button>Test</Button>
          <Button>Test 2</Button>
        </ButtonGroup>

        <Alert alertType="info">asdasdas</Alert>
      </div>
    )
  }
}

export default Test
