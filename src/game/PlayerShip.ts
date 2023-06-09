import Phaser from "phaser"
import MultiKey from "../utils/MultiKey"
import { Keys, getKey } from "../data"
import { GAME_BOUNDS_HEIGHT, GAME_BOUNDS_WIDTH } from "../constants"

const ANGULAR_DELTA_MOVING = 0.02
const ANGULAR_DELTA_STOPPED = 0.005
const THRUST = 0.02
export default class PlayerShip {
  public sprite: Phaser.Physics.Matter.Sprite
  private thrust: number
  private angularDelta: number
  private steerLeft: MultiKey
  private steerRight: MultiKey
  private increaseThrust: MultiKey
  private stopThrust: MultiKey
  private windAngle: number = 0
  private resettingPosition: boolean = false

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.matter.add.sprite(x, y, "atlas", "PlayerShip.png")
    this.sprite.setFrictionAir(0.05)
    this.sprite.setMass(100)
    this.sprite.setFixedRotation()
    this.thrust = THRUST
    this.angularDelta = ANGULAR_DELTA_MOVING

    this.steerLeft = new MultiKey(scene, getKey(Keys.LEFT))
    this.steerRight = new MultiKey(scene, getKey(Keys.RIGHT))
    this.increaseThrust = new MultiKey(scene, getKey(Keys.UP))
    this.stopThrust = new MultiKey(scene, getKey(Keys.DOWN))
  }

  update() {
    if (
      !this.resettingPosition &&
      (this.sprite.x < 0 ||
        this.sprite.x > GAME_BOUNDS_WIDTH ||
        this.sprite.y < 0 ||
        this.sprite.y > GAME_BOUNDS_HEIGHT)
    ) {
      this.resetPosition()
    }
    // Intention with angularDelta is to be closer to boat movement
    // i.e. forward movement means you can turn
    // However, not being able to move at all when stopped would be boring
    if (this.stopThrust.isDown()) {
      this.thrust = 0
      this.angularDelta = ANGULAR_DELTA_STOPPED
    } else if (this.increaseThrust.isDown()) {
      this.thrust = THRUST
      this.angularDelta = ANGULAR_DELTA_MOVING
    }

    if (this.steerRight.isDown()) {
      this.sprite.setAngularVelocity(this.angularDelta)
    } else if (this.steerLeft.isDown()) {
      this.sprite.setAngularVelocity(-this.angularDelta)
    }

    // The idea here is that the player can apply more thrust when
    // they have the wind behind them and less when facing into it
    // I have very little concept of how accurate this is in reality!
    const difference = Math.abs(
      Phaser.Math.Angle.ShortestBetween(this.sprite.angle, this.windAngle)
    )
    const adjustedThrust =
      this.thrust + this.thrust * (Math.floor(180 - difference) / 180)
    this.sprite.thrust(adjustedThrust)

    // Finally apply the force from the wind
    const radians = Phaser.Math.DegToRad(this.windAngle)
    const windSpeed = THRUST / 2
    const force = new Phaser.Math.Vector2({
      x: Math.cos(radians) * windSpeed,
      y: Math.sin(radians) * windSpeed,
    })
    this.sprite.applyForce(force)
  }

  setWindAngle(angle: number) {
    this.windAngle = angle
  }

  resetPosition() {
    this.resettingPosition = true
    this.thrust = 0
    this.angularDelta = ANGULAR_DELTA_STOPPED
    this.sprite.alpha = 0
    this.sprite.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.resettingPosition = false
        this.sprite.alpha = 1
        this.sprite.x = GAME_BOUNDS_WIDTH / 2
        this.sprite.y = GAME_BOUNDS_HEIGHT / 2
      },
    })
  }
}
