# SAAS - Snake as a Service

Not sure how I feel about the name but that's what I landed on ... good enough for now.

- [Client](https://www.github.com/tills13/saas-web)
- [Server](https://www.github.com/tills13/saas-api)
- [Manager](https://www.github.com/tills13/saas-game-service)

## What is it?

If you know about BattleSnake, you're most of the way there. I've taken a lot of ideas and concepts
from there and applied them here. If you haven't, however, SaaS/BattleSnake is a coding competition
where teams or individuals build "AI controlled" snakes (classic Snake) which duke it out on a board.

## Client

The client is an SPA interface for SaaS.

## How to Run

You'll need [the server](https://www.github.com/tills13/saas-api) portion to be up and running (the GraphQL schema is loaded in the build step).

1. Install dependencies (`yarn` or `npm install`)
2. Run `yarn start` or `npm start`

#### Tech

- React (v16 🎉)
- GraphQL
- Redux (not as much anymore)
- Websockets (Socket.IO)

PRs welcome but ¯\\\_(ツ)\_/¯ it's just a hobby project.