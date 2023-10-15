import { Constants } from '~/utils/Constants'
import { Player } from './Player'
import { Grid } from '~/core/Grid'
import { Side } from '~/utils/Side'
import { Squid } from '~/core/Squid'

export class Game extends Phaser.Scene {
  public tileMap!: Phaser.Tilemaps.Tilemap
  public player!: Player
  public grid!: Grid
  public currTurn: Side = Side.PLAYER

  constructor() {
    super('game')
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
    const livingPlayerUnits = this.player.party
    // const livingCPUUnits = this.cpu.getLivingUnits()
    return livingPlayerUnits
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

  initGrid() {
    this.grid = new Grid(this, {
      width: Constants.GAME_WIDTH,
      height: Constants.GAME_HEIGHT,
      cellSize: Constants.TILE_SIZE,
    })
    this.grid.showGrid()
  }

  createLayer(layerName: string, tileset: Phaser.Tilemaps.Tileset) {
    const layer = this.tileMap.createLayer(layerName, tileset)
    layer.setOrigin(0)
    layer.setCollisionByExclusion([-1])
    return layer
  }

  create() {
    this.cameras.main.setBackgroundColor('#dddddd')
    this.initTilemap()
    this.initGrid()
    this.player = new Player(this)
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
}
