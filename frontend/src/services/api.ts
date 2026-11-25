
const API_URL = 'https://makuori-store.onrender.com'

// Admin login
export async function login(email: string, password: string) {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.detail || 'Login failed')
  }

  return data
}

// Get all products (public access)
export async function getProducts() {
  const response = await fetch(`${API_URL}/products`)

  if (!response.ok) {
    throw new Error('Could not load products')
  }

  return response.json()
}

// Get one product (public access)
export async function getProduct(id: number) {
  const response = await fetch(`${API_URL}/products/${id}`)

  if (!response.ok) {
    throw new Error('Could not find product')
  }

  return response.json()
}

// Add product (admin only)
export async function addProduct(
  product: {
    name: string
    price: number
    description: string
  },
  token: string
) {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || 'Could not add product')
  }

  return response.json()
}

// Update product (admin only)
export async function updateProduct(
  id: number,
  product: {
    name: string
    price: number
    description: string
  },
  token: string
) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(product),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || 'Could not update product')
  }

  return response.json()
}

// Delete product (admin only)
export async function deleteProduct(id: number, token: string) {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || 'Could not delete product')
  }

  return response.json()
}
