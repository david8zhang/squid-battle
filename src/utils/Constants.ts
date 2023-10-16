export class Constants {
  public static readonly TOTAL_TURNS = 10
  public static readonly PLAYER_INK_COLOR = 0x36d98c
  public static readonly CPU_INK_COLOR = 0xfc5c65

  public static readonly GAME_WIDTH = 1200
  public static readonly GAME_HEIGHT = 600

  public static readonly WINDOW_WIDTH = 1200
  public static readonly WINDOW_HEIGHT = 600
  public static readonly TILE_SIZE = 60

  public static CPU_PARTY_MEMBER_CONFIGS = [
    {
      tilePosition: {
        x: 4,
        y: 2,
      },
    },
    {
      tilePosition: {
        x: 4,
        y: 3,
      },
    },
    {
      tilePosition: {
        x: 4,
        y: 4,
      },
    },
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
}
