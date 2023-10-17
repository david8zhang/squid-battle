export class Preload extends Phaser.Scene {
  constructor() {
    super('preload')
  }

  preload() {
    this.load.tilemapTiledJSON('squid-battle-map', 'squid-battle-map.json')
    this.load.image('squid-battle-tiles', 'squid-battle-tiles.png')
    this.load.image('green-character', 'green_character.png')
    this.load.image('red-character', 'red_character.png')
    this.load.image('cursor', 'cursor.png')
    this.load.image('attack-cursor', 'attack-cursor.png')
    this.load.image('squid', 'squid.png')
    this.load.image('squid-knocked-out', 'squid-knocked-out.png')
    this.load.image('splash', 'splash.jpg')

    // Power Ups
    this.load.image('heart', 'power-ups/heart.png')
    this.load.image('flask', 'power-ups/flask.png')
    this.load.image('shield', 'power-ups/shield.png')
    this.load.image('sword', 'power-ups/sword.png')
  }

  create() {
    this.scene.start('start')
  }
}
