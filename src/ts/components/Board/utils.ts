type Context = CanvasRenderingContext2D
type PrepareContextCallback = (context: CanvasRenderingContext2D, ...args: any[]) => void

const imgCache: { [ name: string ]: HTMLImageElement } = {}

export async function getSnakeHead (snake: GameAPI.Snake): Promise<HTMLImageElement> {
  const head = "bendr" || snake.head.url

  if (imgCache[ head ]) {
    console.log(head, "loaded from cache")
    return imgCache[ head ]
  }

  const response = await fetch(`/static/image/snake/head/${ head }.svg`)
  const rawSVG = await response.text()
  const image = await svgToImage(rawSVG, snake.color || snake.defaultColor || "#000")

  imgCache[ head ] = image

  return image
}

export function getSnakeTail (snakeOrTailType: string | GameAPI.Snake) {
  const uri = typeof snakeOrTailType === "string"
    ? `${ location.hostname }/assets/snake/head/${ snakeOrTailType }`
    : snakeOrTailType.head.url

  return fetch(uri).then(response => response.blob())
}

export function makeContext<T> (
  context: Context,
  callback: WithinContextCallback,
  prepareContext?: PrepareContextCallback,
  ...mArgs: any[]
) {
  return function (...args: any[]) {
    return withinContext(context, callback, prepareContext, ...mArgs, ...args)
  }
}

export function svgToImage (svg: string, color: string) {
  const blob = new Blob([ svg ], { type: "image/svg+xml" })
  const url = URL.createObjectURL(blob)

  const image = new Image()
  image.src = url
  image.setAttribute("fill", color)

  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => resolve(image)
    image.onerror = reject
  })
}

type WithinContextCallback = (context: Context, ...args: any[]) => void

export function withinContext (
  context: Context,
  callback: WithinContextCallback,
  prepareContext?: PrepareContextCallback,
  ...args: any[]
) {
  context.save()
  prepareContext && prepareContext(context, ...args)
  const result = callback(context, ...args)
  context.restore()
  return result
}
