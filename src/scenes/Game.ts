import Phaser from "phaser"
import Scenes from "."
import PlayerShip from "../game/PlayerShip"
import WindZone from "../game/WindZone"
import MultiKey from "../utils/MultiKey"
import { Keys, getKey } from "../data"

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
  private castSpell?: MultiKey
  private canSpellcast: boolean

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
    this.canSpellcast = true
  }

  create() {
    this.ship = new PlayerShip(this, 100, 100)
    this.windZone = new WindZone(this)
    this.pickRandomWindRedirection()
    this.castSpell = new MultiKey(this, getKey(Keys.ACTION))

    this.addRandomRunes()
  }

  pickRandomWindRedirection() {
    const direction = Phaser.Utils.Array.GetRandom(this.directions)
    this.windZone?.updateDirection(direction)
    this.ship?.setWindAngle(direction.angle)
  }

  addRandomRunes() {
    const cameraView = new Phaser.Geom.Rectangle(
      -this.cameras.main.width,
      -this.cameras.main.height,
      this.cameras.main.width * 3,
      this.cameras.main.height * 3
    )

    for (let i = 0; i < 40; i++) {
      const p = cameraView.getRandomPoint()
      this.add.sprite(p.x, p.y, "atlas", "Rune.png")
    }
  }

  update() {
    if (this.castSpell?.isDown() && this.canSpellcast) {
      this.pickRandomWindRedirection()
      this.canSpellcast = false
      this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.canSpellcast = true
        },
      })
    }
    this.ship?.update()
  }
}
