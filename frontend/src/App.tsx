
import { useEffect, useState, type FormEvent } from 'react'

import ProductForm from './components/ProductForm'
import Login from './components/Login'
import Register from './components/Register'

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

type User = {
  id: number
  name: string
  email: string
  role: string
}

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [showRegister, setShowRegister] = useState(false)

  // LOGIN
  function handleLogin(accessToken: string, loggedInUser: User) {
    setToken(accessToken)
    setUser(loggedInUser)
    setShowRegister(false)
  }

  // LOGOUT
  function handleLogout() {
    setToken(null)
    setUser(null)
    setEditingProduct(null)
    setShowRegister(false)
  }

  // LOAD PRODUCTS
  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await getProducts()
        setProducts(data)
      } catch {
        console.error('Could not load products')
      }
    }

    loadProducts()
  }, [])

  // ADD PRODUCT
  async function addProduct(product: Omit<Product, 'id'>) {
    if (!token || user?.role !== 'admin') {
      alert('Admin login required.')
      return
    }

    try {
      const newProduct = await createProduct(product, token)
      setProducts((current) => [...current, newProduct])
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Could not add product')
    }
  }

  // UPDATE PRODUCT
  async function updateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!editingProduct || !token || user?.role !== 'admin') {
      alert('Admin login required.')
      return
    }

    try {
      const updatedProduct = await saveProduct(
        editingProduct.id,
        {
          name: editingProduct.name,
          price: editingProduct.price,
          description: editingProduct.description,
        },
        token
      )

      setProducts((current) =>
        current.map((product) =>
          product.id === editingProduct.id ? updatedProduct : product
        )
      )

      setEditingProduct(null)
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Could not update product')
    }
  }

  // DELETE PRODUCT
  async function deleteProduct(id: number) {
    if (!token || user?.role !== 'admin') {
      alert('Admin login required.')
      return
    }

    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      await removeProduct(id, token)

      setProducts((current) =>
        current.filter((product) => product.id !== id)
      )
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Could not delete product')
    }
  }

  return (
    <div className="store">

      {/* HEADER */}
      <header className="site-header">
        <div className="header-inner">
          <a href="#" className="brand-logo">MAKUORI</a>

          <nav className="main-navigation">
            <a href="#">Home</a>
            <a href="#products">Collection</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </nav>

          <a href="#products" className="header-shop-button">
            Shop Now
          </a>
        </div>
      </header>

      <main>

        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-content">
            <p className="eyebrow">
              THOUGHTFULLY MADE · BEAUTIFULLY YOURS
            </p>

            <h2>Welcome to Makuori</h2>

            <p>
              Discover handmade macrame creations and beautiful hijabs,
              thoughtfully made to bring a little beauty into everyday life.
            </p>

            <a href="#products" className="explore-button">
              Explore Collection →
            </a>
          </div>

          <div className="hero-image">
            <img
              src="/images/makuori-hero.png"
              alt="Beige macrame bag and elegant hijabs from Makuori"
            />
          </div>
        </section>

        {/* LOGIN AND REGISTRATION */}
        <section className="content-section">
          {user ? (
            <div className="section-heading">
              <p className="eyebrow">WELCOME, {user.name}</p>

              <h2>
                {user.role === 'admin'
                  ? 'Admin Dashboard'
                  : 'Customer Account'}
              </h2>

              <button onClick={handleLogout} className="cancel-button">
                Logout
              </button>
            </div>
          ) : (
            <div className="form-card">
              {showRegister ? (
                <Register
                  onSwitchToLogin={() => setShowRegister(false)}
                />
              ) : (
                <Login
                  onLogin={handleLogin}
                  onSwitchToRegister={() => setShowRegister(true)}
                />
              )}
            </div>
          )}
        </section>

        {/* ADMIN PRODUCT FORM */}
        {user?.role === 'admin' && (
          <section className="content-section">
            <div className="section-heading">
              <p className="eyebrow">YOUR LITTLE COLLECTION</p>
              <h2>Add a New Creation</h2>
            </div>

            <div className="form-card">
              <ProductForm onAdd={addProduct} />
            </div>
          </section>
        )}

        {/* PRODUCT COLLECTION */}
        <section className="content-section" id="products">
          <div className="section-heading">
            <p className="eyebrow">MADE WITH CARE</p>
            <h2>Our Collection</h2>
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <p>Your collection is waiting.</p>
              <span>New creations will appear here.</span>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-number">
                    MAKUORI · {product.id}
                  </div>

                  <h3>{product.name}</h3>

                  <p className="product-price">
                    ৳{product.price}
                  </p>

                  <p className="product-description">
                    {product.description}
                  </p>

                  {user?.role === 'admin' && (
                    <div className="product-actions">
                      <button
                        className="edit-button"
                        onClick={() => setEditingProduct(product)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-button"
                        onClick={() => deleteProduct(product.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        {/* EDIT PRODUCT */}
        {editingProduct && user?.role === 'admin' && (
          <section className="content-section">
            <div className="form-card">
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

                <div className="form-actions">
                  <button type="submit" className="primary-button">
                    Update Product
                  </button>

                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setEditingProduct(null)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <h2>MAKUORI</h2>
        <p>Handmade with love, made to be cherished.</p>
        <span>© 2026 Makuori Store</span>
      </footer>

    </div>
  )
}

export default App
