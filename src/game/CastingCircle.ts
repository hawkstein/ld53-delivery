// import Phaser from "phaser"
import { GameScene } from "../scenes/Game"

type CastingNode = {
  sprite: Phaser.GameObjects.Sprite
  offsetX: number
  offsetY: number
}

const SEGMENT_TIME = 200
const SPELL_DURATION = SEGMENT_TIME * 8 * 2

export default class CastingCircle {
  private scene: GameScene
  private circle: Phaser.GameObjects.Sprite
  private casting: boolean = false
  private nodes: CastingNode[] = []
  private direction: number = 0
  private spin: number = 1
  private selectionTimer?: Phaser.Time.TimerEvent

  constructor(scene: GameScene) {
    this.scene = scene
    this.scene.events.on("update", this.update, this)
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
    this.casting = true
    this.circle.alpha = 1
    this.circle.x = this.scene.ship.sprite.x
    this.circle.y = this.scene.ship.sprite.y
    this.positionNodes()
    this.showNodes()

    this.scene.time.addEvent({
      delay: SPELL_DURATION,
      callback: () => {
        this.stopSpellcast()
      },
    })
    this.direction = Phaser.Math.Between(0, this.nodes.length - 1)
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
    if (!this.casting) {
      return
    }
    this.casting = false
    this.circle.alpha = 0
    this.hideNodes()
    this.selectionTimer?.remove()
  }

  private update() {
    if (!this.scene.ship || !this.casting) {
      return
    }
    this.circle.x = this.scene.ship.sprite.x
    this.circle.y = this.scene.ship.sprite.y
    this.positionNodes()
  }

  private destroy() {
    this.scene.events.off("update", this.update, this)
    this.scene.events.off("shutdown", this.destroy, this)
    this.scene.events.off("destroy", this.destroy, this)
    this.selectionTimer?.destroy()
  }
}
