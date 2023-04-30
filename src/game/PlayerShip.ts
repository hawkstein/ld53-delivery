import Phaser from "phaser"
import MultiKey from "../utils/MultiKey"

const ANGULAR_DELTA = 0.02
const THRUST = 0.02
export default class PlayerShip {
  private ship: Phaser.Physics.Matter.Sprite
  private thrust: number
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

    const { LEFT, RIGHT, UP, DOWN, A, S, D, W } = Phaser.Input.Keyboard.KeyCodes

    this.leftInput = new MultiKey(scene, [LEFT, A])
    this.rightInput = new MultiKey(scene, [RIGHT, D])
    this.accelerateInput = new MultiKey(scene, [UP, W])
    this.brakeInput = new MultiKey(scene, [DOWN, S])
  }

  update() {
    const rotateRight = this.rightInput.isDown()
    const rotateLeft = this.leftInput.isDown()
    const increaseSpeed = this.accelerateInput.isDown()
    const decreaseSpeed = this.brakeInput.isDown()

    if (rotateRight) {
      this.ship.setAngularVelocity(ANGULAR_DELTA)
    } else if (rotateLeft) {
      this.ship.setAngularVelocity(-ANGULAR_DELTA)
    }

    if (decreaseSpeed) {
      this.thrust = 0
    } else if (increaseSpeed) {
      this.thrust = THRUST
    }
    this.ship.thrust(this.thrust)
  }
}
