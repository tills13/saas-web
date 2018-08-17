import "./index.scss"

import React from "react"
import { graphql } from "react-relay"

import BoardEditor from "components/board/BoardEditor"
import Header from "components/header"

interface EditDaemonProps extends React.Props<any> {
  application: GraphQL.Schema.Application
  board: Models.Board
}

export const EditBoardQuery = graphql`
  query EditBoardQuery ($boardId: ID!) {
    application { ...BoardEditor_application }
    board: node (id: $boardId) { ...BoardEditor_board }
  }
`

const EditBoard = ({ application, board }: EditDaemonProps) => {
  return (
    <div className="EditDaemon">
      <Header className="Daemons__header">
        <div><h2 className="Header__title">Edit { board.name }</h2></div>
      </Header>
      <BoardEditor application={ application } board={ board } />
    </div>
  )
}

export default EditBoard
