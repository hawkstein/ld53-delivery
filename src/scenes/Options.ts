import Phaser from "phaser"
import Scenes from "."
import { MenuButton } from "../ui/MenuButton"

type BindingMap = {
  moveUp: KeyBinding
  moveDown: KeyBinding
  moveLeft: KeyBinding
  moveRight: KeyBinding
}

type KeyBinding = {
  label: string
  keyCodes: number[]
}

function mapKeyCodesToLabel(code: number) {
  const label = Object.entries(Phaser.Input.Keyboard.KeyCodes).find(
    ([_, keyCode]) => keyCode === code
  )?.[0]
  if (!label) {
    return "NO KEY FOUND"
  }
  return `${label} KEY`
}

export default class Options extends Phaser.Scene {
  private keyBindings: BindingMap

  constructor() {
    super(Scenes.OPTIONS)

    this.keyBindings = {
      moveUp: {
        label: "Up",
        keyCodes: [
          Phaser.Input.Keyboard.KeyCodes.UP,
          Phaser.Input.Keyboard.KeyCodes.W,
        ],
      },
      moveDown: {
        label: "Down",
        keyCodes: [
          Phaser.Input.Keyboard.KeyCodes.DOWN,
          Phaser.Input.Keyboard.KeyCodes.S,
        ],
      },
      moveLeft: {
        label: "Left",
        keyCodes: [
          Phaser.Input.Keyboard.KeyCodes.LEFT,
          Phaser.Input.Keyboard.KeyCodes.A,
        ],
      },
      moveRight: {
        label: "Right",
        keyCodes: [
          Phaser.Input.Keyboard.KeyCodes.RIGHT,
          Phaser.Input.Keyboard.KeyCodes.D,
        ],
      },
    }
  }

  create() {
    const message = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 120,
      "Currently unimplemented.",
      { color: "#fff", fontSize: "24px", fontFamily: "KenneyMiniSquare" }
    )
    message.x -= message.width / 2
    message.y -= message.height / 2

    new MenuButton({
      scene: this,
      label: "Back to the menu",
      onClick: () => {
        this.scene.start(Scenes.START)
      },
      x: this.cameras.main.centerX,
      y: 360,
    })

    let optionLabelY = 150
    Object.values(this.keyBindings).forEach((binding) => {
      const optionLabel = this.add.text(
        this.cameras.main.centerX,
        optionLabelY,
        `${binding.label}: ${binding.keyCodes
          .map(mapKeyCodesToLabel)
          .join(", ")}`,
        { color: "#fff", fontSize: "24px" }
      )
      optionLabel.x -= optionLabel.width / 2
      optionLabel.y -= optionLabel.height / 2
      optionLabelY += 50
    })
  }
}
