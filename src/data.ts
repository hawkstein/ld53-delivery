import localforage from "localforage"

const FORAGE_KEY = "ld-53-untitled-game"
const STORE_KEY = "store"
const KEYS_KEY = "keys"
const OPTIONS_KEY = "options"

export const Options = {
  SFX: "sfx",
  BG_MUSIC: "bgMusic",
} as const

export type Options = (typeof Options)[keyof typeof Options]

export const Keys = {
  LEFT: "left",
  RIGHT: "right",
  UP: "right",
  DOWN: "down",
} as const

export type Keys = (typeof Keys)[keyof typeof Keys]

type GameData = {
  keys: Map<Keys, string | string[]>
  options: Map<Options, boolean | number | string>
}

const store: GameData = {
  keys: new Map<Keys, string | string[]>(),
  options: new Map<Options, boolean | number | string>(),
}

async function saveGameData() {
  localforage.config({
    name: FORAGE_KEY,
    storeName: STORE_KEY,
  })
  await localforage.setItem(KEYS_KEY, store.keys)
  await localforage.setItem(OPTIONS_KEY, store.options)
}

async function loadGameData() {
  localforage.config({
    name: FORAGE_KEY,
    storeName: STORE_KEY,
  })
  store.keys = (await localforage.getItem(KEYS_KEY)) || store.keys
  store.options = (await localforage.getItem(OPTIONS_KEY)) || store.options
}

function getKey(key: Keys) {
  return store.keys.get(key)
}

function setKey(key: Keys, value: string | string[]) {
  store.keys.set(key, value)
}

function getOption(option: Options) {
  return store.options.get(option)
}

function setOption(option: Options, value: boolean | number | string) {
  store.options.set(option, value)
}

export { saveGameData, loadGameData, getKey, setKey, getOption, setOption }
