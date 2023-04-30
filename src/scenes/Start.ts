import Phaser from "phaser"
import Scenes from "."
import StartMenu from "../ui/StartMenu"

export default class Start extends Phaser.Scene {
  constructor() {
    super(Scenes.START)
  }

  create() {
    const menu = new StartMenu(
      this,
      this.cameras.main.centerX,
      this.cameras.main.centerY
    )
    menu.build()
  }
}
