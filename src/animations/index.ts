// Animation configurations and state machines
// Animation definitions exported from this module

export interface AnimationFrame {
  sprite: string
  duration: number
}

export interface AnimationConfig {
  idle: AnimationFrame[]
  thinking: AnimationFrame[]
  happy: AnimationFrame[]
  listening: AnimationFrame[]
  sleeping: AnimationFrame[]
  walking: AnimationFrame[]
}

