import Phaser from "phaser"
import type { WindDirection } from "../scenes/Game"

export default class WindZone {
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter | undefined

  private scene: Phaser.Scene
  private playerShip: Phaser.Physics.Matter.Sprite
  constructor(scene: Phaser.Scene, playerShip: Phaser.Physics.Matter.Sprite) {
    this.scene = scene
    this.playerShip = playerShip
  }

  updateDirection({ rotate, speedX, speedY }: WindDirection) {
    this.emitter?.destroy()
    this.emitter = this.scene.add.particles(0, 0, "atlas", {
      frame: "WindParticle.png",
      emitZone: {
        source: new Phaser.Geom.Rectangle(
          0,
          0,
          this.scene.cameras.main.width,
          this.scene.cameras.main.height
        ),
        type: "random",
        quantity: 1,
      },
      frequency: 400,
      lifespan: 800,
      alpha: { start: 1, end: 0 },
      rotate,
      speedX,
      speedY,
      follow: this.playerShip,
      followOffset: {
        x: -this.scene.cameras.main.width * 0.5,
        y: -this.scene.cameras.main.height * 0.5,
      },
    })
  }
}
