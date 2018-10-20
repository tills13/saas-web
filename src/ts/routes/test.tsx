import { debounce } from "lodash"
import React from "react"
import Relay, { createRefetchContainer, graphql } from "react-relay"

import Select from "components/form/select"

interface TestProps {
  application: GraphQL.Schema.Application
  relay: Relay.RelayRefetchProp
}

export const TestQuery = graphql`
  query TestQuery ($after: Int, $limit: Int = 10, $search: String) {
    application { ...Test_application @arguments(after: $after, limit: $limit, search: $search) }
  }
`

function Test ({ application: { snakes: { items: snakes } }, relay }: TestProps) {
  const options = []
  // const options = s(snakes)
  // const options = snakes.map(snake => ({ label: snake.name, value: snake.id }))

  const onSearch = debounce((searchTerm) => {
    relay.refetch({ search: searchTerm }, null)
  }, 1000, { leading: true })

  return (
    <Select
      name="test"
      options={ options }
      onSearch={ onSearch }
      searchable
    />
  )
}

export default createRefetchContainer(
  Test,
  graphql`
    fragment Test_application on Application
    @argumentDefinitions (
      after: { type: Int, defaultValue: 0 }
      limit: { type: Int, defaultValue: 10 }
      search: { type: String }
    ) {
      snakes (after: $after, limit: $limit, search: $search) {
        items { id, name }
      }
    }
  `,
  graphql`
    query TestRefetchQuery ($after: Int, $limit: Int, $search: String) {
      application {
        ...Test_application @arguments(after: $after, limit: $limit, search: $search)
      }
    }
  `
)
