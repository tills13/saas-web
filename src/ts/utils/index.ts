import { authMiddleware, loggerMiddleware, RelayNetworkLayer } from "react-relay-network-layer"
import * as Relay from "react-relay/classic"
import * as authUtils from "./auth"

export function trimLeadingWhitespace(mString: string): string {
  const lines = mString
    .split(/\n|<br\/>/)
    .filter((line, index, lines) => {
      return line && (
        line.length > 0 && (
          index !== 0 ||
          index !== lines.length - 1
        )
      )
    })

  let minLength
  const firstLineLength = lines[0].match(/^[ ]*/)[0].length
  const lastLineLength = lines[lines.length - 1].match(/^[ ]*/)[0].length

  if (firstLineLength !== lastLineLength && false) {
    // minLength = Math.min(firstLineLength, lastLineLength);
  } else {
    minLength = lines
      .map((line) => line.replace(/\t/, "    ")) // replace tabs with 4 spaces
      .map((line) => line.match(/^[ ]*/)) // match leading whitespace
      .filter((match) => !!match)
      .map((match) => match[0].length) // get the leading whitespace length
      // .filter((match) => match !== 0)
      .reduce((carry, length) => Math.min(carry, length), Infinity) // find the min
  }

  return lines.map((line) => {
    // const lineLength = line.match(/^[ ]*/)[0].length;
    return line.substring(minLength)
  }).join("\n")
}

export function possessive(word: string) {
  return `${ word }${ word.endsWith("s") ? "'" : "'s" }`
}

export function pluralize(word: string, count: number) {
  return `${ word }${ count !== 1 ? "s" : "" }`
}

export function nl2br(mString: string): string {
  return mString.replace(/\n/, "<br/>")
}

export function br2nl(mString: string): string {
  return mString.replace(/<br\/>/, "\n")
}

export function setupRelay() {
  Relay.injectNetworkLayer(new RelayNetworkLayer([
    authMiddleware({ token: authUtils.getSessionToken }),
    loggerMiddleware()
  ]))
}
