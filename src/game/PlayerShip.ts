import Phaser from "phaser"
import MultiKey from "../utils/MultiKey"
import { Keys, getKey } from "../data"

const ANGULAR_DELTA_MOVING = 0.02
const ANGULAR_DELTA_STOPPED = 0.005
const THRUST = 0.02
export default class PlayerShip {
  private ship: Phaser.Physics.Matter.Sprite
  private thrust: number
  private angularDelta: number
  private leftInput: MultiKey
  private rightInput: MultiKey
  private accelerateInput: MultiKey
  private brakeInput: MultiKey

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.ship = scene.matter.add.sprite(x, y, "atlas", "PlayerShip.png")
    this.ship.setFrictionAir(0.05)
    this.ship.setMass(100)
    this.ship.setFixedRotation()
    this.thrust = THRUST
    this.angularDelta = ANGULAR_DELTA_MOVING

    const leftKeys = getKey(Keys.LEFT)
    const rightKeys = getKey(Keys.RIGHT)
    const upKeys = getKey(Keys.UP)
    const downKeys = getKey(Keys.DOWN)

    console.log({ rightKeys, upKeys })

    this.leftInput = new MultiKey(scene, leftKeys)
    this.rightInput = new MultiKey(scene, rightKeys)
    this.accelerateInput = new MultiKey(scene, upKeys)
    this.brakeInput = new MultiKey(scene, downKeys)
  }

  update() {
    const rotateRight = this.rightInput.isDown()
    const rotateLeft = this.leftInput.isDown()
    const increaseSpeed = this.accelerateInput.isDown()
    const decreaseSpeed = this.brakeInput.isDown()

    if (rotateRight) {
      this.ship.setAngularVelocity(this.angularDelta)
    } else if (rotateLeft) {
      this.ship.setAngularVelocity(-this.angularDelta)
    }

    if (decreaseSpeed) {
      this.thrust = 0
      this.angularDelta = ANGULAR_DELTA_STOPPED
    } else if (increaseSpeed) {
      this.thrust = THRUST
      this.angularDelta = ANGULAR_DELTA_MOVING
    }
    this.ship.thrust(this.thrust)
  }
}
