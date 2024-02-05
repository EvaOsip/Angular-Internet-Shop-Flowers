export type ProductType = {
  id: string,
  name: string,
  price: string,
  image: string,
  lightning: string,
  humidity: string,
  temperature: string,
  height: string,
  diameter: string,
  url: string,
  type: {
    id: string,
    name: string,
    url: string
  },
  countInCart?: number,
  isInFavorite?: boolean
}
