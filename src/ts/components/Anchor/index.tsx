import "./index.scss"

import classnames from "classnames"
import React from "react"

import Container from "../Container"

interface AnchorProps extends React.AllHTMLAttributes<any> {
  anchor: string
  className?: string
  endpoint?: string
  method?: string
  title: string
}

function Anchor ({ anchor, className, endpoint, method, onClick, title }: AnchorProps) {
  const mClassName = classnames("Anchor", className)

  return (
    <div id={ anchor } className="Anchor__container" >
      <a
        href={ `#${ anchor }` }
        className="Anchor__link"
        onClick={ onClick }
      >
        <Container>
          <h3 className={ mClassName }>
            { method && <b className="Anchor__method">{ method }</b> }
            <span className="Anchor__content">{ title }</span>
            { endpoint && <code className="Anchor__code">{ endpoint }</code> }
          </h3>
        </Container>
      </a>
    </div>
  )
}

export default Anchor
