import Phaser from "phaser"
import Scenes from "."
import PlayerShip from "../game/PlayerShip"

export default class Game extends Phaser.Scene {
  private ship?: PlayerShip

  constructor() {
    super(Scenes.GAME)
  }

  create() {
    this.ship = new PlayerShip(this, 100, 100)
  }

  update() {
    this.ship?.update()
  }
}
