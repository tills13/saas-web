type Context = CanvasRenderingContext2D
type PrepareContextCallback = (context: CanvasRenderingContext2D, ...args: any[]) => void

export function getSnakeHead (snake: GameAPI.Snake): Promise<HTMLImageElement> {
  const head = "bendr" || snake.head.url

  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()

    request.open("GET", `/static/snake/head/${ head }.svg`)

    request.addEventListener("load", (event: ProgressEvent) => {
      const request = <XMLHttpRequest> event.currentTarget

      const xml = request.responseXML

      if (!xml || !xml.children[ 0 ]) {
        reject("no xml element")
        return
      }

      resolve(svgToImage(<SVGSVGElement> xml.children[ 0 ], snake.color))
    })

    request.send()
  })
}

export function getSnakeTail (snakeOrTailType: string | GameAPI.Snake) {
  const uri = typeof snakeOrTailType === "string"
    ? `${ location.hostname }/assets/snake/head/${ snakeOrTailType }`
    : snakeOrTailType.head.url

  return fetch(uri).then(response => response.blob())
}

export function makeContext<T> (context: Context, callback: Function, prepareContext?: PrepareContextCallback, ...mArgs) {
  return function (...args) {
    return withinContext(context, callback, prepareContext, ...mArgs, ...args)
  }
}

export function svgToImage (svg: SVGElement, color) {
  svg.setAttribute("fill", color)

  const blob = new Blob([ svg.outerHTML ], { type: "image/svg+xml" })
  const url = URL.createObjectURL(blob)

  const image = new Image()
  image.src = url

  return new Promise<HTMLImageElement>((resolve, reject) => {
    image.onload = () => resolve(image)
    image.onerror = reject
  })
}

export function withinContext (context: Context, fn: Function, prepareContext?: PrepareContextCallback, ...args) {
  context.save()
  prepareContext && prepareContext(context, ...args)
  const result = fn(context, ...args)
  context.restore()
  return result
}
