import { Game } from '~/scenes/Game'
import { Squid } from './Squid'
import { Constants } from '~/utils/Constants'
import { Side } from '~/utils/Side'

export class CPU {
  private game: Game
  public party: Squid[] = []
  private unitToMoveIndex: number = 0

  constructor(game: Game) {
    this.game = game
    this.initParty()
  }

  switchTurn() {
    this.game.time.delayedCall(500, () => {
      this.unitToMoveIndex = 0
      this.livingUnits.forEach((unit) => {
        unit.setHasMoved(false)
      })
      this.game.setTurn(Side.PLAYER)
    })
  }

  moveNextUnit() {
    if (this.unitToMoveIndex < this.livingUnits.length) {
      this.handleUnitMoveLogic()
    } else {
      this.switchTurn()
    }
  }

  handleUnitMoveLogic() {
    const unitToMove = this.livingUnits[this.unitToMoveIndex]
    this.game.cameras.main.pan(unitToMove.x, unitToMove.y, 500)
    this.game.time.delayedCall(500, () => {
      this.unitToMoveIndex++
      const moveableSquares = unitToMove.getMoveableSquares()
      if (moveableSquares.length == 1) {
        unitToMove.spreadInkToTiles()
      } else {
        const attackableEnemyUnits = unitToMove.isStandingInOwnInk()
          ? unitToMove.getAttackableEnemyUnits()
          : []
        if (attackableEnemyUnits.length > 0) {
          const randomAttackableEnemyUnit = Phaser.Utils.Array.GetRandom(attackableEnemyUnits)
          this.game.sound.play('punch', { volume: 0.5 })
          randomAttackableEnemyUnit.takeDamage(5)
        } else {
          const randomSquare = Phaser.Utils.Array.GetRandom(moveableSquares)
          unitToMove.moveToRowColPosition(randomSquare.row, randomSquare.col)
          const newAttackableUnits = unitToMove.isStandingInOwnInk()
            ? unitToMove.getAttackableEnemyUnits()
            : []
          if (newAttackableUnits.length > 0) {
            const randomAttackableEnemyUnit = Phaser.Utils.Array.GetRandom(newAttackableUnits)
            this.game.sound.play('punch', { volume: 0.5 })
            randomAttackableEnemyUnit.takeDamage(5)
          } else {
            unitToMove.spreadInkToTiles()
          }
        }
      }
      unitToMove.setHasMoved(true)
      this.game.time.delayedCall(500, () => {
        this.moveNextUnit()
      })
    })
  }

  startTurn() {
    const firstUnit = this.party[0]
    this.game.cameras.main.pan(firstUnit.x, firstUnit.y, 1000, Phaser.Math.Easing.Sine.InOut)
    this.game.time.delayedCall(1250, () => {
      this.moveNextUnit()
    })
    this.party.forEach((squid) => {
      if (squid.isKnockedOut) {
        squid.decrementKnockdownTurns()
      } else {
        squid.decrementPowerUpTurns()
      }
    })
  }

  get livingUnits() {
    return this.party.filter((squid) => !squid.isKnockedOut)
  }

  initParty() {
    this.party = Constants.ALL_CPU_PARTY_MEMBER_CONFIGS[this.game.currLevelIndex].map((squid) => {
      const { tilePosition } = squid
      const cell = this.game.grid.getCellAtRowCol(tilePosition.y, tilePosition.x)
      return new Squid(this.game, {
        position: {
          x: cell.centerX,
          y: cell.centerY,
        },
        texture: 'squid',
        side: Side.CPU,
      })
    })
  }

  resetParty() {
    this.party.forEach((squid) => {
      squid.destroy()
    })
    this.initParty()
  }
}
