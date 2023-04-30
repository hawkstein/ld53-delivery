import Phaser from "phaser"
import MultiKey from "../utils/MultiKey"
import isMaybeGreater from "../utils/isMaybeGreater"

export default class PlayerShip {
  private sprite: Phaser.Physics.Matter.Sprite
  private leftInput: MultiKey
  private rightInput: MultiKey
  private accelerateInput: MultiKey
  private brakeInput: MultiKey

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.sprite = scene.matter.add.sprite(0, 0, "atlas", "PlayerShip.png")

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

    //const moveForce = isOnGround ? 0.005 : 0.0025;
    //sprite.applyForce(new Phaser.Math.Vector2(-moveForce, 0));
    this.sprite.setFlipX(isMaybeGreater(this.sprite.body?.velocity?.x, 0))
  }
}
