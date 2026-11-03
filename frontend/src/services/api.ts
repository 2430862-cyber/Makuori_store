const API_URL = 'http://127.0.0.1:8000'

export async function getProducts() {
  const response = await fetch(`${API_URL}/products`)
  return response.json()
}

export async function addProduct(product: {
  name: string
  price: number
  description: string
}) {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  })

  return response.json()
}
export async function getProduct(id: number) {
  const response = await fetch(`${API_URL}/products/${id}`)
  return response.json()
}

export async function updateProduct(
  id: number,
  product: {
    name: string
    price: number
    description: string
  }
) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  })

  return response.json()
}

export async function deleteProduct(id: number) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
  })

  return response.json()
}