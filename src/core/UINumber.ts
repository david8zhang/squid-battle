import { Constants } from '~/utils/Constants'

export class UINumber {
  static createNumber(str: string, scene: Phaser.Scene, x: number, y: number, color?: string) {
    const text = scene.add
      .text(x, y, str, {
        fontSize: '20px',
        fontFamily: Constants.FONT_FAMILY,
        color: color || 'red',
      })
      .setOrigin(0.5)
      .setDepth(5000)
      .setStroke('black', 5)
    text.setName('InAir')
    scene.add.tween({
      targets: text,
      duration: 1000,
      ease: 'Exponential.In',
      alpha: {
        getStart: () => 1,
        getEnd: () => 0,
      },
      y: y - 50,
      onComplete: () => {
        text.destroy()
      },
    })
  }
}
