import Phaser from "phaser"
import config from "./config"
import Preload from "./scenes/Preload"
import Start from "./scenes/Start"
import Options from "./scenes/Options"
import Game from "./scenes/Game"
import End from "./scenes/End"
import Credits from "./scenes/Credits"

new Phaser.Game(
  Object.assign(config, {
    scene: [Preload, Start, Options, Game, End, Credits],
  })
)
