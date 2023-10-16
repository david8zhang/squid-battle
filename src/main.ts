import Phaser from 'phaser'

import { Game } from './scenes/Game'
import { Preload } from './scenes/Preload'
import { Constants } from './utils/Constants'
import { GameUI } from './scenes/GameUI'
import { Start } from './scenes/Start'
import { End } from './scenes/End'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: Constants.WINDOW_WIDTH,
  height: Constants.WINDOW_HEIGHT,
  parent: 'phaser',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      // debug: true,
    },
  },
  dom: {
    createContainer: true,
  },
  pixelArt: true,
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Preload, Start, Game, GameUI, End],
}

export default new Phaser.Game(config)
