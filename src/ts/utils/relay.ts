export function getType () {

}

export function getIdFromGlobalId (globalId: string) {
  return atob(globalId).split(":")[ 1 ]
}
