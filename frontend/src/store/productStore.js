import { create } from 'zustand'

// Safely parse JSON — returns null if response is HTML (proxy miss / server error page)
async function safeJson(res) {
  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error(
      `Server returned ${res.status} (${res.statusText}). ` +
      `Make sure your Express server is running on port 5000.`
    )
  }
  return res.json()
}

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null })
    try {
      const res = await fetch('/api/products')
      const data = await safeJson(res)
      set({ products: data.data || data, loading: false })
    } catch (err) {
      set({ error: err.message || 'Failed to fetch products', loading: false })
    }
  },

  createProduct: async (productData) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })
      const data = await safeJson(res)
      if (!res.ok) throw new Error(data.message || 'Failed to create product')
      set((state) => ({ products: [...state.products, data.data || data] }))
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      })
      const data = await safeJson(res)
      if (!res.ok) throw new Error(data.message || 'Failed to update product')
      // Backend uses returnDocument:"after" (Mongoose needs `new:true`) so
      // data.data may be the PRE-update doc — merge locally to be safe.
      set((state) => ({
        products: state.products.map((p) =>
          p._id === id ? { ...p, ...productData, _id: id } : p
        ),
      }))
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    }
  },

  deleteProduct: async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      const data = await safeJson(res)
      if (!res.ok) throw new Error(data.message || 'Failed to delete product')
      set((state) => ({
        products: state.products.filter((p) => p._id !== id),
      }))
      return { success: true }
    } catch (err) {
      return { success: false, message: err.message }
    }
  },
}))