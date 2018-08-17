import { getSnakeHead, makeContext, withinContext } from "./utils"
import { getMovementDirection, DIRECTION } from "./coordinate"

type Context = CanvasRenderingContext2D

interface BoardRendererOptions {
  bgCanvas: HTMLCanvasElement
  colorPallet?: { [ name: string ]: string }
  dimensions: { width: number, height: number }
  fgCanvas: HTMLCanvasElement
}

interface BoardState {
  food: GameAPI.Food[]
  gold: GameAPI.Gold[]
  snakes: GameAPI.Snake[]
  teleporters: GameAPI.Teleporter[]
  turnNumber: number
  walls: GameAPI.Wall[]
}

const DEFAULT_PALETTE = {
  food: "#32D194",
  gold: "#F8F08D",
  teleporter: "#5BC0DE",
  tile: "#114B5F"
}

export class BoardRenderer {
  private height: number
  private width: number

  private bgCanvas: HTMLCanvasElement
  private bgContext: CanvasRenderingContext2D
  private fgCanvas: HTMLCanvasElement
  private fgContext: CanvasRenderingContext2D

  private colorPalette: { [ name: string ]: string } = {}

  private margin: number = 0.05
  private padding: number = 0
  private unit: number = 1 - 2 * this.margin
  private halfUnit = this.unit / 2
  private offset: number = this.unit / 2 * -1

  private backgroundRendered: boolean = false

  private imageCache = new Map<string, HTMLImageElement>()

  private boardState: Partial<BoardState>
  private timer: any

  constructor (opts: BoardRendererOptions) {
    this.colorPalette = opts.colorPallet || DEFAULT_PALETTE

    this.width = opts.dimensions.width
    this.height = opts.dimensions.height

    this.bgCanvas = opts.bgCanvas
    this.fgCanvas = opts.fgCanvas

    this.initializeCanvases()
  }

  clearLayer = (context: Context) => {
    const { height, width } = context.canvas
    context.clearRect(0, 0, width, height)
  }

  initializeCanvases () {
    this.bgContext = this.bgCanvas.getContext("2d")
    this.fgContext = this.fgCanvas.getContext("2d")

    this.bgCanvas.style.zIndex = "0"
    this.fgCanvas.style.zIndex = "1"
  }

  normalizeLayer = (context: Context) => {
    this.scaleLayer(context)
    context.translate(0.5, 0.5)
  }

  scaleLayer = (context: Context) => {
    const clientWidth = context.canvas.width
    const clientHeight = context.canvas.height
    const width = this.width + this.padding * 2
    const height = this.height + this.padding * 2

    const h = clientHeight / height
    const w = clientWidth / width
    const sign = clientWidth / clientHeight > width / height
    const scaler = sign ? h : w

    const xT = sign ? (clientWidth - h * width) / 2 : 0
    const yT = sign ? 0 : (clientHeight - w * height) / 2

    context.translate(xT, yT)
    context.scale(scaler, scaler)
    context.translate(this.padding / 2, this.padding / 2)
  }

  updateBoardState (boardState: Partial<BoardState>) {
    this.boardState = Object.assign(
      { food: [], gold: [], snakes: [], walls: [] },
      boardState
    )
  }

  start () {
    this.renderLoop()
  }

  stop () {
    clearTimeout(this.timer)
  }

  drawGrid = (context: Context, force: boolean) => {
    if (!force && this.backgroundRendered) return
    if (force) this.clearLayer(context)

    context.fillStyle = this.colorPalette[ "tile" ] || DEFAULT_PALETTE.tile

    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        context.fillRect(x + this.margin, y + this.margin, this.unit, this.unit)
      }
    }

    this.backgroundRendered = true
  }

  drawImage = (context: Context, image: HTMLImageElement, x: number, y: number, width: number, height: number, beforeDraw: (context: Context) => void) => {
    withinContext(context, (mContext) => {
      // mContext.translate(x + 0.5, y + 0.5)
      mContext.translate(x, y)
      beforeDraw && beforeDraw(mContext)
      mContext.drawImage(image, this.offset, this.offset, width, height)
    })
  }

  drawItem = (context: Context, type: "food" | "gold" | "teleporter" | "wall", thing: GameAPI.Cell) => {
    context.fillStyle = this.colorPalette[ type ] || DEFAULT_PALETTE[ type ] || "black"

    context.beginPath()
    context.arc(thing.x, thing.y, this.halfUnit, 0, 2 * Math.PI)
    context.fill()
  }

  drawSnake = (context: Context, snake: GameAPI.Snake) => {
    const { turnNumber } = this.boardState
    const { death, coords } = snake

    if (snake.health <= 0 && death) {
      const turnsSinceDeath = turnNumber - death.turn

      if ((turnsSinceDeath * 2) > 100) return

      context.globalAlpha = 100 - (turnsSinceDeath * 2) / 10
      if ((context as any).filter) (context as any).filter = `grayscale(${ 100 - turnsSinceDeath * 2 }%)`
    }

    if (coords.length === 0) {
      return
    }

    context.translate(0.5, 0.5)
    context.strokeStyle = snake.color
    context.lineWidth = this.unit
    context.lineJoin = "round"

    context.beginPath()
    context.moveTo(coords[ 0 ].x, coords[ 0 ].y)

    coords.forEach(coord => context.lineTo(coord.x, coord.y))

    context.stroke()

    this.drawSnakeHead(context, snake)
  }

  drawSnakeHead = async (context: Context, snake: GameAPI.Snake) => {
    const headImage = this.imageCache.has(snake.id)
      ? this.imageCache.get(snake.id)
      : await getSnakeHead(snake)

    this.imageCache.set(snake.id, headImage)

    const headLoc = snake.coords[ 0 ]
    const direction = getMovementDirection(snake)

    this.drawImage(context, headImage, headLoc.x, headLoc.y, this.unit, this.unit, (mContext) => {
      if (direction === DIRECTION.UP) mContext.rotate(Math.PI / 2)
      else if (direction === DIRECTION.LEFT) mContext.scale(-1, 1)
      else if (direction === DIRECTION.DOWN) mContext.rotate(-Math.PI / 2)
    })
  }

  renderLoop = () => {
    this.render()
    this.timer = setTimeout(this.renderLoop, 1000 / 60)
  }

  render = (forceBackgroundRedraw: boolean = false) => {
    if (!this.boardState) return

    withinContext(
      this.bgContext,
      this.drawGrid,
      this.scaleLayer,
      forceBackgroundRedraw
    )

    this.clearLayer(this.fgContext)

    const { food, gold, snakes, walls } = this.boardState

    snakes.forEach(makeContext(this.fgContext, this.drawSnake, this.scaleLayer))
    food.forEach(makeContext(this.fgContext, this.drawItem, this.normalizeLayer, "food"))
    gold.forEach(makeContext(this.fgContext, this.drawItem, this.normalizeLayer, "gold"))
    walls.forEach(makeContext(this.fgContext, this.drawItem, this.normalizeLayer, "wall"))
  }
}
