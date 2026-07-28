import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Image, Quote, Star } from 'lucide-react';
import { contentApi } from '../lib/api';
import Modal from '../components/Modal';

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string | null;
  cta_text: string | null;
  cta_link: string | null;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}

interface Testimonial {
  id: string;
  name: string;
  role: string | null;
  quote: string;
  avatar_url: string | null;
  rating: number;
  is_active: boolean;
}

interface LookbookImage {
  id: string;
  title: string | null;
  image_url: string;
  sort_order: number;
  is_active: boolean;
}

type Tab = 'hero' | 'testimonials' | 'lookbook';

export default function Content() {
  const [activeTab, setActiveTab] = useState<Tab>('hero');
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [lookbook, setLookbook] = useState<LookbookImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Forms
  const [slideForm, setSlideForm] = useState({ title: '', subtitle: '', cta_text: 'Shop Now', cta_link: '/shop', image_url: '', sort_order: '0', is_active: true });
  const [testimonialForm, setTestimonialForm] = useState({ name: '', role: '', quote: '', avatar_url: '', rating: '5', is_active: true });
  const [lookbookForm, setLookbookForm] = useState({ title: '', image_url: '', sort_order: '0', is_active: true });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sRes, tRes, lRes] = await Promise.all([
        contentApi.listSlides(),
        contentApi.listTestimonials(),
        contentApi.listLookbook(),
      ]);
      setSlides(sRes.slides || sRes.data || []);
      setTestimonials(tRes.testimonials || tRes.data || []);
      setLookbook(lRes.lookbook || lRes.data || []);
    } catch (err) {
      console.error('Failed to load content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const tabs: { key: Tab; label: string; icon: any; count: number }[] = [
    { key: 'hero', label: 'Hero Slides', icon: Image, count: slides.length },
    { key: 'testimonials', label: 'Testimonials', icon: Quote, count: testimonials.length },
    { key: 'lookbook', label: 'Lookbook', icon: Star, count: lookbook.length },
  ];

  // ===== CREATE =====
  const openAdd = () => {
    setSlideForm({ title: '', subtitle: '', cta_text: 'Shop Now', cta_link: '/shop', image_url: '', sort_order: '0', is_active: true });
    setTestimonialForm({ name: '', role: '', quote: '', avatar_url: '', rating: '5', is_active: true });
    setLookbookForm({ title: '', image_url: '', sort_order: '0', is_active: true });
    setError('');
    setIsAddOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (activeTab === 'hero') {
        await contentApi.createSlide({ ...slideForm, sort_order: Number(slideForm.sort_order) });
      } else if (activeTab === 'testimonials') {
        await contentApi.createTestimonial({ ...testimonialForm, rating: Number(testimonialForm.rating) });
      } else {
        await contentApi.createLookbook({ ...lookbookForm, sort_order: Number(lookbookForm.sort_order) });
      }
      setIsAddOpen(false);
      fetchAll();
    } catch (err: any) {
      setError(err.message || 'Failed to create');
    } finally {
      setSaving(false);
    }
  };

  // ===== EDIT =====
  const openEdit = (item: any) => {
    setSelectedId(item.id);
    if (activeTab === 'hero') {
      setSlideForm({
        title: item.title || '',
        subtitle: item.subtitle || '',
        cta_text: item.cta_text || 'Shop Now',
        cta_link: item.cta_link || '/shop',
        image_url: item.image_url || '',
        sort_order: String(item.sort_order || 0),
        is_active: item.is_active,
      });
    } else if (activeTab === 'testimonials') {
      setTestimonialForm({
        name: item.name || '',
        role: item.role || '',
        quote: item.quote || '',
        avatar_url: item.avatar_url || '',
        rating: String(item.rating || 5),
        is_active: item.is_active,
      });
    } else {
      setLookbookForm({
        title: item.title || '',
        image_url: item.image_url || '',
        sort_order: String(item.sort_order || 0),
        is_active: item.is_active,
      });
    }
    setError('');
    setIsEditOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (activeTab === 'hero') {
        await contentApi.updateSlide(selectedId, { ...slideForm, sort_order: Number(slideForm.sort_order) });
      } else if (activeTab === 'testimonials') {
        await contentApi.updateTestimonial(selectedId, { ...testimonialForm, rating: Number(testimonialForm.rating) });
      } else {
        await contentApi.updateLookbook(selectedId, { ...lookbookForm, sort_order: Number(lookbookForm.sort_order) });
      }
      setIsEditOpen(false);
      fetchAll();
    } catch (err: any) {
      setError(err.message || 'Failed to update');
    } finally {
      setSaving(false);
    }
  };

  // ===== DELETE =====
  const openDelete = (id: string) => {
    setSelectedId(id);
    setIsDeleteOpen(true);
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      if (activeTab === 'hero') await contentApi.deleteSlide(selectedId);
      else if (activeTab === 'testimonials') await contentApi.deleteTestimonial(selectedId);
      else await contentApi.deleteLookbook(selectedId);
      setIsDeleteOpen(false);
      fetchAll();
    } catch (err: any) {
      setError(err.message || 'Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={12} className={s <= rating ? 'text-[#C89A5A] fill-[#C89A5A]' : 'text-gray-200'} />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-[#111111] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key ? 'bg-[#111111] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#111111] text-white text-sm font-medium rounded-lg hover:bg-[#333] transition-colors"
        >
          <Plus size={16} />
          Add {activeTab === 'hero' ? 'Slide' : activeTab === 'testimonials' ? 'Testimonial' : 'Image'}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : (
        <div className="space-y-3">
          {/* HERO SLIDES */}
          {activeTab === 'hero' && (
            slides.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-12">No hero slides yet</p>
            ) : (
              <div className="grid gap-3">
                {slides.map((slide) => (
                  <div key={slide.id} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                    <div className="w-24 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {slide.image_url ? (
                        <img src={slide.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Image size={16} className="text-gray-300" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-[#111111] truncate">{slide.title}</h4>
                      <p className="text-sm text-gray-500 truncate">{slide.subtitle || 'No subtitle'}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${slide.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {slide.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="text-xs text-gray-400">Order: {slide.sort_order}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(slide)} className="p-2 text-gray-400 hover:text-[#C89A5A] hover:bg-[#C89A5A]/10 rounded-lg"><Pencil size={14} /></button>
                      <button onClick={() => openDelete(slide.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            testimonials.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-12">No testimonials yet</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {testimonials.map((t) => (
                  <div key={t.id} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                          {t.avatar_url ? (
                            <img src={t.avatar_url} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#C89A5A]/10 text-[#C89A5A] text-sm font-medium">
                              {t.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-[#111111]">{t.name}</h4>
                          <p className="text-xs text-gray-400">{t.role || 'Customer'}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(t)} className="p-1.5 text-gray-400 hover:text-[#C89A5A] hover:bg-[#C89A5A]/10 rounded-lg"><Pencil size={13} /></button>
                        <button onClick={() => openDelete(t.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={13} /></button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 italic mb-3">&ldquo;{t.quote}&rdquo;</p>
                    <div className="flex items-center justify-between">
                      {renderStars(t.rating)}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${t.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {t.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* LOOKBOOK */}
          {activeTab === 'lookbook' && (
            lookbook.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-12">No lookbook images yet</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {lookbook.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow group">
                    <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                      {item.image_url ? (
                        <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Image size={24} className="text-gray-300" /></div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(item)} className="p-2 bg-white rounded-lg text-gray-700 hover:text-[#C89A5A]"><Pencil size={14} /></button>
                          <button onClick={() => openDelete(item.id)} className="p-2 bg-white rounded-lg text-gray-700 hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium text-[#111111] truncate">{item.title || 'Untitled'}</p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-400">Order: {item.sort_order}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${item.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {item.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      )}

      {/* ===== ADD MODAL ===== */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title={`Add ${activeTab === 'hero' ? 'Hero Slide' : activeTab === 'testimonials' ? 'Testimonial' : 'Lookbook Image'}`}>
        <form onSubmit={handleCreate} className="space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          {activeTab === 'hero' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input required value={slideForm.title} onChange={e => setSlideForm({ ...slideForm, title: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" placeholder="Spring Collection" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input value={slideForm.subtitle} onChange={e => setSlideForm({ ...slideForm, subtitle: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" placeholder="New arrivals for the season" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
                  <input value={slideForm.cta_text} onChange={e => setSlideForm({ ...slideForm, cta_text: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" placeholder="Shop Now" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
                  <input value={slideForm.cta_link} onChange={e => setSlideForm({ ...slideForm, cta_link: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" placeholder="/shop" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                <input required value={slideForm.image_url} onChange={e => setSlideForm({ ...slideForm, image_url: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" placeholder="https://..." />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input type="number" value={slideForm.sort_order} onChange={e => setSlideForm({ ...slideForm, sort_order: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-6">
                  <input type="checkbox" checked={slideForm.is_active} onChange={e => setSlideForm({ ...slideForm, is_active: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[#C89A5A]" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </>
          )}

          {activeTab === 'testimonials' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input required value={testimonialForm.name} onChange={e => setTestimonialForm({ ...testimonialForm, name: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" placeholder="Sarah Johnson" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input value={testimonialForm.role} onChange={e => setTestimonialForm({ ...testimonialForm, role: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" placeholder="Fitness Instructor" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quote *</label>
                <textarea required rows={3} value={testimonialForm.quote} onChange={e => setTestimonialForm({ ...testimonialForm, quote: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A] resize-none" placeholder="The quality is amazing..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                <input value={testimonialForm.avatar_url} onChange={e => setTestimonialForm({ ...testimonialForm, avatar_url: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" placeholder="https://..." />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                  <input type="number" min="1" max="5" value={testimonialForm.rating} onChange={e => setTestimonialForm({ ...testimonialForm, rating: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-6">
                  <input type="checkbox" checked={testimonialForm.is_active} onChange={e => setTestimonialForm({ ...testimonialForm, is_active: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[#C89A5A]" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </>
          )}

          {activeTab === 'lookbook' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={lookbookForm.title} onChange={e => setLookbookForm({ ...lookbookForm, title: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" placeholder="Summer Vibes" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                <input required value={lookbookForm.image_url} onChange={e => setLookbookForm({ ...lookbookForm, image_url: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" placeholder="https://..." />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input type="number" value={lookbookForm.sort_order} onChange={e => setLookbookForm({ ...lookbookForm, sort_order: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-6">
                  <input type="checkbox" checked={lookbookForm.is_active} onChange={e => setLookbookForm({ ...lookbookForm, is_active: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[#C89A5A]" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2 bg-[#111111] text-white text-sm rounded-lg hover:bg-[#333] disabled:opacity-50">
              {saving ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ===== EDIT MODAL ===== */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title={`Edit ${activeTab === 'hero' ? 'Slide' : activeTab === 'testimonials' ? 'Testimonial' : 'Image'}`}>
        <form onSubmit={handleUpdate} className="space-y-4">
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          {activeTab === 'hero' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input required value={slideForm.title} onChange={e => setSlideForm({ ...slideForm, title: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input value={slideForm.subtitle} onChange={e => setSlideForm({ ...slideForm, subtitle: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CTA Text</label>
                  <input value={slideForm.cta_text} onChange={e => setSlideForm({ ...slideForm, cta_text: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CTA Link</label>
                  <input value={slideForm.cta_link} onChange={e => setSlideForm({ ...slideForm, cta_link: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                <input required value={slideForm.image_url} onChange={e => setSlideForm({ ...slideForm, image_url: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input type="number" value={slideForm.sort_order} onChange={e => setSlideForm({ ...slideForm, sort_order: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-6">
                  <input type="checkbox" checked={slideForm.is_active} onChange={e => setSlideForm({ ...slideForm, is_active: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[#C89A5A]" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </>
          )}

          {activeTab === 'testimonials' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input required value={testimonialForm.name} onChange={e => setTestimonialForm({ ...testimonialForm, name: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <input value={testimonialForm.role} onChange={e => setTestimonialForm({ ...testimonialForm, role: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quote *</label>
                <textarea required rows={3} value={testimonialForm.quote} onChange={e => setTestimonialForm({ ...testimonialForm, quote: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A] resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                <input value={testimonialForm.avatar_url} onChange={e => setTestimonialForm({ ...testimonialForm, avatar_url: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating (1-5)</label>
                  <input type="number" min="1" max="5" value={testimonialForm.rating} onChange={e => setTestimonialForm({ ...testimonialForm, rating: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-6">
                  <input type="checkbox" checked={testimonialForm.is_active} onChange={e => setTestimonialForm({ ...testimonialForm, is_active: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[#C89A5A]" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </>
          )}

          {activeTab === 'lookbook' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input value={lookbookForm.title} onChange={e => setLookbookForm({ ...lookbookForm, title: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                <input required value={lookbookForm.image_url} onChange={e => setLookbookForm({ ...lookbookForm, image_url: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                  <input type="number" value={lookbookForm.sort_order} onChange={e => setLookbookForm({ ...lookbookForm, sort_order: e.target.value })} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C89A5A]/30 focus:border-[#C89A5A]" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer mt-6">
                  <input type="checkbox" checked={lookbookForm.is_active} onChange={e => setLookbookForm({ ...lookbookForm, is_active: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-[#C89A5A]" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
            <button type="submit" disabled={saving} className="px-5 py-2 bg-[#111111] text-white text-sm rounded-lg hover:bg-[#333] disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ===== DELETE ===== */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Delete" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Are you sure? This cannot be undone.</p>
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <div className="flex justify-end gap-3">
            <button onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 text-sm text-gray-600">Cancel</button>
            <button onClick={handleDelete} disabled={saving} className="px-5 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 disabled:opacity-50">
              {saving ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
