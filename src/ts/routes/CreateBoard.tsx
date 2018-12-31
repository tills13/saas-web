import React from "react"
import { graphql } from "react-relay"

import BoardEditor from "components/BoardEditor"
import Header from "components/Header"

interface CreateBoardProps extends React.AllHTMLAttributes<HTMLDivElement> {
  application: GraphQL.Schema.Application
}

export const CreateBoardQuery = graphql`
  query CreateBoardQuery {
    application { ...BoardEditor_application }
  }
`

function CreateBoard ({ application }: CreateBoardProps) {
  return (
    <div className="CreateOrEditBoard">
      <Header className="Boards__header">
        <div><h2 className="Header__title">Create Board</h2></div>
      </Header>
      <BoardEditor application={ application } board={ null } />
    </div>
  )
}

export default CreateBoard
