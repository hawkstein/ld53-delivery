import Phaser from "phaser"
import MultiKey from "../utils/MultiKey"

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
}
