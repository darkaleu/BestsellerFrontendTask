import data from '../../data.json'

export interface Product {
    id: number
    brand: string
    price: number
    stock: number | string
    name: {
      en?: string
      dk?: string
    }
    images: string[]
    categories: string[]
  }

  export async function fetchProducts(): Promise<Product[]> {
    // Keep this asynchronous to mirror a future API request.
    await Promise.resolve()

    return data.products as Product[]
  }