import Phaser from "phaser"
import { Options, getOption } from "../data"

const playSound = (
  sound: Phaser.Sound.BaseSound,
  config?: Phaser.Types.Sound.SoundConfig
) => {
  const sfx = getOption(Options.SFX)
  if (sfx) {
    sound.play(config)
  }
}

export { playSound }
