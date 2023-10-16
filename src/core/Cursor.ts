import { Game } from '~/scenes/Game'
import { Cell } from './Cell'
import { Direction } from '~/utils/Direction'
import { Constants } from '~/utils/Constants'

export class Cursor {
  private game: Game
  private position: {
    x: number
    y: number
  }
  public gridRowColPosition: {
    row: number
    col: number
  }

  public sprite: Phaser.GameObjects.Sprite
  constructor(game: Game, defaultPosition: { x: number; y: number }) {
    this.game = game
    this.position = defaultPosition
    this.sprite = this.game.add
      .sprite(this.position.x + 1, this.position.y + 1, 'cursor')
      .setDepth(100)
      .setDisplaySize(Constants.TILE_SIZE, Constants.TILE_SIZE)
      .setTint(0x00ff00)
    const cell: Cell = this.game.grid.getCellAtWorldPosition(this.position.x, this.position.y)
    this.gridRowColPosition = {
      row: cell.gridRow,
      col: cell.gridCol,
    }
  }

  setTexture(texture: string) {
    this.sprite.setTexture(texture)
  }

  moveUnitsInDirection(direction: Direction, units: number) {
    switch (direction) {
      case Direction.UP: {
        let targetRow = Math.max(this.gridRowColPosition.row - units, 0)
        let targetCol = this.gridRowColPosition.col
        this.moveToRowCol(targetRow, targetCol)
        break
      }
      case Direction.DOWN: {
        let targetRow = Math.min(this.gridRowColPosition.row + units, this.game.grid.numRows - 1)
        let targetCol = this.gridRowColPosition.col
        this.moveToRowCol(targetRow, targetCol)
        break
      }
      case Direction.LEFT: {
        let targetRow = this.gridRowColPosition.row
        let targetCol = Math.max(this.gridRowColPosition.col - units, 0)
        this.moveToRowCol(targetRow, targetCol)
        break
      }
      case Direction.RIGHT: {
        let targetRow = this.gridRowColPosition.row
        let targetCol = Math.min(this.gridRowColPosition.col + units, this.game.grid.numCols - 1)
        this.moveToRowCol(targetRow, targetCol)
        break
      }
    }
    this.game.panCameraIfNecessary(this.gridRowColPosition.row, this.gridRowColPosition.col)
  }

  setCursorTint(tintColor: number) {
    this.sprite.setTint(tintColor)
  }

  clearCursorTint() {
    this.sprite.clearTint()
  }

  hide() {
    this.sprite.setVisible(false)
  }

  show() {
    this.sprite.setVisible(true)
  }

  moveToRowCol(row: number, col: number) {
    const cell = this.game.grid.getCellAtRowCol(row, col)
    this.sprite.setPosition(cell.centerX + 1, cell.centerY + 1)
    this.gridRowColPosition = { row, col }
  }
}
