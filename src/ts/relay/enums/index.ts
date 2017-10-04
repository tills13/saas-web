type EnumType = { [key: string]: any }

export const VISIBILITY_PRIVATE = "PRIVATE"
export const VISIBILITY_PUBLIC = "PUBLIC"

export const SPAWN_STRATEGY_RANDOM = "RANDOM"
export const SPAWN_STRATEGY_STATIC = "STATIC"
export const SPAWN_STRATEGY_DONT_RESPAWN = "DONT_RESPAWN"

export const GAME_STATUS_CREATED = "CREATED"
export const GAME_STATUS_STARTED = "STARTED"
export const GAME_STATUS_IN_PROGRESS = "IN_PROGRESS"
export const GAME_STATUS_RESTARTED = "RESTARTED"
export const GAME_STATUS_STOPPED = "STOPPED"
export const GAME_STATUS_COMPLETED = "COMPLETED"

export const VisibilityEnum: EnumType = {
  [VISIBILITY_PUBLIC.toLowerCase()]: VISIBILITY_PUBLIC,
  [VISIBILITY_PRIVATE.toLowerCase()]: VISIBILITY_PRIVATE
}

export const GameStatusEnum: EnumType = {
  "COMPLETED": GAME_STATUS_COMPLETED,
  "CREATED": GAME_STATUS_CREATED,
  "IN_PROGRESS": GAME_STATUS_IN_PROGRESS,
  "RESTARTED": GAME_STATUS_RESTARTED,
  "STARTED": GAME_STATUS_STARTED,
  "STOPPED": GAME_STATUS_STOPPED
}

export const SpawnStrategyEnum: EnumType = {
  "Random Spawn": SPAWN_STRATEGY_RANDOM,
  "Statically Spawn": SPAWN_STRATEGY_STATIC,
  "Don't Spawn": SPAWN_STRATEGY_DONT_RESPAWN
}

export const enumToSelect = (enumeration: EnumType) => {
  return Object.keys(enumeration).map((key) => {
    return { label: key, value: enumeration[key] }
  })
}
