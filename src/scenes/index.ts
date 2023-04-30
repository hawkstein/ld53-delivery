const Scenes = {
  PRELOAD: "PRELOAD",
  START: "START",
  OPTIONS: "OPTIONS",
  CREDITS: "CREDITS",
  GAME: "GAME",
  HUD: "HUD",
  END: "END",
} as const

export type Scenes = (typeof Scenes)[keyof typeof Scenes]

export default Scenes
