import * as Relay from "react-relay/classic"

export const application = () => Relay.QL`query { application }`
export const node = () => Relay.QL`query { node(id: $nodeId) }`
export const viewer = () => Relay.QL`query { viewer }`
