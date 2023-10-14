import { Squid } from '~/core/Squid'
import { Game } from './Game'
import { PARTY_MEMBER_CONFIGS } from '~/utils/Constants'

export class Player {
  private game: Game
  private party!: Squid[]

  constructor(game: Game) {
    this.game = game
    this.initParty()
  }

  initParty() {
    this.party = PARTY_MEMBER_CONFIGS.map((squid) => {
      const { tilePosition } = squid
      const worldPos = this.game.getWorldPositionForTile(tilePosition.x, tilePosition.y)
      return new Squid(this.game, {
        position: {
          x: worldPos.x,
          y: worldPos.y,
        },
        texture: 'green-character',
      })
    })
  }
}
