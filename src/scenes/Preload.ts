import Phaser from "phaser"
import Scenes from "."
import { loadGameData } from "../data"
import { BACKGROUND_COLOUR } from "../constants"

export default class Preload extends Phaser.Scene {
  constructor() {
    super(Scenes.PRELOAD)
  }

  init() {
    loadGameData()
  }

  preload() {
    // Create text with font families that you have preloaded in index.html to ensure Phaser will render them
    const message = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "Loading...",
      {
        color: BACKGROUND_COLOUR,
        fontSize: "48px",
        fontFamily: "KenneyMiniSquare",
      }
    )
    message.setOrigin(0.5, 0.8)
    //this.load.pack({ key: "preload", url: "assets/pack.json" });
  }

  create() {
    window.setTimeout(() => {
      this.scene.start(Scenes.START)
    }, 50)
  }
}
