import { Constants } from '~/utils/Constants'
import { Game } from './Game'
import { Side } from '~/utils/Side'

export class GameUI extends Phaser.Scene {
  private transitionText!: Phaser.GameObjects.Text
  private transitionRect!: Phaser.GameObjects.Rectangle
  private remainingTurnsText!: Phaser.GameObjects.Text
  public static instance: GameUI

  // Game over modal
  public gameOverModal!: Phaser.GameObjects.Rectangle
  public gameOverTitleLabel!: Phaser.GameObjects.Text
  public playerControlPctText!: Phaser.GameObjects.Text
  public enemyControlPctText!: Phaser.GameObjects.Text
  public resultModalText!: Phaser.GameObjects.Text

  constructor() {
    super('game-ui')
    GameUI.instance = this
  }

  create() {
    this.initTransitionUI()
    this.initRemainingTurnsText()
    this.initGameOverModal()
  }

  initRemainingTurnsText() {
    this.remainingTurnsText = this.add
      .text(Constants.WINDOW_WIDTH / 2, 25, `Turns: ${Constants.TOTAL_TURNS}`, {
        fontSize: '20px',
        color: 'white',
      })
      .setVisible(false)
    this.remainingTurnsText
      .setPosition(Constants.WINDOW_WIDTH / 2 - this.remainingTurnsText.displayWidth / 2, 25)
      .setDepth(1000)
  }

  initTransitionUI() {
    this.transitionRect = this.add
      .rectangle(
        Constants.WINDOW_WIDTH / 2,
        Constants.WINDOW_HEIGHT / 2,
        Constants.WINDOW_WIDTH,
        Constants.WINDOW_HEIGHT,
        0x000000,
        1
      )
      .setVisible(false)
      .setDepth(999)
    this.transitionText = this.add
      .text(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 2, '', {
        fontSize: '35px',
        color: 'white',
      })
      .setVisible(false)
      .setDepth(1000)
  }

  hideTransitionUI() {
    this.transitionText.setVisible(false)
  }

  transitionTurn(onEndCb: Function, showTurnsRemaining: boolean) {
    this.transitionText.setText('Player Turn')
    if (Game.instance.currTurn === Side.CPU) {
      this.transitionText.setText('CPU Turn')
    }
    this.transitionText.setPosition(
      Constants.WINDOW_WIDTH / 2 - this.transitionText.displayWidth / 2,
      Constants.WINDOW_HEIGHT / 2 - this.transitionText.displayHeight / 2
    )
    this.remainingTurnsText.setText(`Turns remaining: ${Game.instance.turnsRemaining}`)
    this.remainingTurnsText.setPosition(
      Constants.WINDOW_WIDTH / 2 - this.remainingTurnsText.displayWidth / 2,
      this.transitionText.y + this.transitionText.displayHeight + 10
    )
    this.add.tween({
      targets: this.transitionRect,
      alpha: { from: 0, to: 0.5 },
      onStart: () => {
        this.transitionRect.setVisible(true)
      },
      onComplete: () => {
        this.transitionRect.setVisible(false)
        this.transitionText.setVisible(false)
        this.remainingTurnsText.setVisible(false)
        onEndCb()
      },
      duration: 750,
      hold: 500,
      yoyo: true,
    })
    this.add.tween({
      targets: [this.remainingTurnsText, this.transitionText],
      alpha: { from: 0, to: 1 },
      onStart: () => {
        this.remainingTurnsText.setVisible(showTurnsRemaining)
        this.transitionText.setVisible(true)
      },
      duration: 750,
      hold: 500,
      yoyo: true,
    })
  }

  initGameOverModal() {
    this.gameOverModal = this.add
      .rectangle(
        Constants.WINDOW_WIDTH / 2,
        Constants.WINDOW_HEIGHT / 2,
        Constants.WINDOW_WIDTH * 0.5,
        Constants.WINDOW_HEIGHT * 0.5,
        0xffffff
      )
      .setVisible(false)
      .setOrigin(0)
    this.gameOverTitleLabel = this.add.text(
      this.gameOverModal.x,
      this.gameOverModal.y - this.gameOverModal.displayHeight / 2 + 15,
      'Round Over',
      {
        fontSize: '25px',
        color: 'black',
      }
    )
    this.gameOverTitleLabel.setPosition(
      this.gameOverModal.x - this.gameOverTitleLabel.displayWidth / 2,
      this.gameOverTitleLabel.y
    )
    this.gameOverTitleLabel.setVisible(false)

    this.playerControlPctText = this.add
      .text(
        this.gameOverModal.x - this.gameOverModal.displayWidth / 4,
        this.gameOverModal.y,
        '10%',
        {
          fontSize: '40px',
          color: '#36d98c',
        }
      )
      .setVisible(false)
      .setOrigin(0, 0.5)
    this.enemyControlPctText = this.add
      .text(
        this.gameOverModal.x + this.gameOverModal.displayWidth / 4,
        this.gameOverModal.y,
        '10%',
        {
          fontSize: '40px',
          color: '#fc5c65',
        }
      )
      .setVisible(false)
      .setOrigin(1, 0.5)
  }

  showGameOverModalAndDisplayResults() {
    this.tweens.add({
      targets: this.gameOverModal,
      width: { from: 0, to: Constants.WINDOW_WIDTH * 0.5 },
      height: { from: 0, to: Constants.WINDOW_HEIGHT * 0.5 },
      duration: 500,
      onStart: () => {
        this.gameOverModal.setVisible(true).setOrigin(0)
      },
      onUpdate: (tween, target, param) => {
        target.setPosition(
          Constants.WINDOW_WIDTH / 2 - target.displayWidth / 2,
          Constants.WINDOW_HEIGHT / 2 - target.displayHeight / 2
        )
      },
      onComplete: () => {
        this.gameOverModal.setStrokeStyle(1, 0x000000)
        this.gameOverTitleLabel.setVisible(true)
        this.calculatePercentageAnimation()
      },
    })
  }

  calculatePercentageAnimation() {
    this.playerControlPctText.setVisible(true)
    this.enemyControlPctText.setVisible(true)
    this.time.addEvent({
      delay: 30,
      callback: () => {
        const randomPlayerPct = Phaser.Math.Between(1, 100)
        const randomEnemyPct = Phaser.Math.Between(1, 100)
        this.playerControlPctText.setText(`${randomPlayerPct}%`)
        this.enemyControlPctText.setText(`${randomEnemyPct}%`)
      },
      repeat: 100,
    })
    this.time.delayedCall(3000, () => {})
  }

  private tweenGameOverModalOut(onEndCb: Function) {
    // Tween the modal closing
    this.tweens.add({
      delay: 1000,
      targets: this.gameOverModal,
      width: { to: 0, from: Constants.WINDOW_WIDTH * 0.75 },
      height: { to: 0, from: Constants.WINDOW_HEIGHT * 0.5 },
      duration: 500,
      onStart: () => {
        this.gameOverModal.setStrokeStyle(0)
      },
      onUpdate: (tween, target, param) => {
        target.setPosition(
          Constants.WINDOW_WIDTH / 2 - target.displayWidth / 2,
          Constants.WINDOW_HEIGHT / 2 - target.displayHeight / 2
        )
      },
      onComplete: () => {
        this.gameOverModal.setVisible(false)
        onEndCb()
      },
    })
  }
}
