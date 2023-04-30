import { BACKGROUND_COLOUR, GAME_HEIGHT, GAME_WIDTH } from "./constants"
import Phaser from "phaser"

export default {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: BACKGROUND_COLOUR,
  scale: {
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    mode: Phaser.Scale.NONE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    //zoom: 2,
  },
  //pixelArt: true,
  physics: {
    default: "matter",
    matter: {
      gravity: { x: 0, y: 0 },
      debug: true,
    },
  },
}
