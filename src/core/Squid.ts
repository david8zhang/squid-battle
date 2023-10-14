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

  constructor(game: Game, config: SquidConfig) {
    this.game = game
    this.sprite = this.game.add
      .sprite(config.position.x, config.position.y, config.texture)
      .setOrigin(0)
  }
}
