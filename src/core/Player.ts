import { Squid } from '~/core/Squid'
import { Game } from '../scenes/Game'
import { Cursor } from '~/core/Cursor'
import { Constants, PowerUpTypes } from '~/utils/Constants'
import { Direction } from '~/utils/Direction'
import { Side } from '~/utils/Side'

export enum ActionState {
  SELECT_UNIT_TO_MOVE = 'select_unit_to_move',
  SELECT_MOVE_DEST = 'select_move_dest',
  SELECT_ATTACK_TARGET = 'select_attack_target',
  SELECT_ACTION = 'select_action',
}

export enum ActionTypes {
  SPREAD_INK = 'Spread Ink',
  ATTACK = 'Attack',
}

export class Player {
  private game: Game
  public party!: Squid[]
  private cursor!: Cursor
  public actionState: ActionState = ActionState.SELECT_UNIT_TO_MOVE
  public selectedUnitToMove: Squid | null = null
  public selectedAttackableUnitIndex: number = 0
  public isSelectingAction: boolean = false

  constructor(game: Game) {
    this.game = game
    this.initParty()
    this.cursor = new Cursor(this.game, {
      x: this.party[0].x,
      y: this.party[0].y,
    })
    this.initKeyboardListener()
    this.initMouseClickListener()
  }

  moveCursorToRowCol(row: number, col: number) {
    this.cursor.moveToRowCol(row, col)
    if (this.actionState === ActionState.SELECT_MOVE_DEST) {
      if (this.canMovePlayerToCursorPosition()) {
        this.cursor.setCursorTint(0x00ff00)
      } else {
        this.cursor.setCursorTint(0xff0000)
      }
    }
  }

  handleMouseClick(pointer: Phaser.Input.Pointer) {
    if (!this.isSelectingAction) {
      switch (this.actionState) {
        case ActionState.SELECT_UNIT_TO_MOVE:
        case ActionState.SELECT_MOVE_DEST: {
          const cell = this.game.grid.getCellAtWorldPosition(pointer.worldX, pointer.worldY)
          this.moveCursorToRowCol(cell.gridRow, cell.gridCol)
          break
        }
      }
    }
  }

  handleArrowKeyPress(arrowKeyCode: string) {
    if (!this.isSelectingAction) {
      switch (this.actionState) {
        case ActionState.SELECT_UNIT_TO_MOVE:
        case ActionState.SELECT_MOVE_DEST:
          this.moveCursorWithArrows(arrowKeyCode)
          break
        case ActionState.SELECT_ATTACK_TARGET: {
          this.scrollAttackTargets(arrowKeyCode)
        }
      }
    }
  }

  moveCursorWithArrows(arrowKeyCode: string) {
    switch (arrowKeyCode) {
      case 'ArrowDown': {
        this.cursor.moveUnitsInDirection(Direction.DOWN, 1)
        break
      }
      case 'ArrowLeft': {
        this.cursor.moveUnitsInDirection(Direction.LEFT, 1)
        break
      }
      case 'ArrowRight': {
        this.cursor.moveUnitsInDirection(Direction.RIGHT, 1)
        break
      }
      case 'ArrowUp': {
        this.cursor.moveUnitsInDirection(Direction.UP, 1)
        break
      }
    }
  }

