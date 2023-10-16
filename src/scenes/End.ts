import { Constants } from '~/utils/Constants'

export class End extends Phaser.Scene {
  constructor() {
    super('end')
  }

  create() {
    const titleText = this.add.text(
      Constants.WINDOW_WIDTH / 2,
      Constants.WINDOW_HEIGHT / 3,
      'Thanks for playing!',
      {
        fontSize: '30px',
        color: 'white',
        fontFamily: Constants.FONT_FAMILY,
      }
    )
    const subtitleText = this.add
      .text(
        Constants.WINDOW_WIDTH / 2,
        titleText.y + titleText.displayHeight + 20,
        'Special thanks to @stripedpants for art',
        {
          fontSize: '15px',
          fontFamily: Constants.FONT_FAMILY,
        }
      )
      .setInteractive({ useHandCursor: true })
      .on(Phaser.Input.Events.POINTER_UP, () => {
        window.location.href = 'https://twitter.com/mrstripedpants'
      })
    Constants.centerText(Constants.WINDOW_WIDTH / 2, subtitleText)
    Constants.centerText(Constants.WINDOW_WIDTH / 2, titleText)
  }
}
