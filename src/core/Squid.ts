import { Game } from '~/scenes/Game'

export interface SquidConfig {
  position: {
    x: number
    y: number
  }
  texture: string
}

export class Squid {
  private game: Game
  private sprite: Phaser.GameObjects.Sprite
  public hasMoved: boolean = false

  public moveableSquares: Phaser.GameObjects.Rectangle[] = []
  public possibleAttackableSquares: Phaser.GameObjects.Rectangle[] = []
  public attackableSquaresPostMove: Phaser.GameObjects.Rectangle[] = []

  constructor(game: Game, config: SquidConfig) {
    this.game = game
    this.sprite = this.game.add.sprite(config.position.x, config.position.y, config.texture)
  }

  public getRowCol() {
    const cell = this.game.grid.getCellAtWorldPosition(this.sprite.x, this.sprite.y)
    return {
      row: cell.gridRow,
      col: cell.gridCol,
    }
  }

  public highlight() {
    this.sprite.setTint(0xffff00)
    this.highlightMoveableSquares()
  }

  highlightMoveableSquares() {}

  public moveToRowColPosition(row: number, col: number) {
    const cell = this.game.grid.getCellAtRowCol(row, col)
    this.sprite.setPosition(cell.centerX, cell.centerY)
    // this.miniHPBar.setPosition(
    //   this.sprite.x - (this.sprite.displayWidth - 2) / 2,
    //   this.sprite.y - this.sprite.displayHeight / 2
    // )
  }

  isSquareWithinMoveableSquares(row: number, col: number) {
    for (let i = 0; i < this.moveableSquares.length; i++) {
      const square = this.moveableSquares[i]
      const cell = this.game.grid.getCellAtWorldPosition(square.x, square.y)
      if (row === cell.gridRow && col === cell.gridCol) {
        return true
      }
    }
    // return false
    return true
  }

  setHasMoved(hasMoved: boolean) {
    if (hasMoved) {
      this.tintSpriteHasMoved()
      this.clearAllSquareTints()
    } else {
      this.sprite.clearTint()
    }
    this.hasMoved = hasMoved
  }

  public tintSpriteHasMoved() {
    this.sprite.setTint(0x777777)
  }

  public clearAllSquareTints() {
    this.moveableSquares.forEach((square) => {
      square.destroy()
    })
    this.possibleAttackableSquares.forEach((square) => {
      square.destroy()
    })
    this.attackableSquaresPostMove.forEach((square) => {
      square.destroy()
    })
    this.attackableSquaresPostMove = []
    this.possibleAttackableSquares = []
    this.moveableSquares = []
  }

  get x() {
    return this.sprite.x
  }

  get y() {
    return this.sprite.y
  }
}
