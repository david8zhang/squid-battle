import { Game } from '~/scenes/Game'
import { Constants } from '~/utils/Constants'

export interface OptionConfig {
  optionText: string
}

export class ActionMenu {
  private game: Game
  private options: Phaser.GameObjects.Rectangle[] = []
  private optionLabels: Phaser.GameObjects.Text[] = []

  constructor(game: Game) {
    this.game = game
  }

  clearPreviousOptions() {
    this.options.forEach((option) => option.destroy())
    this.optionLabels.forEach((optionLabel) => optionLabel.destroy())
  }

  showMenu(optionConfigs: OptionConfig[], position: { x: number; y: number }, onClick: Function) {
    let yPos = position.y
    optionConfigs.forEach((optionConfig) => {
      const optionLabel = this.game.add
        .text(position.x + 10, yPos, optionConfig.optionText, {
          fontSize: '15px',
          color: 'black',
          fontFamily: Constants.FONT_FAMILY,
        })
        .setDepth(1000)
        .setOrigin(0, 0.5)
      const option = this.game.add
        .rectangle(position.x, yPos, 140, 25)
        .setStrokeStyle(1, 0x000000)
        .setFillStyle(0xffffff)
        .setInteractive()
        .on(Phaser.Input.Events.POINTER_OVER, () => {
          option.setFillStyle(0xffff00)
        })
        .on(Phaser.Input.Events.POINTER_OUT, () => {
          option.setFillStyle(0xffffff)
        })
        .on(Phaser.Input.Events.POINTER_DOWN, () => {
          optionLabel.setAlpha(0.5)
          option.setAlpha(0.5)
        })
        .on(Phaser.Input.Events.POINTER_UP, () => {
          onClick(optionConfig.optionText)
          this.clearPreviousOptions()
        })
        .setOrigin(0, 0.5)
        .setDepth(500)
      this.options.push(option)
      this.optionLabels.push(optionLabel)
      yPos += option.displayHeight
    })
  }
}
