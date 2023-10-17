import { Button } from '~/core/Button'
import { Constants } from '~/utils/Constants'

export class GameOver extends Phaser.Scene {
  constructor() {
    super('game-over')
  }

  create() {
    const gameOverText = this.add.text(
      Constants.WINDOW_WIDTH / 2,
      Constants.WINDOW_HEIGHT / 3,
      'Game Over!',
      {
        fontSize: '40px',
        fontFamily: Constants.FONT_FAMILY,
        color: 'white',
      }
    )
    const retryButton = new Button({
      scene: this,
      x: Constants.WINDOW_WIDTH / 2,
      y: gameOverText.y + gameOverText.displayHeight + 50,
      width: 150,
      height: 50,
      text: 'Retry',
      onClick: () => {
        this.scene.start('game')
        this.scene.start('game-ui')
      },
      strokeColor: 0x000000,
      strokeWidth: 1,
      backgroundColor: 0xffffff,
      fontSize: '20px',
      fontFamily: Constants.FONT_FAMILY,
    })
    Constants.centerText(Constants.WINDOW_WIDTH / 2, gameOverText)
  }
}
