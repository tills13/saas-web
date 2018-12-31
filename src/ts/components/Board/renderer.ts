import { pick, difference } from "lodash"

import { getMovementDirection } from "./coordinate"
import { getSnakeHead, makeContext, withinContext } from "./utils"

/* import bendr from "../../../static/image/snake/head/bendr.svg"
import dead from "../../../static/image/snake/head/dead.svg"
import fang from "../../../static/image/snake/head/fang.svg"
import pixel from "../../../static/image/snake/head/pixel.svg"
import regular from "../../../static/image/snake/head/regular.svg"
import safe from "../../../static/image/snake/head/safe.svg"
import sand from "../../../static/image/snake/head/sand-worm.svg"
import shades from "../../../static/image/snake/head/shades.svg"
import smile from "../../../static/image/snake/head/smile.svg"
import tongue from "../../../static/image/snake/head/tongue.svg"

const heads = { bendr, dead, fang, pixel, regular, safe, sand, shades, smile, tongue } */

type Context = CanvasRenderingContext2D

export type BoardRendererOptions = {
  colorPalette?: { [ name: string ]: string }
  deathTimeout?: number
  renderBackground?: boolean
}

export type BoardState = {
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

const defaultOpts: Partial<BoardRendererOptions> = {
  colorPalette: {},
  deathTimeout: 30,
  renderBackground: true
}

const margin: number = 0.05
const padding: number = 0
const unit: number = 1 - 2 * margin
const halfUnit = unit / 2
const offset: number = unit / 2 * -1

class BoardRenderer {
  private fgCanvas?: HTMLCanvasElement
  private bgCanvas?: HTMLCanvasElement
  private bgContext?: CanvasRenderingContext2D
  private fgContext?: CanvasRenderingContext2D

  private height?: number
  private width?: number

  private redrawBackground: boolean = true

  private boardState?: Partial<BoardState>
  private animationFrame?: number

  private opts: BoardRendererOptions

  constructor (initialOpts?: BoardRendererOptions) {
    this.opts = Object.assign(defaultOpts, initialOpts)
  }

  setCanvases (
    fgCanvas: HTMLCanvasElement,
    bgCanvas: HTMLCanvasElement,
    resetCanvases: boolean = false
  ) {
    this.fgCanvas = fgCanvas
    this.bgCanvas = bgCanvas

    if (resetCanvases) {
      this.initializeCanvases()
    }
  }

  setDimensions (height: number, width: number): this {
    this.setHeight(height)
    this.setWidth(width)

    return this
  }

  setHeight (height: number): this {
    this.height = height

    return this
  }

  setOptions (options: BoardRendererOptions): this {
    this.opts = options

    return this
  }

  setWidth (width: number): this {
    this.width = width

    return this
  }

  initializeCanvases (): void {
    if (!this.bgCanvas || !this.fgCanvas) return

    this.bgContext = this.bgCanvas.getContext("2d")!
    this.fgContext = this.fgCanvas.getContext("2d")!

    this.bgCanvas.style.zIndex = "0"
    this.fgCanvas.style.zIndex = "1"
  }

  clearLayer = (context: Context): void => {
    const { height, width } = context.canvas
    context.clearRect(0, 0, width, height)
  }

  normalizeLayer = (context: Context): void => {
    this.scaleLayer(context)
    context.translate(0.5, 0.5)
  }

  scaleLayer = (context: Context) => {
    const clientWidth = context.canvas.width
    const clientHeight = context.canvas.height
    const width = this.width! + padding * 2
    const height = this.height! + padding * 2

    const h = clientHeight / height
    const w = clientWidth / width
    const sign = clientWidth / clientHeight > width / height
    const scaler = sign ? h : w

    const xT = sign ? (clientWidth - h * width) / 2 : 0
    const yT = sign ? 0 : (clientHeight - w * height) / 2

    context.translate(xT, yT)
    context.scale(scaler, scaler)
    context.translate(padding / 2, padding / 2)
  }

  updateState (boardState: Partial<BoardState>): this {
    const prevState = this.boardState

    this.boardState = Object.assign(
      { food: [], gold: [], snakes: [], walls: [] },
      pick(boardState, [ "food", "gold", "snakes", "turnNumber", "walls" ])
    )

    if (prevState) {
      const oldSnakes = prevState.snakes!.map(s => s.id)
      const newSnakes = this.boardState.snakes!.map(s => s.id)

      if (difference(oldSnakes, newSnakes).length !== 0) {
        Promise.all(this.boardState.snakes!.map(s => getSnakeHead(s)))
      }
    }

    return this
  }

  start (redrawBackground: boolean = true) {
    this.redrawBackground = redrawBackground
    this.tick(true)
  }

  stop () {
    if (this.animationFrame != null) {
      cancelAnimationFrame(this.animationFrame)
    }
  }

  drawGrid = (context: Context) => {
    if (!this.redrawBackground) return

    this.clearLayer(context)

    context.fillStyle = this.opts.colorPalette![ "tile" ] || DEFAULT_PALETTE.tile

    for (let x = 0; x < this.width!; x++) {
      for (let y = 0; y < this.height!; y++) {
        context.fillRect(x + margin, y + margin, unit, unit)
      }
    }

    context.scale(2, 2)
    this.redrawBackground = false
  }

  drawImage = (context: Context, image: HTMLImageElement, x: number, y: number, width: number, height: number) => {
    context.drawImage(image, x, y, width, height)
  }

  drawItem = (context: Context, type: "food" | "gold" | "teleporter" | "wall", thing: GameAPI.Cell) => {
    context.fillStyle = this.opts.colorPalette![ type ] || "black"

    context.beginPath()
    context.arc(thing.x, thing.y, halfUnit, 0, 2 * Math.PI)
    context.fill()
  }

  drawSnake = async (context: Context, snake: GameAPI.Snake) => {
    // console.log("drawSnake", snake.coords)
    const { turnNumber } = this.boardState!
    const { death, coords } = snake

    if (snake.health <= 0 && death) {
      const turnsSinceDeath = Math.max(1, Math.min(this.opts.deathTimeout!, turnNumber! - death.turn))

      if ((context as any).filter) {
        const opacity = (1 - (turnsSinceDeath / this.opts.deathTimeout!)) * 100;
        (context as any).filter = `opacity(${ opacity }%)`
      }
    }

    if (coords.length === 0) {
      return
    }

    // context.translate(0.5, 0.5)
    context.strokeStyle = snake.color || "black"
    context.lineWidth = unit
    context.lineJoin = "round"

    context.beginPath()
    context.moveTo(coords[ 0 ].x, coords[ 0 ].y)

    coords.forEach(coord => context.lineTo(coord.x, coord.y))

    context.stroke()

    // await this.drawSnakeHead(context, snake)
  }

  drawSnakeHead = async (context: Context, snake: GameAPI.Snake) => {
    const { x, y } = snake.coords[ 0 ]
    const direction = getMovementDirection(snake)

    const headImage = await getSnakeHead(snake)

    if (direction === "up") context.rotate(Math.PI / 2)
    else if (direction === "left") context.scale(-1, 1)
    else if (direction === "down") context.rotate(-Math.PI / 2)

    this.drawImage(context, headImage, x, y, unit, unit)
  }

  async tick (loop: boolean = false) {
    await this.render()

    // if (loop) {
    //   this.animationFrame = requestAnimationFrame(this.tick.bind(undefined, loop))
    // }
  }

  async render () {
    const { renderBackground } = this.opts
    const start = performance.now()
    // console.log("tick", start)

    if (!(this.boardState && this.bgContext && this.fgContext)) {
      return
    }

    const { food, gold, snakes, walls } = this.boardState!

    // this.scaleLayer(this.bgContext)
    // this.drawGrid(this.bgContext)

    if (renderBackground) {
      withinContext(this.bgContext, this.drawGrid, this.scaleLayer)
    }

    this.clearLayer(this.fgContext)
    // this.normalizeLayer(this.fgContext)

    // console.log(JSON.stringify(snakes))

    // withinContext(
    //   this.fgContext,
    //   context => food!.forEach(mFood => this.drawItem(context, "food", mFood))
    // )

    // withinContext(
    //   this.fgContext,
    //   context => gold!.forEach(mGold => this.drawItem(context, "gold", mGold))
    // )

    // withinContext(
    //   this.fgContext,
    //   context => walls!.forEach(mWalls => this.drawItem(context, "wall", mWalls))
    // )

    // snakes!.forEach(snake => {
    //   withinContext(
    //     this.fgContext!,
    //     context => this.drawSnake(context, snake)
    //   )
    // })

    await Promise.all(
      snakes!.map(makeContext(this.fgContext, this.drawSnake, this.normalizeLayer))
    )

    // for (let snake of snakes!) {
    //   console.log("drawing", snake.id)
    //   // this.fgContext!.save()
    //   await
    //   // this.fgContext!.restore()
    // }

    // await Promise.all(
    //   snakes!.map(async snake => {
    //     await this.drawSnake(this.fgContext!, snake)
    //   })
    // )


    // snakes!.forEach(makeContext(this.fgContext, this.drawSnake, this.normalizeLayer))


    // const y = withinContext(
    //   this.fgContext,
    //   context => Promise.all(
    //     snakes!.map(snake => this.drawSnake(context, snake))
    //   )
    // )

    // this.normalizeLayer(this.fgContext)

    // this.bgContext.scale(3, 3)
    console.log("frame rendered in", performance.now() - start)
  }
}

export default BoardRenderer
