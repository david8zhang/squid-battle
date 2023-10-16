import { Button } from '~/core/Button'
import { Constants } from '~/utils/Constants'

export class Start extends Phaser.Scene {
  constructor() {
    super('start')
  }

  create() {
    this.cameras.main.setBackgroundColor(0xffffff)
    this.add.image(0, 0, 'splash').setOrigin(0).setAlpha(0.8)
    const titleText = this.add
      .text(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 4, 'Spla-Tactics!', {
        fontSize: '100px',
        color: 'white',
        fontFamily: 'Kaph',
      })
      .setStroke('#000000', 20)
      .setShadowStroke(false)
    titleText.setPosition(Constants.WINDOW_WIDTH / 2 - titleText.displayWidth / 2, titleText.y)
    const startButton = new Button({
      scene: this,
      x: Constants.WINDOW_WIDTH / 2,
      y: titleText.y + titleText.displayHeight + 100,
      onClick: () => {
        this.scene.start('game')
        this.scene.start('game-ui')
      },
      fontSize: '25px',
      fontFamily: 'Kaph',
      textColor: 'black',
      strokeWidth: 1,
      strokeColor: 0x000000,
      width: 225,
      height: 50,
      text: 'Start',
      backgroundColor: 0xffffff,
    })
  }
}
