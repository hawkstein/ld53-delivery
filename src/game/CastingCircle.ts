// import Phaser from "phaser"
import { GameScene } from "../scenes/Game"

type CastingNode = {
  sprite: Phaser.GameObjects.Sprite
  offsetX: number
  offsetY: number
}

const SEGMENT_TIME = 200
const SPELL_DURATION = SEGMENT_TIME * 8 * 2

export const CircleEvent = {
  CAST: "CAST",
}

export default class CastingCircle extends Phaser.Events.EventEmitter {
  private scene: GameScene
  private circle: Phaser.GameObjects.Sprite
  public casting: boolean = false
  private stopping: boolean = false
  private nodes: CastingNode[] = []
  private direction: number = 0
  private spin: number = 1
  private selectionTimer?: Phaser.Time.TimerEvent
  private durationTimer?: Phaser.Time.TimerEvent

  constructor(scene: GameScene) {
    super()
    this.scene = scene
    this.scene.events.once("shutdown", this.destroy, this)
    this.scene.events.once("destroy", this.destroy, this)

    this.circle = this.scene.add.sprite(0, 0, "atlas", "CastingCircle.png")
    this.circle.alpha = 0

    const segment = (2 * Math.PI) / 8
    this.nodes = Array.from({ length: 8 }).map((_, index) => ({
      sprite: this.scene.add.sprite(0, 0, "atlas", "CastNorth.png"),
      offsetX: 80 * Math.cos(segment * index),
      offsetY: 80 * Math.sin(segment * index),
    }))
    this.hideNodes()
  }

  public startSpellcast() {
    if (!this.scene.ship || this.casting) {
      return
    }
    this.scene.events.on("update", this.update, this)
    this.stopping = false
    this.casting = true
    this.circle.alpha = 1
    this.circle.x = this.scene.ship.sprite.x
    this.circle.y = this.scene.ship.sprite.y
    this.positionNodes()
    this.showNodes()

    this.durationTimer = this.scene.time.addEvent({
      delay: SPELL_DURATION,
      callback: () => {
        this.stopSpellcast()
      },
    })
    this.direction = 0 //Phaser.Math.Between(0, this.nodes.length - 1)
    this.spin = Math.random() > 0.5 ? -1 : 1
    this.nodes[this.direction].sprite.setTexture("atlas", "CastNorthActive.png")
    this.selectionTimer = this.scene.time.addEvent({
      delay: SEGMENT_TIME,
      callback: () => {
        this.nodes[this.direction].sprite.setTexture("atlas", "CastNorth.png")
        this.direction += this.spin
        if (this.spin > 0 && this.direction >= this.nodes.length) {
          this.direction = 0
        } else if (this.spin < 0 && this.direction < 0) {
          this.direction = this.nodes.length - 1
        }
        this.nodes[this.direction].sprite.setTexture(
          "atlas",
          "CastNorthActive.png"
        )
      },
      repeat: -1,
    })
  }

  public handleInput() {
    this.stopSpellcast()
  }

  private positionNodes() {
    this.nodes.forEach((node) => {
      if (!this.scene.ship || !this.casting) {
        return
      }
      node.sprite.x = this.scene.ship.sprite.x + node.offsetX
      node.sprite.y = this.scene.ship.sprite.y + node.offsetY
    })
  }

  private showNodes() {
    this.nodes.forEach((node) => {
      if (!this.scene.ship) {
        return
      }
      node.sprite.setTexture("atlas", "CastNorth.png")
      node.sprite.alpha = 1
    })
  }

  private hideNodes() {
    this.nodes.forEach((node) => {
      if (!this.scene.ship) {
        return
      }
      node.sprite.alpha = 0
    })
  }

  private stopSpellcast() {
    if (!this.casting || this.stopping) {
      return
    }
    this.stopping = true
    this.casting = false
    this.circle.alpha = 0
    this.hideNodes()
    this.durationTimer?.remove()
    this.selectionTimer?.remove()
    this.emit(CircleEvent.CAST, { direction: this.direction })
    this.scene.events.off("update", this.update, this)
  }

  private update() {
    if (!this.scene.ship || !this.casting) {
      return
    }
    this.circle.x = this.scene.ship.sprite.x
    this.circle.y = this.scene.ship.sprite.y
    this.positionNodes()
  }

  public destroy() {
    this.scene.events.off("update", this.update, this)
    this.scene.events.off("shutdown", this.destroy, this)
    this.scene.events.off("destroy", this.destroy, this)
    this.durationTimer?.destroy()
    this.selectionTimer?.destroy()
    super.destroy()
  }
}
