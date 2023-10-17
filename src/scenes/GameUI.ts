import { Constants } from '~/utils/Constants'
import { Game } from './Game'
import { Side } from '~/utils/Side'
import { Button } from '~/core/Button'

export class GameUI extends Phaser.Scene {
  private transitionText!: Phaser.GameObjects.Text
  private transitionRect!: Phaser.GameObjects.Rectangle
  private remainingTurnsText!: Phaser.GameObjects.Text
  public static instance: GameUI

  // Game over modal
  public gameOverModal!: Phaser.GameObjects.Rectangle
  public gameOverTitleLabel!: Phaser.GameObjects.Text
  public playerControlPctLabel!: Phaser.GameObjects.Text
  public cpuControlPctLabel!: Phaser.GameObjects.Text
  public playerControlPctText!: Phaser.GameObjects.Text
  public cpuControlPctText!: Phaser.GameObjects.Text
  public resultModalText!: Phaser.GameObjects.Text
  public continueButton!: Button
  public vsText!: Phaser.GameObjects.Text

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
        fontFamily: Constants.FONT_FAMILY,
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
        fontFamily: Constants.FONT_FAMILY,
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
      this.gameOverModal.y - this.gameOverModal.displayHeight / 2 + 20,
      'Round Over',
      {
        fontSize: '30px',
        fontFamily: Constants.FONT_FAMILY,
        color: 'black',
      }
    )
    this.gameOverTitleLabel.setPosition(
      this.gameOverModal.x - this.gameOverTitleLabel.displayWidth / 2,
      this.gameOverTitleLabel.y
    )
    this.gameOverTitleLabel.setVisible(false)

    this.playerControlPctLabel = this.add
      .text(
        this.gameOverModal.x - this.gameOverModal.displayWidth / 4,
        this.gameOverTitleLabel.y + this.gameOverTitleLabel.displayHeight + 45,
        'Player',
        {
          fontSize: '20px',
          fontFamily: Constants.FONT_FAMILY,
          color: 'black',
        }
      )
      .setVisible(false)
    this.cpuControlPctLabel = this.add
      .text(
        this.gameOverModal.x + this.gameOverModal.displayWidth / 4,
        this.gameOverTitleLabel.y + this.gameOverTitleLabel.displayHeight + 45,
        'CPU',
        {
          fontSize: '20px',
          fontFamily: Constants.FONT_FAMILY,
          color: 'black',
        }
      )
      .setVisible(false)
    this.vsText = this.add
      .text(Constants.WINDOW_WIDTH / 2, Constants.WINDOW_HEIGHT / 2, 'vs.', {
        fontSize: '20px',
        color: 'gray',
        fontFamily: Constants.FONT_FAMILY,
      })
      .setVisible(false)
    Constants.centerText(Constants.WINDOW_WIDTH / 2, this.vsText)
    Constants.centerText(
      this.gameOverModal.x - this.gameOverModal.displayWidth / 4,
      this.playerControlPctLabel
    )

    Constants.centerText(
      this.gameOverModal.x + this.gameOverModal.displayWidth / 4,
      this.cpuControlPctLabel
    )

    this.playerControlPctText = this.add
      .text(
        this.playerControlPctLabel.x,
        this.playerControlPctLabel.y + this.playerControlPctLabel.displayHeight + 15,
        '',
        {
          fontSize: '40px',
          fontFamily: Constants.FONT_FAMILY,
          color: '#36d98c',
        }
      )
      .setVisible(false)
    this.cpuControlPctText = this.add
      .text(
        this.cpuControlPctLabel.x,
        this.cpuControlPctLabel.y + this.cpuControlPctLabel.displayHeight + 15,
        '',
        {
          fontSize: '40px',
          fontFamily: Constants.FONT_FAMILY,
          color: '#fc5c65',
        }
      )
      .setVisible(false)
    this.resultModalText = this.add.text(
      Constants.WINDOW_WIDTH / 2,
      this.playerControlPctText.y + this.playerControlPctText.displayHeight + 20,
      '',
      {
        fontSize: '20px',
        fontFamily: Constants.FONT_FAMILY,
        color: 'black',
      }
    )

    this.continueButton = new Button({
      scene: this,
      onClick: () => {
        Game.instance.handleRoundOver()
      },
      text: 'Continue',
      fontSize: '12px',
      fontFamily: Constants.FONT_FAMILY,
      textColor: 'black',
      strokeColor: 0x000000,
      strokeWidth: 1,
      width: 140,
      height: 40,
      x: Constants.WINDOW_WIDTH / 2,
      y: this.resultModalText.y + this.resultModalText.displayHeight + 15,
    })
    this.continueButton.setVisible(false)
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
    this.cpuControlPctText.setVisible(true)
    this.playerControlPctLabel.setVisible(true)
    this.cpuControlPctLabel.setVisible(true)
    this.vsText.setVisible(true)

    const playerPctXPos = Constants.WINDOW_WIDTH / 2 - (Constants.WINDOW_WIDTH * 0.5) / 4
    const cpuPctXPos = Constants.WINDOW_WIDTH / 2 + (Constants.WINDOW_WIDTH * 0.5) / 4

    this.time.addEvent({
      delay: 30,
      callback: () => {
        const randomPlayerPct = Phaser.Math.Between(1, 100)
        const randomEnemyPct = Phaser.Math.Between(1, 100)
        this.playerControlPctText.setText(`${randomPlayerPct}%`)
        this.cpuControlPctText.setText(`${randomEnemyPct}%`)
      },
      repeat: 50,
    })
    this.time.delayedCall(1550, () => {
      const percentages = Game.instance.calculatePercentages()
      const playerPct = Math.round(percentages.playerPct * 100)
      const cpuPct = Math.round(percentages.cpuPct * 100)
      this.playerControlPctText.setText(`${playerPct}%`)
      this.cpuControlPctText.setText(`${cpuPct}%`)

      this.playerControlPctText.setPosition(
        playerPctXPos - this.playerControlPctText.displayWidth / 2,
        this.playerControlPctText.y
      )
      this.cpuControlPctText.setPosition(
        cpuPctXPos - this.cpuControlPctText.displayWidth / 2,
        this.cpuControlPctText.y
      )

      this.time.delayedCall(500, () => {
        const winningSide = playerPct > cpuPct ? Side.PLAYER : Side.CPU
        this.resultModalText.setText(`${winningSide} wins!`)
        this.resultModalText.setPosition(
          Constants.WINDOW_WIDTH / 2 - this.resultModalText.displayWidth / 2,
          this.resultModalText.y
        )
        this.continueButton.setVisible(true)
        this.continueButton.setPosition(
          Constants.WINDOW_WIDTH / 2,
          this.resultModalText.y + this.resultModalText.displayHeight + 35
        )
      })
    })
  }

  public tweenGameOverModalOut(onEndCb: Function) {
    // Tween the modal closing
    this.tweens.add({
      targets: this.gameOverModal,
      width: { to: 0, from: Constants.WINDOW_WIDTH * 0.5 },
      height: { to: 0, from: Constants.WINDOW_HEIGHT * 0.5 },
      duration: 500,
      onStart: () => {
        this.gameOverModal.setStrokeStyle(0)
        this.cpuControlPctLabel.setVisible(false)
        this.cpuControlPctText.setVisible(false)
        this.playerControlPctLabel.setVisible(false)
        this.playerControlPctText.setVisible(false)
        this.resultModalText.setVisible(false)
        this.gameOverTitleLabel.setVisible(false)
        this.continueButton.setVisible(false)
        this.vsText.setVisible(false)
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
