export enum PowerUpTypes {
  HEAL = 'Heal',
  ATK_UP = 'ATK Up',
  DEF_UP = 'DEF Up',
  INK_UP = 'Ink Up',
}

export class Constants {
  public static readonly KNOCKDOWN_TURNS = 2
  public static readonly TOTAL_TURNS = 10
  public static readonly PLAYER_INK_COLOR = 0x36d98c
  public static readonly CPU_INK_COLOR = 0xfc5c65

  public static readonly GAME_WIDTH = 1200
  public static readonly GAME_HEIGHT = 600

  public static readonly WINDOW_WIDTH = 1200
  public static readonly WINDOW_HEIGHT = 600
  public static readonly TILE_SIZE = 60
  public static readonly NUM_POWER_UPS = 3

  public static LEVEL_1_CPU_PARTY_CONFIGS = [
    {
      tilePosition: {
        x: 17,
        y: 2,
      },
    },
    {
      tilePosition: {
        x: 17,
        y: 3,
      },
    },
    {
      tilePosition: {
        x: 17,
        y: 4,
      },
    },
  ]

  public static LEVEL_2_CPU_PARTY_CONFIGS = [
    {
      tilePosition: {
        x: 17,
        y: 1,
      },
    },
    {
      tilePosition: {
        x: 17,
        y: 2,
      },
    },
    {
      tilePosition: {
        x: 17,
        y: 3,
      },
    },
    {
      tilePosition: {
        x: 17,
        y: 4,
      },
    },
    {
      tilePosition: {
        x: 17,
        y: 5,
      },
    },
  ]

  public static LEVEL_3_CPU_PARTY_CONFIGS = [
    {
      tilePosition: {
        x: 17,
        y: 1,
      },
    },
    {
      tilePosition: {
        x: 17,
        y: 2,
      },
    },
    {
      tilePosition: {
        x: 17,
        y: 3,
      },
    },
    {
      tilePosition: {
        x: 17,
        y: 4,
      },
    },
    {
      tilePosition: {
        x: 17,
        y: 5,
      },
    },
    {
      tilePosition: {
        x: 17,
        y: 6,
      },
    },
    {
      tilePosition: {
        x: 17,
        y: 7,
      },
    },
  ]

  public static ALL_CPU_PARTY_MEMBER_CONFIGS = [
    Constants.LEVEL_1_CPU_PARTY_CONFIGS,
    Constants.LEVEL_2_CPU_PARTY_CONFIGS,
    Constants.LEVEL_3_CPU_PARTY_CONFIGS,
  ]

  public static PLAYER_PARTY_MEMBER_CONFIGS = [
    {
      tilePosition: {
        x: 2,
        y: 2,
      },
    },
    {
      tilePosition: {
        x: 2,
        y: 3,
      },
    },
    {
      tilePosition: {
        x: 2,
        y: 4,
      },
    },
  ]
  public static readonly FONT_FAMILY = 'Kaph'
  public static readonly POWER_UP_CONFIGS = [
    {
      name: PowerUpTypes.HEAL,
      texture: 'heart',
      turnDuration: 1,
      tintColor: 0xe74c3c,
    },
    {
      name: PowerUpTypes.ATK_UP,
      texture: 'sword',
      turnDuration: 3,
      tintColor: 0x3498db,
    },
    {
      name: PowerUpTypes.DEF_UP,
      texture: 'shield',
      turnDuration: 3,
      tintColor: 0xf39c12,
    },
    {
      name: PowerUpTypes.INK_UP,
      texture: 'flask',
      turnDuration: 1,
      tintColor: 0x2c3e50,
    },
  ]

  public static centerText(xToCenterOn: number, text: Phaser.GameObjects.Text) {
    text.setPosition(xToCenterOn - text.displayWidth / 2, text.y)
  }
}
