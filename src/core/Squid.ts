import { Game } from '~/scenes/Game'
import { Constants, PowerUpTypes } from '~/utils/Constants'
import { Side } from '~/utils/Side'
import { UIValueBar } from './UIValueBar'
import { UINumber } from './UINumber'
import { PowerUp, PowerUpConfig } from './PowerUp'

export interface SquidConfig {
  position: {
    x: number
    y: number
  }
  texture: string
  side: Side
}

export class Squid {
  public maxHealth: number = 10
  public currHealth: number = 10
  private game: Game
  private sprite: Phaser.GameObjects.Sprite
  public hasMoved: boolean = false
  public side: Side

  public moveableSquares: Phaser.GameObjects.Rectangle[] = []
  public possibleAttackableSquares: Phaser.GameObjects.Rectangle[] = []
  public attackableSquaresPostMove: Phaser.GameObjects.Rectangle[] = []
  public miniHPBar: UIValueBar
  public knockdownTurns: number = Constants.KNOCKDOWN_TURNS
  public knockdownCounterText!: Phaser.GameObjects.Text

  private powerUpDuration!: Phaser.GameObjects.Text
  public activePowerUp: PowerUpConfig | null = null
  private powerUpTurns: number = -1

  constructor(game: Game, config: SquidConfig) {
    this.game = game
    this.side = config.side
    this.sprite = this.game.add.sprite(config.position.x, config.position.y, config.texture)
    this.sprite.setTint(
      this.side === Side.CPU ? Constants.CPU_INK_COLOR : Constants.PLAYER_INK_COLOR
    )

    this.miniHPBar = new UIValueBar(this.game, {
      x: this.sprite.x - (this.sprite.displayWidth - 8) / 2,
      y: this.sprite.y + this.sprite.displayHeight / 2 - 6,
      maxValue: this.maxHealth,
      height: 4,
      width: this.sprite.displayWidth - 8,
      borderWidth: 4,
      showBorder: true,
      shouldChangeColor: true,
    })
    this.miniHPBar.setVisible(false)
    this.setupKnockdownTurns()
    this.setupPowerUp()
  }

  setupPowerUp() {
    this.powerUpDuration = this.game.add
      .text(this.sprite.x, this.sprite.y - this.sprite.displayHeight / 2, '', {
        fontSize: '12px',
        fontFamily: Constants.FONT_FAMILY,
        color: 'white',
      })
      .setStroke('black', 5)
      .setVisible(false)
    Constants.centerText(this.sprite.x, this.powerUpDuration)
  }

  setupKnockdownTurns() {
    this.knockdownCounterText = this.game.add
      .text(this.sprite.x, this.sprite.y, `${this.knockdownTurns}`, {
        fontSize: '20px',
        color: 'white',
        fontFamily: Constants.FONT_FAMILY,
      })
      .setStroke('black', 5)
      .setDepth(this.sprite.depth + 10)
      .setVisible(false)
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
  }

  public moveToRowColPosition(row: number, col: number) {
    const cell = this.game.grid.getCellAtRowCol(row, col)
    this.sprite.setPosition(cell.centerX, cell.centerY)
    this.miniHPBar.setPosition(
      this.sprite.x - (this.sprite.displayWidth - 8) / 2,
      this.sprite.y + this.sprite.displayHeight / 2 - 6
    )
    const rowColPos = this.getRowCol()
    this.game.powerUps.forEach((powerUp) => {
      const { row, col } = powerUp.getRowCol()
      if (rowColPos.row == row && rowColPos.col == col) {
        this.pickUpPowerUp(powerUp)
      }
    })
    this.powerUpDuration.setPosition(this.sprite.x, this.sprite.y - this.sprite.displayHeight / 2)
    Constants.centerText(this.sprite.x, this.powerUpDuration)
  }

