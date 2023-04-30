const isMaybeGreater = (value: number | undefined, check: number) =>
  !!value && value > check

export default isMaybeGreater
