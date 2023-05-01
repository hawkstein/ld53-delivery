import Phaser from "phaser"
import Scenes from "."
import PlayerShip from "../game/PlayerShip"
import WindZone from "../game/WindZone"

export type WindDirection = {
  rotate: number
  speedX: number
  speedY: number
  angle: number
}

export default class Game extends Phaser.Scene {
  private ship?: PlayerShip
  private directions: WindDirection[]

  constructor() {
    super(Scenes.GAME)
    this.directions = [
      { rotate: 0, speedX: 0, speedY: 300, angle: 90 },
      { rotate: 0, speedX: 0, speedY: -300, angle: -90 },
      { rotate: 90, speedX: 300, speedY: 0, angle: 0 },
      { rotate: 90, speedX: -300, speedY: 0, angle: -180 },
      { rotate: -45, speedX: 300, speedY: 300, angle: 45 },
      { rotate: -45, speedX: -300, speedY: -300, angle: -135 },
      { rotate: 45, speedX: 300, speedY: -300, angle: -45 },
      { rotate: 45, speedX: -300, speedY: 300, angle: 135 },
    ]
  }

  create() {
    this.ship = new PlayerShip(this, 100, 100)
    const wind = new WindZone(this)
    const direction = Phaser.Utils.Array.GetRandom(this.directions)
    wind.updateDirection(direction)
    this.ship.updateDirection(direction)
  }

  update() {
    this.ship?.update()
  }
}