  initMouseClickListener() {
    this.game.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.handleMouseClick(pointer)
    })
  }

  initKeyboardListener() {
    this.game.input.keyboard.on('keydown', (e) => {
      switch (e.code) {
        case 'ArrowDown':
        case 'ArrowUp':
        case 'ArrowLeft':
        case 'ArrowRight':
          this.handleArrowKeyPress(e.code)
          break
        case 'Space': {
          this.handleSpaceBarPress()
          break
        }
        // case 'Escape': {
        //   this.revertCursorToScroll()
        //   break
        // }
      }
    })
  }

  get livingUnits() {
    return this.party.filter((units) => !units.isKnockedOut)
  }

  startTurn() {
    const firstUnit = this.livingUnits[0]
    this.game.cameras.main.pan(firstUnit.x, firstUnit.y, 1000, Phaser.Math.Easing.Sine.InOut)
    this.cursor.show()
    this.party.forEach((squid) => {
      if (squid.isKnockedOut) {
        squid.decrementKnockdownTurns()
      } else {
        squid.decrementPowerUpTurns()
      }
    })
  }

  initParty() {
    this.party = Constants.PLAYER_PARTY_MEMBER_CONFIGS.map((squid) => {
      const { tilePosition } = squid
      const cell = this.game.grid.getCellAtRowCol(tilePosition.y, tilePosition.x)
      return new Squid(this.game, {
        position: {
          x: cell.centerX,
          y: cell.centerY,
        },
        texture: 'squid',
        side: Side.PLAYER,
      })
    })
  }

  canMovePlayerToCursorPosition(): boolean {
    const gridRowCol = this.cursor.gridRowColPosition
    return (
      this.selectedUnitToMove != null &&
      this.selectedUnitToMove.isSquareWithinMoveableSquares(gridRowCol.row, gridRowCol.col) &&
      !this.game.unitAtPosition(gridRowCol.row, gridRowCol.col, this.selectedUnitToMove)
    )
  }

  movePlayerToCursorPosition() {
    const gridRowCol = this.cursor.gridRowColPosition
    this.selectedUnitToMove!.moveToRowColPosition(gridRowCol.row, gridRowCol.col)
  }

  handleActionSelect(optionLabel: ActionTypes) {
    switch (optionLabel) {
      case ActionTypes.SPREAD_INK: {
        this.selectedUnitToMove!.spreadInkToTiles()
        this.completeUnitAction()
        break
      }
      case ActionTypes.ATTACK: {
        this.cursor.setTexture('attack-cursor')
        this.actionState = ActionState.SELECT_ATTACK_TARGET
        const attackableEnemyUnits = this.selectedUnitToMove!.getAttackableEnemyUnits()
        this.moveCursorToAttackableTarget(attackableEnemyUnits)
        break
      }
    }
  }

  moveCursorToAttackableTarget(attackableTargets: Squid[]) {
    const firstAttackableUnit = attackableTargets[this.selectedAttackableUnitIndex]
    const { row, col } = firstAttackableUnit.getRowCol()
    this.moveCursorToRowCol(row, col)
  }

  scrollAttackTargets(arrowKeyCode: string) {
    const attackableTargets = this.selectedUnitToMove!.getAttackableEnemyUnits()
    switch (arrowKeyCode) {
      case 'ArrowUp':
      case 'ArrowRight': {
        this.selectedAttackableUnitIndex++
        this.selectedAttackableUnitIndex %= attackableTargets.length
        this.moveCursorToAttackableTarget(attackableTargets)
        break
      }
      case 'ArrowDown':
      case 'ArrowLeft': {
        this.selectedAttackableUnitIndex--
        this.selectedAttackableUnitIndex %= attackableTargets.length
        if (this.selectedAttackableUnitIndex < 0) {
          this.selectedAttackableUnitIndex += attackableTargets.length
        }
        this.moveCursorToAttackableTarget(attackableTargets)
        break
      }
    }
  }

  getAllSquaresWithinDistance(startPos: { row: number; col: number }, distance: number) {
    const queue = [
      {
        row: startPos.row,
        col: startPos.col,
        level: 0,
      },
    ]
    const directions = [
      [0, 1],
      [0, -1],
      [1, 0],
      [-1, 0],
    ]
    let seen = new Set()
    const result: { row: number; col: number }[] = [
      {
        row: startPos.row,
        col: startPos.col,
      },
    ]

    while (queue.length > 0) {
      const node = queue.shift()
      directions.forEach((dir) => {
        const newRow = node!.row + dir[0]
        const newCol = node!.col + dir[1]
        if (this.game.grid.withinBounds(newRow, newCol) && !seen.has(`${newRow},${newCol}`)) {
          seen.add(`${newRow},${newCol}`)
          if (node!.level + 1 <= distance) {
            result.push({
              row: newRow,
              col: newCol,
            })
          }
          queue.push({
            row: newRow,
            col: newCol,
            level: node!.level + 1,
          })
        }
      })
    }
    return result
  }

  getOptionConfigs() {
    const optionConfigs = [
      {
        optionText: ActionTypes.SPREAD_INK,
      },
    ]
    const attackableEnemyUnits = this.selectedUnitToMove!.getAttackableEnemyUnits()
    const isStandingInOwnInk = this.selectedUnitToMove!.isStandingInOwnInk()
    if (isStandingInOwnInk && attackableEnemyUnits.length > 0) {
      optionConfigs.push({
        optionText: ActionTypes.ATTACK,
      })
    }
    return optionConfigs
  }

  showOptionMenu() {
    // Show action menu
    this.isSelectingAction = true
    const optionConfigs = this.getOptionConfigs()
    const cell = this.game.grid.getCellAtWorldPosition(
      this.selectedUnitToMove!.x,
      this.selectedUnitToMove!.y
    )

    let menuXPos = this.selectedUnitToMove!.x + this.selectedUnitToMove!.displayWidth / 2 - 10
    if (cell.gridCol >= this.game.grid.numCols - 2) {
      menuXPos = this.selectedUnitToMove!.x - this.selectedUnitToMove!.displayWidth / 2 - 150
    }

    this.game.actionMenu.showMenu(
      optionConfigs,
      {
        x: menuXPos,
        y: this.selectedUnitToMove!.y,
      },
      (optionLabel: ActionTypes) => {
        this.isSelectingAction = false
        this.handleActionSelect(optionLabel)
      }
    )
  }

  handleMoveUnitToCursor() {
    if (this.canMovePlayerToCursorPosition()) {
      this.movePlayerToCursorPosition()
      this.showOptionMenu()
      this.actionState = ActionState.SELECT_ACTION
    }
  }

  completeUnitAction() {
    const { row, col } = this.selectedUnitToMove!.getRowCol()
    this.moveCursorToRowCol(row, col)
    this.actionState = ActionState.SELECT_UNIT_TO_MOVE
    this.selectedUnitToMove!.setHasMoved(true)
    this.selectedUnitToMove = null
    this.selectedAttackableUnitIndex = 0
    this.cursor.setTexture('cursor')
    if (this.hasLastUnitMoved()) {
      this.switchTurn()
    }
  }

  hasLastUnitMoved() {
    const livingUnits = this.livingUnits
    for (let i = 0; i < livingUnits.length; i++) {
      const unit = livingUnits[i]
      if (!unit.hasMoved) {
        return false
      }
    }
    return true
  }

  switchTurn() {
    this.cursor.hide()
    this.party.forEach((unit) => {
      unit.setHasMoved(false)
    })
    this.game.setTurn(Side.CPU)
  }

  getPlayerAtCursor() {
    const livingUnits = this.livingUnits
    const playerAtCursor = livingUnits.find((playerUnit: Squid) => {
      const { row, col } = playerUnit.getRowCol()
      const gridRowCol = this.cursor.gridRowColPosition
      return row === gridRowCol.row && col === gridRowCol.col
    })
    return playerAtCursor !== undefined ? playerAtCursor : null
  }

  canHighlightPlayerForMovement() {
    const playerAtCursor = this.getPlayerAtCursor()
    return playerAtCursor != null && !playerAtCursor.hasMoved
  }

  handleSelectUnitToMove() {
    if (this.canHighlightPlayerForMovement()) {
      const playerAtCursor = this.getPlayerAtCursor()
      playerAtCursor!.highlight()
      this.selectedUnitToMove = playerAtCursor
      this.actionState = ActionState.SELECT_MOVE_DEST
    }
  }

  handleAttackSelectedTarget() {
    this.game.sound.play('punch', {
      volume: 0.5,
    })
    const currSquid = this.selectedUnitToMove!
    const attackableEnemyUnits = currSquid.getAttackableEnemyUnits()
    const targetToAttack = attackableEnemyUnits[this.selectedAttackableUnitIndex]
    if (currSquid.activePowerUp !== null && currSquid.activePowerUp.name == PowerUpTypes.ATK_UP) {
      targetToAttack.takeDamage(10)
    } else {
      targetToAttack.takeDamage(5)
    }
    this.completeUnitAction()
  }

  handleSpaceBarPress() {
    if (this.game.currTurn === Side.PLAYER) {
      switch (this.actionState) {
        case ActionState.SELECT_MOVE_DEST: {
          this.handleMoveUnitToCursor()
          break
        }
        case ActionState.SELECT_UNIT_TO_MOVE: {
          this.handleSelectUnitToMove()
          break
        }
        case ActionState.SELECT_ATTACK_TARGET: {
          this.handleAttackSelectedTarget()
          break
        }
      }
    }
  }

  resetParty() {
    this.party.forEach((squid) => {
      squid.destroy()
    })
    this.initParty()
  }
}
