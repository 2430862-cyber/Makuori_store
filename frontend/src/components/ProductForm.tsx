
import { useState, type FormEvent } from 'react'

type ProductFormProps = {
  onAdd: (product: {
    name: string
    price: number
    description: string
  }) => void
}

function ProductForm({ onAdd }: ProductFormProps) {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name.trim() || !price || !description.trim()) {
      alert('Please fill in all fields')
      return
    }

    onAdd({
      name,
      price: Number(price),
      description,
    })

    setName('')
    setPrice('')
    setDescription('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Product</h2>

      <label>Product Name</label>
      <input
        type="text"
        placeholder="Enter product name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <label>Price (৳)</label>
      <input
        type="number"
        placeholder="Enter price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <label>Description</label>
      <textarea
        placeholder="Enter product description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit">Save Product</button>
    </form>
  )
}

export default ProductForm

