import { Environment, Network, RecordSource, Store } from "relay-runtime"

import { getSessionToken } from "utils/auth"

function fetchQuery (operation, variables, cacheConfig, uploadables) {
  return fetch("/graphql", {
    method: "POST",
    body: JSON.stringify({ query: operation.text, variables }),
    headers: {
      "Authorization": getSessionToken(),
      "Content-Type": "application/json"
    }
  }).then(response => response.json())
}

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource())
})

export default environment