  // Get all continugous squares with ink
  getMoveableSquares() {
    const rowColPos = this.getRowCol()
    const queue = [rowColPos]
    const directions = [
      [0, 1],
      [1, 0],
      [-1, 0],
      [0, -1],
    ]
    const seen = new Set()
    const moveableSquares = [rowColPos]
    const inkColor = this.side == Side.PLAYER ? Constants.PLAYER_INK_COLOR : Constants.CPU_INK_COLOR
    while (queue.length > 0) {
      const cell = queue.shift()!
      directions.forEach((direction) => {
        const newRow = cell.row + direction[0]
        const newCol = cell.col + direction[1]
        if (this.game.grid.withinBounds(newRow, newCol) && !seen.has(`${newRow},${newCol}`)) {
          seen.add(`${newRow},${newCol}`)
          const neighborTile = this.game.tileMap.getTileAt(newCol, newRow)
          if (neighborTile.tint == inkColor) {
            queue.push({
              row: newRow,
              col: newCol,
            })
            moveableSquares.push({
              row: newRow,
              col: newCol,
            })
          }
        }
      })
    }
    return moveableSquares.filter((square) => {
      return !this.game.getAllUnits().find((unit) => {
        if (unit !== this) {
          const { row, col } = unit.getRowCol()
          return square.row == row && square.col == col
        }
      })
    })
  }

  isSquareWithinMoveableSquares(row: number, col: number) {
    const moveableSquares = this.getMoveableSquares()
    for (let i = 0; i < moveableSquares.length; i++) {
      const square = moveableSquares[i]
      if (row === square.row && col === square.col) {
        return true
      }
    }
    return false
  }

