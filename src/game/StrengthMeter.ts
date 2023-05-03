import Phaser from "phaser"
import { GameScene } from "../scenes/Game"

export const MeterEvent = {
  SELECTION: "SELECTION",
}
export default class StrengthMeter extends Phaser.Events.EventEmitter {
  private scene: GameScene
  private followTarget?: Phaser.GameObjects.Sprite
  private meter: Phaser.GameObjects.Sprite
  private mark: Phaser.GameObjects.Sprite
  public selecting: boolean = false
  private durationTimer?: Phaser.Time.TimerEvent
  public markPos: number = 0
  private markTween?: Phaser.Tweens.Tween
  constructor(scene: GameScene) {
    super()
    this.scene = scene
    this.scene.events.once("shutdown", this.destroy, this)
    this.scene.events.once("destroy", this.destroy, this)

    this.meter = this.scene.add.sprite(0, 0, "atlas", "MeterBackground.png")
    this.meter.alpha = 0
    this.mark = this.scene.add.sprite(0, 0, "atlas", "MeterMark.png")
    this.mark.alpha = 0
  }

  public setFollowTarget(target: Phaser.GameObjects.Sprite) {
    this.followTarget = target
  }

  public start() {
    this.meter.alpha = 1
    this.mark.alpha = 1
    this.scene.events.on("update", this.update, this)
    this.selecting = true
    this.durationTimer = this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        this.stop()
      },
    })
    this.markTween = this.scene.tweens.add({
      targets: this,
      markPos: [0, 100],
      duration: 1000,
      ease: "Sine.inOut",
      yoyo: true,
      repeat: -1,
    })
  }

  public stop() {
    this.selecting = false
    this.meter.alpha = 0
    this.mark.alpha = 0
    this.durationTimer?.remove()
    this.emit(MeterEvent.SELECTION, this.markPos)
    this.scene.events.off("update", this.update, this)
    if (this.markTween) {
      this.scene.tweens.remove(this.markTween)
    }
  }

  // public handleInput() {
  //   this.stop()
  // }

  private update() {
    if (this.followTarget) {
      this.meter.x = this.followTarget.x - 50
      this.meter.y = this.followTarget.y
      this.mark.x = this.followTarget.x - 50
      this.mark.y = this.followTarget.y - 50 + this.markPos
    }
  }

  public destroy() {
    this.scene.events.off("update", this.update, this)
    this.scene.events.off("shutdown", this.destroy, this)
    this.scene.events.off("destroy", this.destroy, this)
    this.durationTimer?.destroy()
    this.markTween?.destroy()
    super.destroy()
  }
}
