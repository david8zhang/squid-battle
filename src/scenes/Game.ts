import { Player } from './Player'

export class Game extends Phaser.Scene {
  public tileMap!: Phaser.Tilemaps.Tilemap
  public player!: Player

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

  createLayer(layerName: string, tileset: Phaser.Tilemaps.Tileset) {
    const layer = this.tileMap.createLayer(layerName, tileset)
    layer.setOrigin(0)
    layer.setCollisionByExclusion([-1])
    return layer
  }

  create() {
    this.cameras.main.setBackgroundColor('#dddddd')
    this.initTilemap()
    this.player = new Player(this)
  }
}