  setHasMoved(hasMoved: boolean) {
    if (hasMoved) {
      this.tintSpriteHasMoved()
      this.clearAllSquareTints()
    } else {
      this.sprite.setTint(
        this.side === Side.CPU ? Constants.CPU_INK_COLOR : Constants.PLAYER_INK_COLOR
      )
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

  get displayWidth() {
    return this.sprite.displayWidth
  }

  get displayHeight() {
    return this.sprite.displayHeight
  }

  get isKnockedOut() {
    return this.currHealth == 0
  }

  getTilesWithinDistance(rowColPos: { row: number; col: number }, distance: number) {
    const tilesWithinDistance: { row: number; col: number }[] = []
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]
    const seen = new Set()
    const queue = [
      {
        row: rowColPos.row,
        col: rowColPos.col,
        level: 0,
      },
    ]
    while (queue.length > 0) {
      const cell = queue.shift()!
      if (cell.level <= distance) {
        tilesWithinDistance.push({
          row: cell.row,
          col: cell.col,
        })
      }
      directions.forEach((direction) => {
        const newRow = cell.row + direction[0]
        const newCol = cell.col + direction[1]
        if (this.game.grid.withinBounds(newRow, newCol) && !seen.has(`${newRow},${newCol}`)) {
          seen.add(`${newRow},${newCol}`)
          queue.push({
            row: newRow,
            col: newCol,
            level: cell!.level + 1,
          })
        }
      })
    }
    return tilesWithinDistance
  }

  spreadInkToTiles() {
    const rowColPos = this.getRowCol()

    // We always ink the position we moved to
    let tilesToInk: { row: number; col: number }[] = [
      {
        row: rowColPos.row,
        col: rowColPos.col,
      },
    ]

    const inkColor =
      this.side === Side.PLAYER ? Constants.PLAYER_INK_COLOR : Constants.CPU_INK_COLOR

    const tile = this.game.tileMap.getTileAt(rowColPos.col, rowColPos.row)

    // If we're standing in friendly ink, the ink spread is 2, otherwise it's only 1
    let numTilesToSpreadTo = tile.tint == inkColor ? 2 : 1
    // If we have a power up, increase ink spread by 1
    if (this.activePowerUp && this.activePowerUp.name == PowerUpTypes.INK_UP) {
      numTilesToSpreadTo++
    }

    tilesToInk = tilesToInk.concat(this.getTilesWithinDistance(rowColPos, numTilesToSpreadTo))
    tilesToInk.forEach(({ row, col }) => {
      const tile = this.game.tileMap.getTileAt(col, row)
      if (tile) {
        tile.tint = inkColor
        tile.setAlpha(0.65)
      }
    })
  }

  takeDamage(damage: number) {
    let damageAfterPowerUp = damage
    if (this.activePowerUp && this.activePowerUp.name === PowerUpTypes.DEF_UP) {
      damageAfterPowerUp = Math.round(damage * 0.5)
    }
    this.miniHPBar.setVisible(true)
    this.currHealth = Math.max(0, this.currHealth - damageAfterPowerUp)
    this.miniHPBar.setCurrValue(this.currHealth)
    this.game.time.addEvent({
      delay: 10,
      callback: () => {
        this.sprite.setTintFill(0xff0000)
        this.game.time.addEvent({
          delay: 100,
          callback: () => {
            this.sprite.clearTint()
            this.sprite.setTint(
              this.side === Side.CPU ? Constants.CPU_INK_COLOR : Constants.PLAYER_INK_COLOR
            )
          },
        })
      },
    })
    UINumber.createNumber(
      `-${damageAfterPowerUp}`,
      this.game,
      this.sprite.x,
      this.sprite.y - this.sprite.displayHeight / 3,
      'red'
    )
    if (this.currHealth == 0) {
      this.knockdownCounterText.setVisible(true)
      this.knockdownCounterText.setPosition(this.sprite.x, this.sprite.y)
      this.sprite.setAlpha(0.35)
      this.sprite.setTexture('squid-knocked-out')
      this.miniHPBar.setVisible(false)

      // Deactive active power ups
      this.powerUpDuration.setVisible(false)
      this.activePowerUp = null
    }
  }

  decrementKnockdownTurns() {
    if (this.knockdownTurns === 1) {
      this.sprite.setAlpha(1)
      this.sprite.setTexture('squid')
      this.currHealth = this.maxHealth
      this.miniHPBar.setCurrValue(this.currHealth)
      this.knockdownTurns = Constants.KNOCKDOWN_TURNS
      this.knockdownCounterText.setVisible(false)
    } else {
      this.knockdownTurns--
    }
    this.knockdownCounterText.setText(this.knockdownTurns.toString())
  }

  decrementPowerUpTurns() {
    if (this.activePowerUp !== null) {
      if (this.powerUpTurns == 1) {
        this.activePowerUp = null
        this.powerUpDuration.setVisible(false)
      } else {
        console.log('Went here!')
        this.powerUpTurns--
        this.powerUpDuration.setText(`${this.activePowerUp.name}: ${this.powerUpTurns}`)
      }
    }
  }

  isStandingInOwnInk() {
    const { row, col } = this.getRowCol()
    const tile = this.game.tileMap.getTileAt(col, row)
    const inkColor = this.side === Side.CPU ? Constants.CPU_INK_COLOR : Constants.PLAYER_INK_COLOR
    return tile.tint == inkColor
  }

  getAttackableEnemyUnits() {
    const currRowCol = this.getRowCol()
    const enemyUnits =
      this.side === Side.CPU ? this.game.player.livingUnits : this.game.cpu.livingUnits
    return enemyUnits.filter((squid) => {
      const otherRowCol = squid.getRowCol()
      const distance = Phaser.Math.Distance.Snake(
        currRowCol.row,
        currRowCol.col,
        otherRowCol.row,
        otherRowCol.col
      )
      return distance == 1
    })
  }

  pickUpPowerUp(powerUp: PowerUp) {
    switch (powerUp.config.name) {
      case PowerUpTypes.HEAL: {
        const totalHealAmt = this.maxHealth - this.currHealth
        this.currHealth = this.maxHealth
        this.miniHPBar.setCurrValue(this.currHealth)
        UINumber.createNumber(
          `+${totalHealAmt}`,
          this.game,
          this.sprite.x,
          this.sprite.y - this.sprite.displayHeight / 2 + 10,
          '#2ecc71'
        )
        this.miniHPBar.setVisible(false)
        break
      }
      case PowerUpTypes.DEF_UP:
      case PowerUpTypes.INK_UP:
      case PowerUpTypes.ATK_UP: {
        this.activePowerUp = powerUp.config
        this.powerUpTurns = powerUp.config.turnDuration
        this.powerUpDuration
          .setText(`${powerUp.config.name}: ${powerUp.config.turnDuration}`)
          .setVisible(true)
        this.powerUpDuration.setPosition(
          this.sprite.x,
          this.sprite.y - this.sprite.displayHeight / 2 + 5
        )
        Constants.centerText(this.sprite.x, this.powerUpDuration)
        break
      }
    }
    powerUp.destroy()
  }

  destroy() {
    this.sprite.destroy()
    this.knockdownCounterText.destroy()
    this.miniHPBar.destroy()
  }
}
