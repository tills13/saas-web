export function getExampleJson (isLegacy: boolean) {
  let requestJson: any = {
    gameId: "5ac7cf8b-4b04-476a-b6a6-16bd8c83c048",
    game_id: "5ac7cf8b-4b04-476a-b6a6-16bd8c83c048",
    you: "5ac7cf8b-4b04-476a-b6a6-16bd8c83c048",
    isLegacy,
    width: 20,
    height: 20,
    turn: 1,
    food: isLegacy ? [ [ 5, 5 ], [ 15, 15 ] ] : [ { x: 5, y: 5 }, { x: 10, y: 10 } ],
    gold: isLegacy ? [ [ 10, 10 ] ] : [ { x: 10, y: 10 } ],
    walls: [ { x: 0, y: 0 } ],
    snakes: [ {
      id: "5ac7cf8b-4b04-476a-b6a6-16bd8c83c048",
      health: 50,
      health_points: 50,
      coords: isLegacy ? [ [ 2, 2 ], [ 2, 3 ] ] : [ { x: 2, y: 2, color: "white" }, { x: 2, y: 3 } ]
    } ]
  }

  if (!isLegacy) {
    requestJson[ "teleporters" ] = [
      { x: 5, y: 15, channel: 1 },
      { x: 15, y: 5, channel: 1 }
    ]
  }

  return requestJson
}
