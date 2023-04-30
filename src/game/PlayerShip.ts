import Phaser from "phaser"
import MultiKey from "../utils/MultiKey"
// import isMaybeGreater from "../utils/isMaybeGreater"

const ANGULAR_DELTA = 0.02
const ACCELERATE_DELTA = 0.02
const BRAKE_DELTA = 0.01
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
    this.thrust = 0.02

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

    // const velocity = new Phaser.Math.Vector2(
    //   this.ship.getVelocity().x,
    //   this.ship.getVelocity().y
    // )

    if (decreaseSpeed && this.thrust > 0) {
      // this.thrust -= BRAKE_DELTA
      // if (this.thrust < 0) {
      //   this.thrust = 0
      // }
      this.thrust = 0
    } else if (increaseSpeed && this.thrust < 0.1) {
      //this.thrust += ACCELERATE_DELTA
      this.thrust = 0.02
    }
    //this.thrust = Math.max(0, (this.thrust -= BRAKE_DELTA))
    this.ship.thrust(this.thrust)
  }
}
