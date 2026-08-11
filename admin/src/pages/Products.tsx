import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react';
import { productApi, categoryApi } from '../lib/api';
import Modal from '../components/Modal';
import MultiImageUpload from "../components/MultiImageUpload";

interface ProductImage {
  id?: string;
  url: string;
  is_primary?: boolean;
  sort_order?: number;
  alt_text?: string;
}
interface ProductVariant {
    id?: string;
    sku: string;
    size: string;
    color: string;
    color_hex: string;
    stock_quantity: number;
    price_adjustment: number;
    image_url?: string;
}

interface Product {
  id: string;
  images: ProductImage[];
  slug: string;
  name: string;
  description: string;
  base_price: number;
  compare_price: number | null;
  category_id: string;
  category_name?: string;
  inventory_quantity: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  variants?: ProductVariant[];
}

interface Category {
  id: string;
  name: string;
}

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  base_price: '',
  compare_price: '',
  category_id: '',
  inventory_quantity: '0',
  is_active: true,
  is_featured: false,
  images: [] as string[],
  variants: [] as ProductVariant[],
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [hasVariants, setHasVariants] = useState(false);

  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      sku: "",
      size: "",
      color: "",
      color_hex: "#000000",
      stock_quantity: 0,
      price_adjustment: 0,
      image_url: "",
    },
  ]);
  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await productApi.list();
setProducts(res.data?.products || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.list();
      setCategories(res.data?.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    // Fetch categories for dropdown
    fetchCategories();
  }, []);

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const openAdd = () => {
    setForm({...emptyForm});
    setVariants([
        {
            sku:"",
            size:"",
            color:"",
            color_hex:"#000000",
            stock_quantity:0,
            price_adjustment:0,
            image_url:""
        }
    ]);
    setHasVariants(false);
    setError("");
    setIsAddOpen(true);
}

  const openEdit = async (product: Product) => {
  const res = await productApi.get(product.slug);
  const fullProduct = res.data;
setVariants(fullProduct.variants || []);
setHasVariants((fullProduct.variants || []).length > 0);
  setSelectedProduct(fullProduct);

  setForm({
    name: fullProduct.name,
    slug: fullProduct.slug,
    description: fullProduct.description || '',
    base_price: String(fullProduct.base_price),
    compare_price: fullProduct.compare_price
      ? String(fullProduct.compare_price)
      : '',
    category_id: fullProduct.category_id || '',
    inventory_quantity: String(fullProduct.inventory_quantity || 0),
    is_active: fullProduct.is_active,
    is_featured: fullProduct.is_featured,
    images: (fullProduct.images || []).map((img: ProductImage) => img.url),
    variants: fullProduct.variants || [],
  });

  setError('');
  setIsEditOpen(true);
};

  const openDelete = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
  ...form,
  base_price: Number(form.base_price),
  compare_price: form.compare_price
    ? Number(form.compare_price)
    : null,
  inventory_quantity: Number(form.inventory_quantity),
  variants: hasVariants ? variants : [],
};
      await productApi.create(payload);
      setVariants([]);
