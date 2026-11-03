
import { useEffect, useState, type FormEvent } from 'react'
import ProductForm from './components/ProductForm'
import {
  getProducts,
  addProduct as createProduct,
  updateProduct as saveProduct,
  deleteProduct as removeProduct,
} from './services/api'

type Product = {
  id: number
  name: string
  price: number
  description: string
}

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Read all products from FastAPI
  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts()
      setProducts(data)
    }

    loadProducts()
  }, [])

  // Create product
  async function addProduct(product: Omit<Product, 'id'>) {
    const newProduct = await createProduct(product)
    setProducts([...products, newProduct])
  }

  // Update product
  async function updateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!editingProduct) return

    const updatedProduct = await saveProduct(
      editingProduct.id,
      {
        name: editingProduct.name,
        price: editingProduct.price,
        description: editingProduct.description,
      }
    )

    setProducts(
      products.map((product) =>
        product.id === editingProduct.id ? updatedProduct : product
      )
    )

    setEditingProduct(null)
  }

  // Delete product
  async function deleteProduct(id: number) {
    await removeProduct(id)
    setProducts(products.filter((product) => product.id !== id))
  }

  return (
    <div>
      <header>
        <h1>MAKUORI</h1>
        <p>Handmade with love</p>
      </header>

      <main>
        <h2>Welcome to Makuori Store</h2>
        <p>Discover handmade macrame products and beautiful hijabs.</p>

        <ProductForm onAdd={addProduct} />

        <h2>Product List</h2>

        {products.length === 0 ? (
          <p>No products added yet.</p>
        ) : (
          products.map((product) => (
            <div key={product.id}>
              <details>
                <summary>{product.name}</summary>
                <p>Price: ৳{product.price}</p>
                <p>{product.description}</p>
              </details>

              <button onClick={() => setEditingProduct(product)}>
                Edit
              </button>

              <button onClick={() => deleteProduct(product.id)}>
                Delete
              </button>
            </div>
          ))
        )}

        {editingProduct && (
          <form onSubmit={updateProduct}>
            <h2>Edit Product</h2>

            <label>Product Name</label>
            <input
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  name: e.target.value,
                })
              }
              required
            />

            <label>Price (৳)</label>
            <input
              type="number"
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  price: Number(e.target.value),
                })
              }
              required
            />

            <label>Description</label>
            <textarea
              value={editingProduct.description}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  description: e.target.value,
                })
              }
              required
            />

            <button type="submit">Update Product</button>

            <button
              type="button"
              onClick={() => setEditingProduct(null)}
            >
              Cancel
            </button>
          </form>
        )}
      </main>
    </div>
  )
}

export default App
