import Phaser from "phaser"

type KeyType = string | number | Phaser.Input.Keyboard.Key

export default class MultiKey {
  private keys: Phaser.Input.Keyboard.Key[] | null
  constructor(scene: Phaser.Scene, keys: KeyType[] | KeyType) {
    this.keys = null
    if (!Array.isArray(keys)) {
      keys = [keys]
    }
    const mappedKeys = keys
      .map((key) => scene.input.keyboard?.addKey(key))
      .filter((key) => key !== undefined)
    // Unsure why TS isn't narrowing the types based on the filter so casting
    this.keys = mappedKeys as Phaser.Input.Keyboard.Key[]
  }

  isDown() {
    return !!this.keys?.some((key) => key.isDown)
  }

  isUp() {
    return !!this.keys?.every((key) => key.isUp)
  }
}
