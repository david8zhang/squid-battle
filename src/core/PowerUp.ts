import { Game } from '~/scenes/Game'
import { Constants } from '~/utils/Constants'

export interface PowerUpConfig {
  name: string
  tintColor: number
  turnDuration: number
  texture: string
  position: {
    x: number
    y: number
  }
}

export class PowerUp {
  private game: Game
  private sprite: Phaser.GameObjects.Sprite
  private powerUpText: Phaser.GameObjects.Text
  public config: PowerUpConfig

  constructor(game: Game, config: PowerUpConfig) {
    this.game = game
    this.config = config
    this.sprite = this.game.add
      .sprite(config.position.x, config.position.y, config.texture)
      .setTintFill(config.tintColor)
      .setDisplaySize(50, 50)
    this.powerUpText = this.game.add
      .text(
        config.position.x,
        config.position.y + this.sprite.displayHeight / 2 - 10,
        config.name,
        {
          fontSize: '12px',
          color: 'white',
          fontFamily: Constants.FONT_FAMILY,
        }
      )
      .setStroke('black', 6)
      .setOrigin(0)
    Constants.centerText(config.position.x, this.powerUpText)
  }

  getRowCol() {
    const cell = this.game.grid.getCellAtWorldPosition(this.sprite.x, this.sprite.y)
    return {
      row: cell.gridRow,
      col: cell.gridCol,
    }
  }

  destroy() {
    this.sprite.destroy()
    this.powerUpText.destroy()
  }
}
