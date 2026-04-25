import { LayerConfig } from "./layerConfig.type"

export type MakeupType =
  | 'lipstick'
  | 'eyeshadow'
  | 'blush'
  | 'eyeliner'
  | 'eyebrows'
  | 'foundation'

export type MakeupConfig = Partial<Record<MakeupType, LayerConfig>>