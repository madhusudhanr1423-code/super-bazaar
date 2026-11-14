import { useEffect, useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { supabase } from '../lib/supabase'
import { useIsAdmin } from '../lib/useIsAdmin'

export const Route = createFileRoute('/admin-products')({
  component: AdminProductsPage,
})

type Category = { id: string; name: string }

type Product = {
  id: string
  name: string
  slug: string
  category_id: string | null
  description: string | null
  price: number
  mrp: number | null
  stock: number
  image_url: string | null
  badge: string | null
}

type FormState = {
  name: string
  slug: string
  category_id: string
  description: string
  price: string
  mrp: string
  stock: string
  image_url: string
  badge: string
}

const EMPTY_FORM: FormState = {
  name: '',
  slug: '',
  category_id: '',
  description: '',
  price: '',
  mrp: '',
  stock: '0',
  image_url: '',
  badge: '',
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function AdminProductsPage() {
  const isAdmin = useIsAdmin()

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const inputClass =
    'w-full rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#16803C] focus:ring-2 focus:ring-[#16803C]/10'
  const labelClass =
    'mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#374151]'

  async function loadData() {
    const [productsRes, categoriesRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('categories').select('id, name').order('name'),
    ])

    if (productsRes.error) setError(productsRes.error.message)
    else setProducts((productsRes.data ?? []) as Product[])

    if (categoriesRes.error) setError(categoriesRes.error.message)
    else setCategories((categoriesRes.data ?? []) as Category[])
  }

  useEffect(() => {
    if (isAdmin) loadData()
  }, [isAdmin])

  function setField(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function startEdit(product: Product) {
    setEditingId(product.id)
    setForm({
      name: product.name,
      slug: product.slug,
      category_id: product.category_id ?? '',
      description: product.description ?? '',
      price: String(product.price),
      mrp: product.mrp === null ? '' : String(product.mrp),
      stock: String(product.stock),
      image_url: product.image_url ?? '',
      badge: product.badge ?? '',
    })
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setEditingId(null)
    setForm(EMPTY_FORM)
    setError('')
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target
    const file = input.files?.[0]
    if (!file) return

    setError('')

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file.')
      input.value = ''
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5 MB.')
      input.value = ''
      return
    }

    setUploading(true)

    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `${crypto.randomUUID()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(path, file, { cacheControl: '31536000', upsert: false })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      input.value = ''
      return
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    setField('image_url', data.publicUrl)
    setUploading(false)
    input.value = ''
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (!form.name.trim() || form.price === '') {
      setError('Name and price are required.')
      return
    }

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim() || slugify(form.name),
      category_id: form.category_id || null,
      description: form.description.trim() || null,
      price: Number(form.price),
      mrp: form.mrp === '' ? null : Number(form.mrp),
      stock: Number(form.stock || 0),
      image_url: form.image_url.trim() || null,
      badge: form.badge.trim() || null,
    }

    setSaving(true)

    const { error: saveError } = editingId
      ? await supabase
          .from('products')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', editingId)
      : await supabase.from('products').insert(payload)

    setSaving(false)

    if (saveError) {
      setError(saveError.message)
      return
    }

    resetForm()
    loadData()
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`Delete "${product.name}"?`)) return

    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id)

    if (deleteError) {
      setError(deleteError.message)
      return
    }

    loadData()
  }

  if (isAdmin === null) {
    return (
      <main className="min-h-screen bg-white text-[#171717]">
        <p className="py-20 text-center text-sm text-[#374151]">Loading...</p>
      </main>
    )
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-white text-[#171717]">
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-black">Not allowed</h1>
          <p className="mt-2 text-sm text-[#374151]">
            Sign in with an admin account to manage products.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block rounded-xl bg-[#16803C] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0F5C2E]"
          >
            Sign In
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white text-[#171717]">
      <section className="border-b border-[#E5E7EB] bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#16803C]">
            Admin
          </span>
          <h1 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">
            Products
          </h1>
          <Link
            to="/admin"
            className="mt-3 inline-block text-sm font-semibold text-[#16803C] hover:text-[#0F5C2E]"
          >
            View orders →
          </Link>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="h-fit space-y-4 rounded-2xl border border-[#E5E7EB] bg-white p-6 lg:sticky lg:top-24"
          >
            <h2 className="text-lg font-black">
              {editingId ? 'Edit product' : 'Add product'}
            </h2>

            <div>
              <label className={labelClass}>Name</label>
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => setField('name', e.target.value)}
              />
            </div>

            <div>
              <label className={labelClass}>Slug (optional)</label>
              <input
                className={inputClass}
                value={form.slug}
                onChange={(e) => setField('slug', e.target.value)}
                placeholder="auto-made from name"
              />
            </div>

            <div>
              <label className={labelClass}>Category</label>
              <select
                className={inputClass}
                value={form.category_id}
                onChange={(e) => setField('category_id', e.target.value)}
              >
                <option value="">No category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Price</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  value={form.price}
                  onChange={(e) => setField('price', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>MRP</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={inputClass}
                  value={form.mrp}
                  onChange={(e) => setField('mrp', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Stock</label>
                <input
                  type="number"
                  min="0"
                  className={inputClass}
                  value={form.stock}
                  onChange={(e) => setField('stock', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Product image</label>

              {form.image_url && (
                <div className="mb-3 h-32 w-32 overflow-hidden rounded-xl border border-[#E5E7EB] bg-gray-50">
                  <img
                    src={form.image_url}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFile}
                disabled={uploading}
                className="block w-full text-sm text-[#374151] file:mr-3 file:cursor-pointer file:rounded-xl file:border-0 file:bg-[#EAF7EF] file:px-4 file:py-2.5 file:text-sm file:font-bold file:text-[#16803C] hover:file:bg-[#D7F0E0]"
              />
              {uploading && (
                <p className="mt-2 text-xs font-semibold text-[#16803C]">
                  Uploading...
                </p>
              )}

              <input
                className={`${inputClass} mt-3`}
                value={form.image_url}
                onChange={(e) => setField('image_url', e.target.value)}
                placeholder="...or paste an image URL"
              />
            </div>

            <div>
              <label className={labelClass}>Badge (optional)</label>
              <input
                className={inputClass}
                value={form.badge}
                onChange={(e) => setField('badge', e.target.value)}
                placeholder="e.g. Deal"
              />
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea
                rows={3}
                className={inputClass}
                value={form.description}
                onChange={(e) => setField('description', e.target.value)}
              />
            </div>

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving || uploading}
                className="flex-1 rounded-xl bg-[#16803C] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0F5C2E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Saving...' : editingId ? 'Save changes' : 'Add product'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-[#E5E7EB] px-5 py-3 text-sm font-bold text-[#374151] hover:text-[#171717]"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* List */}
          <div className="space-y-3 lg:col-span-2">
            <p className="text-sm text-[#374151]">
              {products.length} {products.length === 1 ? 'product' : 'products'}
            </p>

            {products.map((product) => (
              <article
                key={product.id}
                className="flex items-center gap-4 rounded-2xl border border-[#E5E7EB] bg-white p-4"
              >
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold">{product.name}</h3>
                  <p className="text-xs text-[#374151]">
                    ₹{product.price} · Stock {product.stock}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => startEdit(product)}
                  className="text-xs font-bold text-[#16803C] hover:text-[#0F5C2E]"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(product)}
                  className="text-xs font-bold text-[#374151] hover:text-red-600"
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}