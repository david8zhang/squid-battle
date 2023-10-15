import { Cell } from './Cell'
import { Game } from '~/scenes/Game'

// Note: All cell sizes must be square!
export interface GridConfig {
  width: number
  height: number
  cellSize: number
}

export class Grid {
  private game: Game
  public grid: Cell[][] = []
  public graphics: Phaser.GameObjects.Graphics
  public cellSize: number

  constructor(game: Game, config: GridConfig) {
    this.game = game
    this.graphics = this.game.add.graphics()
    this.cellSize = config.cellSize
    this.initGrid(config)
  }

  initGrid(config: GridConfig) {
    const numCellsWidth = config.width / config.cellSize
    const numCellsHeight = config.height / config.cellSize

    let xPos = 0
    let yPos = 0
    this.grid = new Array(numCellsHeight).fill(null).map(() => new Array(numCellsWidth).fill(null))

    console.log(this.grid)

    for (let i = 0; i < numCellsHeight; i++) {
      xPos = 0
      for (let j = 0; j < numCellsWidth; j++) {
        this.grid[i][j] = new Cell(this.game, {
          inGameX: xPos,
          inGameY: yPos,
          gridRow: i,
          gridCol: j,
          cellSize: config.cellSize,
        })
        xPos += config.cellSize
      }
      yPos += config.cellSize
    }
  }

  showGrid() {
    this.graphics.lineStyle(1, 0x777777, 0.2)
    for (let i = 0; i < this.grid.length; i++) {
      for (let j = 0; j < this.grid[0].length; j++) {
        const cell = this.grid[i][j]
        this.graphics.strokeRectShape(cell.rectangle)
      }
    }
  }

  get numRows() {
    return this.grid.length
  }

  get numCols() {
    return this.grid[0].length
  }

  hideGrid() {
    this.graphics.clear()
  }

  getCellAtRowCol(row: number, col: number) {
    return this.grid[row][col]
  }

  getCellAtWorldPosition(x: number, y: number): Cell {
    const row = Math.floor(y / this.cellSize)
    const col = Math.floor(x / this.cellSize)
    return this.grid[row][col]
  }

  withinBounds(row: number, col: number) {
    return row < this.numRows && row >= 0 && col < this.numCols && col >= 0
  }
}
