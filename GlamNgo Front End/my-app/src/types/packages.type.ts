export type Package = Packages2[]

export interface Packages2 {
  id: number
  name: string
  price: number
  description: string
  duration: number
  tier?: string
  items: string[]
}
