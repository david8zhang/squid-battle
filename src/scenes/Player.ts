import { Squid } from '~/core/Squid'
import { Game } from './Game'
import { Cursor } from '~/core/Cursor'
import { Constants } from '~/utils/Constants'
import { Direction } from '~/utils/Direction'

export class Player {
  private game: Game
  private party!: Squid[]
  private cursor!: Cursor

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
        // case 'Space': {
        //   this.handleSpaceBarPress()
        //   break
        // }
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
}
