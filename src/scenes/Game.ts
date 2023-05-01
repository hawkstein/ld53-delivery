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

export interface GameScene extends Phaser.Scene {
  ship?: PlayerShip
}

export default class Game extends Phaser.Scene implements GameScene {
  public ship?: PlayerShip
  private windZone?: WindZone
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
    this.windZone = new WindZone(this)
    const direction = Phaser.Utils.Array.GetRandom(this.directions)
    this.windZone.updateDirection(direction)
    this.ship.setWindAngle(direction.angle)
  }

  update() {
    this.ship?.update()
  }
}
