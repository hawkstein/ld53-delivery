import Phaser from "phaser"
import Scenes from "."
import PlayerShip from "../game/PlayerShip"
import WindZone from "../game/WindZone"
import MultiKey from "../utils/MultiKey"
import { Keys, getKey } from "../data"
import { GAME_BOUNDS_HEIGHT, GAME_BOUNDS_WIDTH } from "../constants"
import CastingCircle, { CircleEvent } from "../game/CastingCircle"
import StrengthMeter from "../game/StrengthMeter"

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
  private canInput: boolean = true
  private castingCircle?: CastingCircle
  private strengthMeter?: StrengthMeter

  constructor() {
    super(Scenes.GAME)
    this.directions = [
      { rotate: 90, speedX: 300, speedY: 0, angle: 0 }, //E
      { rotate: -45, speedX: 300, speedY: 300, angle: 45 }, //SE
      { rotate: 0, speedX: 0, speedY: 300, angle: 90 }, // S
      { rotate: 45, speedX: -300, speedY: 300, angle: 135 }, // SW
      { rotate: 90, speedX: -300, speedY: 0, angle: -180 }, // W
      { rotate: -45, speedX: -300, speedY: -300, angle: -135 }, //NW
      { rotate: 0, speedX: 0, speedY: -300, angle: -90 }, // N
      { rotate: 45, speedX: 300, speedY: -300, angle: -45 }, // NE
    ]
  }

  create() {
    this.ship = new PlayerShip(
      this,
      GAME_BOUNDS_WIDTH / 2,
      GAME_BOUNDS_HEIGHT / 2
    )
    this.windZone = new WindZone(this)
    this.pickRandomWindRedirection()
    this.castSpell = new MultiKey(this, getKey(Keys.ACTION))

    this.addRandomRunes()

    this.castingCircle = new CastingCircle(this)
    this.castingCircle.on(
      CircleEvent.CAST,
      ({ direction }: { direction: number }) => {
        this.setWindDirection(direction)
      }
    )
    this.strengthMeter = new StrengthMeter()

    this.cameras.main.setBounds(0, 0, GAME_BOUNDS_WIDTH, GAME_BOUNDS_HEIGHT)
    this.cameras.main.startFollow(this.ship.sprite, false, 0.5, 0.5)
  }

  pickRandomWindRedirection() {
    const direction = Phaser.Utils.Array.GetRandom(this.directions)
    this.windZone?.updateDirection(direction)
    this.ship?.setWindAngle(direction.angle)
  }

  setWindDirection(index: number) {
    const direction = this.directions[index]
    if (direction) {
      this.windZone?.updateDirection(direction)
      this.ship?.setWindAngle(direction.angle)
    }
  }

  addRandomRunes() {
    const cameraView = new Phaser.Geom.Rectangle(
      0,
      0,
      GAME_BOUNDS_WIDTH,
      GAME_BOUNDS_HEIGHT
    )

    for (let i = 0; i < 40; i++) {
      const p = cameraView.getRandomPoint()
      this.add.sprite(p.x, p.y, "atlas", "Rune.png")
    }
  }

  update() {
    if (this.castSpell?.isDown() && this.canInput) {
      this.canInput = false
      this.time.addEvent({
        delay: 200,
        callback: () => {
          this.canInput = true
        },
      })
      if (!this.castingCircle?.casting) {
        this.castingCircle?.startSpellcast()
      } else {
        this.castingCircle?.handleInput()
      }
    }
    this.ship?.update()
  }
}
