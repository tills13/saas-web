import {
  CacheConfig,
  Environment,
  Network,
  RecordSource,
  RequestNode,
  Store,
  UploadableMap,
  Variables
} from "relay-runtime"

import { getSessionToken } from "utils/auth"

async function fetchQuery (
  operation: RequestNode,
  variables: Variables,
  _cacheConfig: CacheConfig,
  _uploadables?: UploadableMap
) {
  const body: string = JSON.stringify({ query: operation.text, variables })

  const headers: { [ header: string ]: string } = {
    "Authorization": getSessionToken() as string,
    "Content-Type": "application/json"
  }

  const response = await fetch("/graphql", { method: "POST", body, headers })
  return response.json()
}

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource())
})

export default environment