setHasVariants(false);
      setIsAddOpen(false);
      fetchProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        base_price: Number(form.base_price),
        compare_price: form.compare_price ? Number(form.compare_price) : null,
        inventory_quantity: Number(form.inventory_quantity),
        variants: hasVariants ? variants : [],
      };
      await productApi.update(selectedProduct.slug, payload);
      setIsEditOpen(false);
      fetchProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to update product');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    setSaving(true);
    try {
      await productApi.delete(selectedProduct.slug);
      setIsDeleteOpen(false);
      fetchProducts();
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
    } finally {
      setSaving(false);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#C89A5A] w-72"
          />
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] text-white text-sm font-medium rounded-lg hover:bg-[#333] transition-colors"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-3.5 font-medium text-gray-500">Product</th>
              <th className="text-left px-6 py-3.5 font-medium text-gray-500">Price</th>
              <th className="text-left px-6 py-3.5 font-medium text-gray-500">Stock</th>
              <th className="text-left px-6 py-3.5 font-medium text-gray-500">Status</th>
              <th className="text-right px-6 py-3.5 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-400">No products found</td></tr>
            ) : filtered.map((product) => (
              <tr key={product.slug} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package size={16} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-[#111111]">{product.name}</p>
                      <p className="text-xs text-gray-400">{product.category_name || 'No category'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium">N{Number(product.base_price).toLocaleString()}</p>
                  {product.compare_price && (
                    <p className="text-xs text-gray-400 line-through">N{Number(product.compare_price).toLocaleString()}</p>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-600">{product.inventory_quantity ?? '-'}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                    product.is_active
                      ? 'bg-green-50 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {product.is_active ? 'Active' : 'Draft'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => openEdit(product)}
                      className="p-2 text-gray-400 hover:text-[#C89A5A] hover:bg-[#C89A5A]/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => openDelete(product)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD MODAL */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Product" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value, slug: form.slug || generateSlug(e.target.value) })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]"
                placeholder="e.g. Seamless Leggings"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input
                required
                value={form.slug}
                onChange={e => setForm({ ...form, slug: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]"
                placeholder="seamless-leggings"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category_id}
                onChange={e => setForm({ ...form, category_id: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (N) *</label>
              <input
                required
                type="number"
                min="0"
                value={form.base_price}
                onChange={e => setForm({ ...form, base_price: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]"
                placeholder="25000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compare Price (N)</label>
              <input
                type="number"
                min="0"
                value={form.compare_price}
                onChange={e => setForm({ ...form, compare_price: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]"
                placeholder="30000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inventory Quantity</label>
              <input
                type="number"
                min="0"
                value={form.inventory_quantity}
                onChange={e => setForm({ ...form, inventory_quantity: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A] resize-none"
                placeholder="Product description..."
              />
            </div>

            <div className="col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Product Images
  </label>

  <MultiImageUpload
    value={form.images}
    onChange={(images) =>
      setForm({
        ...form,
        images,
      })
    }
    folder="products"
  />
</div>
<h3 className="text-lg font-semibold mt-10 mb-4">Variants</h3>

<div className="col-span-2">
  <label className="flex items-center gap-3 mb-4">
    <input
      type="checkbox"
      checked={hasVariants}
      onChange={(e) => {
        setHasVariants(e.target.checked);

        if (!e.target.checked) {
          setVariants([]);
        } else {
          setVariants([
            {
                  sku: "",
                  size: "",
                  color: "",
                  color_hex: "#000000",
                  stock_quantity: 0,
                  price_adjustment: 0,
                  image_url: "",
                },
          ]);
        }
      }}
    />
    <span>Sizes & Colors</span>
  </label>
</div>
{hasVariants && (
  <div className="col-span-2 space-y-5">

    {variants.map((variant, index) => (
      <div
        key={index}
        className="border rounded-xl p-5 space-y-4"
      >

        <div className="grid grid-cols-2 gap-4">

          <input
    placeholder="Size (S, M, L)"
    value={variant.size}
    onChange={(e)=>{
        const copy = [...variants];

copy[index] = {
    ...copy[index],
    sku: e.target.value,
};

setVariants(copy);
    }}
/>
          <input
            placeholder="SKU"
            value={variant.sku}
            onChange={(e) => {
              const copy = [...variants];
              copy[index].sku = e.target.value;
              setVariants(copy);
            }}
            className="border rounded-lg px-3 py-2"
          />

          <input
            placeholder="Color"
            value={variant.color}
            onChange={(e) => {
              const copy = [...variants];
              copy[index].color = e.target.value;
              setVariants(copy);
            }}
            className="border rounded-lg px-3 py-2"
          />

          <input
            type="color"
            value={variant.color_hex}
            onChange={(e) => {
              const copy = [...variants];
              copy[index].color_hex = e.target.value;
              setVariants(copy);
            }}
          />

          <input
            type="number"
            placeholder="Stock"
            value={variant.stock_quantity}
            onChange={(e) => {
              const copy = [...variants];
              copy[index].stock_quantity = Number(e.target.value);
              setVariants(copy);
            }}
            className="border rounded-lg px-3 py-2"
          />

          <input
            type="number"
            placeholder="Price Adjustment"
            value={variant.price_adjustment}
            onChange={(e) => {
              const copy = [...variants];
              copy[index].price_adjustment = Number(e.target.value);
              setVariants(copy);
            }}
            className="border rounded-lg px-3 py-2"
          />

        </div>
<div className="col-span-2">

<label className="block text-sm mb-2">
Variant Image
</label>

<MultiImageUpload
value={variant.image_url ? [variant.image_url] : []}
onChange={(images) => {
    const copy = [...variants];
    copy[index].image_url = images[0] || "";
    setVariants(copy);
}}
folder="products"
/>

</div>
        <button
          type="button"
          onClick={() =>
            setVariants(variants.filter((_, i) => i !== index))
          }
          className="text-red-600 text-sm"
        >
          Remove Variant
        </button>

      </div>
    ))}

    <button
      type="button"
      onClick={() =>
        setVariants([
          ...variants,
          {
            sku: "",
            size: "",
            color: "",
            color_hex: "#000000",
            stock_quantity: 0,
            price_adjustment: 0,
            image_url: "",
          },
        ])
      }
      className="bg-black text-white px-4 py-2 rounded-lg"
    >
      + Add Variant
    </button>

  </div>
)}

            <div className="col-span-2 flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={e => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[#C89A5A] focus:ring-[#C89A5A]"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[#C89A5A] focus:ring-[#C89A5A]"
                />
                <span className="text-sm text-gray-700">Featured</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#111111] text-white text-sm font-medium rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Product" size="lg">
        <form onSubmit={handleUpdate} className="space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
              <input
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
              <input
                required
                value={form.slug}
                onChange={e => setForm({ ...form, slug: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={form.category_id}
                onChange={e => setForm({ ...form, category_id: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]"
              >
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (N) *</label>
              <input
                required
                type="number"
                min="0"
                value={form.base_price}
                onChange={e => setForm({ ...form, base_price: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compare Price (N)</label>
              <input
                type="number"
                min="0"
                value={form.compare_price}
                onChange={e => setForm({ ...form, compare_price: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Inventory Quantity</label>
              <input
                type="number"
                min="0"
                value={form.inventory_quantity}
                onChange={e => setForm({ ...form, inventory_quantity: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A] resize-none"
              />
            </div>

<div className="col-span-2">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Product Images
  </label>

  <MultiImageUpload
    value={form.images}
    onChange={(images) =>
      setForm({
        ...form,
        images,
      })
    }
    folder="products"
  />
</div>
<h3 className="text-lg font-semibold mt-10 mb-4">Variants</h3>

<div className="col-span-2">
  <label className="flex items-center gap-3 mb-4">
    <input
      type="checkbox"
      checked={hasVariants}
      onChange={(e) => {
        setHasVariants(e.target.checked);

        if (!e.target.checked) {
          setVariants([]);
        } else {
          setVariants([
            {
                  sku: "",
                  size: "",
                  color: "",
                  color_hex: "#000000",
                  stock_quantity: 0,
                  price_adjustment: 0,
                  image_url: "",
                },
          ]);
        }
      }}
    />
    <span>Sizes & Colors</span>
  </label>
</div>
{hasVariants && (
  <div className="col-span-2 space-y-5">
    {variants.map((variant, index) => (
      <div
        key={variant.id || `new-${index}`}
        className="border rounded-xl p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Variant {index + 1}</h3>

          <button
            type="button"
            onClick={() => {
              setVariants((prev) => prev.filter((_, i) => i !== index));
            }}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
          >
            <Trash2 size={15} />
            Remove
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Size (S, M, L)"
            value={variant.size}
            onChange={(e) => {
              const copy = [...variants];
              copy[index].size = e.target.value;
              setVariants(copy);
            }}
            className="border rounded-lg px-3 py-2"
          />
          <input
            placeholder="SKU"
            value={variant.sku}
            onChange={(e) => {
              const copy = [...variants];
              copy[index].sku = e.target.value;
              setVariants(copy);
            }}
            className="border rounded-lg px-3 py-2"
          />

          <input
            placeholder="Color"
            value={variant.color}
            onChange={(e) => {
              const copy = [...variants];
              copy[index].color = e.target.value;
              setVariants(copy);
            }}
            className="border rounded-lg px-3 py-2"
          />

          <input
            type="color"
            value={variant.color_hex}
            onChange={(e) => {
              const copy = [...variants];
              copy[index].color_hex = e.target.value;
              setVariants(copy);
            }}
          />

          <div>
            <label className="block text-sm font-medium mb-1">Stock Quantity</label>
            <input
              type="number"
              value={variant.stock_quantity}
              onChange={(e) => {
                const copy = [...variants];
                copy[index].stock_quantity = Number(e.target.value);
                setVariants(copy);
              }}
              className="border rounded-lg px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price Adjustment (₦)</label>
            <input
              type="number"
              value={variant.price_adjustment}
              onChange={(e) => {
                const copy = [...variants];
                copy[index].price_adjustment = Number(e.target.value);
                setVariants(copy);
              }}
              className="border rounded-lg px-3 py-2 w-full"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm mb-2">Variant Image</label>
            <MultiImageUpload
              value={variant.image_url ? [variant.image_url] : []}
              onChange={(images) => {
                const copy = [...variants];
                copy[index].image_url = images[0] || "";
                setVariants(copy);
              }}
              folder="products"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setVariants((prev) => prev.filter((_, i) => i !== index))}
          className="text-red-600 text-sm"
        >
          Remove Variant
        </button>
      </div>
    ))}

    <button
      type="button"
      onClick={() =>
        setVariants([
          ...variants,
          {
            sku: "",
            size: "",
            color: "",
            color_hex: "#000000",
            stock_quantity: 0,
            price_adjustment: 0,
            image_url: "",
          },
        ])
      }
      className="bg-black text-white px-4 py-2 rounded-lg"
    >
      + Add Variant
    </button>
  </div>
)}

            <div className="col-span-2 flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={e => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[#C89A5A] focus:ring-[#C89A5A]"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-[#C89A5A] focus:ring-[#C89A5A]"
                />
                <span className="text-sm text-gray-700">Featured</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#111111] text-white text-sm font-medium rounded-lg hover:bg-[#333] transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete Product" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete <strong>{selectedProduct?.name}</strong>? This action cannot be undone.
          </p>
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={saving}
              className="px-6 py-2.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {saving ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
