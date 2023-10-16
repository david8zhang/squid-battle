import { Constants } from '~/utils/Constants'
import { Player } from '../core/Player'
import { Grid } from '~/core/Grid'
import { Side } from '~/utils/Side'
import { Squid } from '~/core/Squid'
import { ActionMenu } from '~/core/ActionMenu'
import { CPU } from '~/core/CPU'
import { GameUI } from './GameUI'

export class Game extends Phaser.Scene {
  public static instance: Game

  public tileMap!: Phaser.Tilemaps.Tilemap
  public player!: Player
  public cpu!: CPU
  public grid!: Grid
  public currTurn: Side = Side.PLAYER
  public actionMenu!: ActionMenu
  public turnsRemaining: number = Constants.TOTAL_TURNS
  public currLevelIndex: number = 0

  constructor() {
    super('game')
    Game.instance = this
  }

  create() {
    this.cameras.main.setBackgroundColor('#dddddd')
    this.cameras.main.setBounds(0, 0, Constants.GAME_WIDTH, Constants.GAME_HEIGHT)
    this.initTilemap()
    this.initGrid()
    this.player = new Player(this)
    this.cpu = new CPU(this)
    this.actionMenu = new ActionMenu(this)
  }

  initTilemap() {
    this.tileMap = this.make.tilemap({
      key: 'squid-battle-map',
    })
    const tileset = this.tileMap.addTilesetImage('squid-battle-tiles', 'squid-battle-tiles')
    this.createLayer('Ground', tileset)
  }

  getWorldPositionForTile(tileX: number, tileY: number) {
    const tile = this.tileMap.getTileAt(tileX, tileY, false, 'Ground')
    return {
      x: tile.pixelX,
      y: tile.pixelY,
    }
  }

  getAllLivingUnits() {
    const livingPlayerUnits = this.player.livingUnits
    const livingCPUUnits = this.cpu.livingUnits
    return livingPlayerUnits.concat(livingCPUUnits)
  }

  unitAtPosition(row: number, col: number, currUnit: Squid) {
    const allUnits = this.getAllLivingUnits()
    for (let i = 0; i < allUnits.length; i++) {
      const unit = allUnits[i]
      const rowCol = unit.getRowCol()
      if (rowCol.row === row && rowCol.col === col && currUnit !== unit) {
        return true
      }
    }
    return false
  }

  setTurn(side: Side) {
    if (this.turnsRemaining == 0) {
      GameUI.instance.showGameOverModalAndDisplayResults()
    } else {
      this.currTurn = side
      GameUI.instance.transitionTurn(() => {
        if (side === Side.CPU) {
          this.cpu.startTurn()
        } else if (side === Side.PLAYER) {
          this.player.startTurn()
          this.turnsRemaining--
        }
      }, side === Side.PLAYER)
    }
  }

  initGrid() {
    this.grid = new Grid(this, {
      width: Constants.GAME_WIDTH,
      height: Constants.GAME_HEIGHT,
      cellSize: Constants.TILE_SIZE,
    })
  }

  createLayer(layerName: string, tileset: Phaser.Tilemaps.Tileset) {
    const layer = this.tileMap.createLayer(layerName, tileset)
    layer.setOrigin(0)
    layer.setCollisionByExclusion([-1])
    return layer
  }

  panCameraIfNecessary(targetRow: number, targetCol: number) {
    const camera = this.cameras.main
    const cell = this.grid.getCellAtRowCol(targetRow, targetCol)

    const cameraLeftBound = camera.midPoint.x - camera.width / 2
    const cameraRightBound = camera.midPoint.x + camera.width / 2
    const cameraUpperBound = camera.midPoint.y - camera.height / 2
    const cameraLowerBound = camera.midPoint.y + camera.height / 2

    if (cell.centerX <= cameraLeftBound) {
      camera.scrollX -= Constants.TILE_SIZE
    }
    if (cell.centerX >= cameraRightBound) {
      camera.scrollX += Constants.TILE_SIZE
    }
    if (cell.centerY >= cameraLowerBound) {
      camera.scrollY += Constants.TILE_SIZE
    }
    if (cell.centerY <= cameraUpperBound) {
      camera.scrollY -= Constants.TILE_SIZE
    }
  }

  calculatePercentages() {
    let totalPlayerTiles = 0
    let totalCPUTiles = 0
    const layer = this.tileMap.getLayer('Ground')
    for (let i = 0; i < layer.data.length; i++) {
      for (let j = 0; j < layer.data[0].length; j++) {
        const tile = layer.data[i][j]
        if (tile.tint == Constants.PLAYER_INK_COLOR) {
          totalPlayerTiles++
        }
        if (tile.tint == Constants.CPU_INK_COLOR) {
          totalCPUTiles++
        }
      }
    }
    const totalTiles = layer.data.length * layer.data[0].length
    return {
      playerPct: totalPlayerTiles / totalTiles,
      cpuPct: totalCPUTiles / totalTiles,
    }
  }

  goToNextLevel() {
    this.turnsRemaining = Constants.TOTAL_TURNS
    if (this.currLevelIndex == Constants.ALL_CPU_PARTY_MEMBER_CONFIGS.length - 1) {
      // Go to thanks for playing screen
    } else {
      this.currLevelIndex++
      GameUI.instance.tweenGameOverModalOut(() => {
        this.player.resetParty()
        this.cpu.resetParty()
      })
      const layer = this.tileMap.getLayer('Ground')
      for (let i = 0; i < layer.data.length; i++) {
        for (let j = 0; j < layer.data[0].length; j++) {
          const tile = layer.data[i][j]
          tile.tint = 0xffffff
          tile.setAlpha(1)
        }
      }
      this.currTurn = Side.PLAYER
      this.player.startTurn()
    }
  }
}
