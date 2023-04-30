import Phaser from "phaser"
import { MenuButton } from "../ui/MenuButton"
import Scenes from "."

export default class Credits extends Phaser.Scene {
  constructor() {
    super(Scenes.CREDITS)
  }

  create() {
    const message = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 120,
      "Game built by Liam Hawkstein",
      { color: "#fff", fontSize: "24px", fontFamily: "KenneyMiniSquare" }
    )
    message.x -= message.width / 2
    message.y -= message.height / 2

    const font = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 70,
      "Font created by the super awesome Kenney",
      { color: "#fff", fontSize: "24px", fontFamily: "KenneyMiniSquare" }
    )
    font.x -= font.width / 2
    font.y -= font.height / 2

    const phaser = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 20,
      "Phaser library by the legendary Rich Davey",
      { color: "#fff", fontSize: "24px", fontFamily: "KenneyMiniSquare" }
    )
    phaser.x -= phaser.width / 2
    phaser.y -= phaser.height / 2

    new MenuButton({
      scene: this,
      label: "Back to the menu",
      onClick: () => {
        this.scene.start(Scenes.START)
      },
      x: this.cameras.main.centerX,
      y: 600,
    })
  }
}
