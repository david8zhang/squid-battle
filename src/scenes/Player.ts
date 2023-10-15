import { Squid } from '~/core/Squid'
import { Game } from './Game'
import { Cursor } from '~/core/Cursor'
import { Constants } from '~/utils/Constants'
import { Direction } from '~/utils/Direction'
import { Side } from '~/utils/Side'

export enum ActionState {
  SELECT_UNIT_TO_MOVE = 'select_unit_to_move',
  SELECT_MOVE_DEST = 'select_move_dest',
  SELECT_ATTACK_TARGET = 'select_attack_target',
}

export class Player {
  private game: Game
  public party!: Squid[]
  private cursor!: Cursor
  public actionState: ActionState = ActionState.SELECT_UNIT_TO_MOVE
  public selectedUnitToMove: Squid | null = null

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
  }

  handleMouseClick(pointer: Phaser.Input.Pointer) {
    const cell = this.game.grid.getCellAtWorldPosition(pointer.worldX, pointer.worldY)
    this.moveCursorToRowCol(cell.gridRow, cell.gridCol)
  }

  handleArrowKeyPress(arrowKeyCode: string) {
    this.moveCursorWithArrows(arrowKeyCode)
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

  initParty() {
    this.party = Constants.PARTY_MEMBER_CONFIGS.map((squid) => {
      const { tilePosition } = squid
      const cell = this.game.grid.getCellAtRowCol(tilePosition.y, tilePosition.x)
      return new Squid(this.game, {
        position: {
          x: cell.centerX,
          y: cell.centerY,
        },
        texture: 'green-character',
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

  handleMoveUnitToCursor() {
    if (this.canMovePlayerToCursorPosition()) {
      this.movePlayerToCursorPosition()
      // this.attackableEnemyUnits = this.getAttackableEnemies()
      // if (this.attackableEnemyUnits.length > 0) {
      //   this.selectedUnitToMove!.highlightOnlyAttackableSquares()
      //   this.moveCursorToAttackableTarget()
      //   this.cursor.setCursorTint(0xffcccb)
      //   this.actionState = ActionState.SELECT_ATTACK_TARGET
      // } else {
      this.completeUnitAction()
      // }
    }
  }

  completeUnitAction() {
    const { row, col } = this.selectedUnitToMove!.getRowCol()
    this.moveCursorToRowCol(row, col)
    this.actionState = ActionState.SELECT_UNIT_TO_MOVE
    this.selectedUnitToMove!.setHasMoved(true)
    this.selectedUnitToMove = null

    // Check for game over condition after each unit action
    // const gameOverCondition = this.game.getGameOverCondition()
    // if (gameOverCondition !== GameOverConditions.IN_PROGRESS) {
    //   this.game.handleGameOverCondition(gameOverCondition)
    // } else {
    //   if (this.hasLastUnitMoved()) {
    //     this.switchTurn()
    //   }
    // }
  }

  getPlayerAtCursor() {
    const livingUnits = this.party
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
        // case ActionState.SELECT_ATTACK_TARGET: {
        //   this.handleAttackSelectedTarget()
        //   break
        // }
      }
    }
  }
}
