export const RAW_A = [
  [ [ 1, 0 ], [ 1, 0 ], [ 1, 0 ], [ 1, 0 ] ], // top
  [ [ 0, -1 ], [ 0, -1 ] ], // down to middle
  [ [ -1, 0 ], [ -1, 0 ], [ -1, 0 ], [ -1, 0 ] ], // middle
  [ [ 0, -1 ], [ 0, -1 ], [ 0, -1 ] ], // down to bottom
  [ [ 1, 0 ], [ 1, 0 ], [ 1, 0 ], [ 1, 0 ] ], // bottom
  [ [ 0, 1 ], [ 0, 1 ] ] // up to middle
]

export const RAW_S = [
  [ [ -1, 0 ], [ -1, 0 ], [ -1, 0 ], [ -1, 0 ] ], // top
  [ [ 0, -1 ], [ 0, -1 ], [ 0, -1 ] ], // down to middle
  [ [ 1, 0 ], [ 1, 0 ], [ 1, 0 ], [ 1, 0 ] ], // middle
  [ [ 0, -1 ], [ 0, -1 ], [ 0, -1 ] ], // down to bottom
  [ [ -1, 0 ], [ -1, 0 ], [ -1, 0 ], [ -1, 0 ] ] // bottom
]

export const RAW_LETTERS = { a: RAW_A, s: RAW_S }
export const LETTER_OFFSETS = { a: [ 0, 1 ], s: [ 4, 0 ] }

export function generateLetters (text: string) {
  return text.split("").map((letter, index) => convertLetterToCoords(letter, { x: 2 + (index * 7), y: 2 }))
}

export function convertLetterToCoords (letter, startingPosition: GameAPI.Position) {
  const letterVector = generateRawLetter(letter)
  const letterOffset = getLetterOffset(letter)
  const finalPositions = [ {
    x: startingPosition.x + letterOffset[ 0 ],
    y: startingPosition.y + letterOffset[ 1 ]
  } ]

  letterVector.forEach((section, index) => {
    section.forEach(([ deltaX, deltaY ]) => {
      const previousPosition = finalPositions[ finalPositions.length - 1 ]

      finalPositions.push({
        x: previousPosition.x + deltaX,
        y: previousPosition.y - deltaY
      })
    })
  })

  return finalPositions
}

export function generateRawLetter (letter: string, scaleX: number = 1, scaleY: number = 1): number[][][] {
  return RAW_LETTERS[ letter ]
}

export function getLetterOffset (letter: string) {
  return LETTER_OFFSETS[ letter ]
}
