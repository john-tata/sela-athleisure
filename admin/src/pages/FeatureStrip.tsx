import { useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Check,
  X,
  Sparkles,
  Sun,
  Maximize,
  ShieldCheck,
  Truck,
  Star,
  Zap,
  Heart,
  Activity,
  Circle,
} from 'lucide-react';
import { contentApi } from '../lib/api';
import Modal from '../components/Modal';

interface FeatureItem {
  label: string;
  icon: string;
  enabled: boolean;
  sort_order: number;
}

const ICONS: Record<string, any> = {
  sun: Sun,
  stretch: Maximize,
  shield: ShieldCheck,
  truck: Truck,
  sparkles: Sparkles,
  star: Star,
  zap: Zap,
  heart: Heart,
  activity: Activity,
  circle: Circle,
};

const ICON_OPTIONS = [
  { value: 'sun', label: 'Sun' },
  { value: 'stretch', label: 'Stretch' },
  { value: 'shield', label: 'Shield' },
  { value: 'truck', label: 'Truck' },
  { value: 'sparkles', label: 'Sparkles' },
  { value: 'star', label: 'Star' },
  { value: 'zap', label: 'Lightning' },
  { value: 'heart', label: 'Heart' },
  { value: 'activity', label: 'Activity' },
];

const DEFAULT_FEATURE: FeatureItem = {
  label: '',
  icon: 'sparkles',
  enabled: true,
  sort_order: 1,
};

export default function FeatureStrip() {
  const [features, setFeatures] = useState<FeatureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<FeatureItem>(DEFAULT_FEATURE);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await contentApi.getSection('feature_strip');

      const section =
        response?.data?.section ??
        response?.section ??
        response?.data ??
        response;

      const loadedFeatures = section?.extra?.features ?? [];

      setFeatures(
        [...loadedFeatures].sort(
          (a: FeatureItem, b: FeatureItem) =>
            (a.sort_order || 0) - (b.sort_order || 0)
        )
      );
    } catch (err: any) {
      console.error('Failed to load feature strip:', err);
      setError(
        err?.message || 'Failed to load Feature Strip.'
      );
    } finally {
      setLoading(false);
    }
  };

  const saveFeatures = async (nextFeatures: FeatureItem[]) => {
    try {
      setSaving(true);
      setError('');

      const normalized = nextFeatures.map((feature, index) => ({
        ...feature,
        sort_order: index + 1,
      }));

      await contentApi.updateSection('feature_strip', {
        extra: {
          features: normalized,
        },
      });

      setFeatures(normalized);
    } catch (err: any) {
      console.error('Failed to save feature strip:', err);
      setError(
        err?.message || 'Failed to save Feature Strip.'
      );
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const openAddModal = () => {
    setEditingIndex(null);

    setForm({
      ...DEFAULT_FEATURE,
      sort_order: features.length + 1,
    });

    setModalOpen(true);
  };

  const openEditModal = (index: number) => {
    setEditingIndex(index);
    setForm({ ...features[index] });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;

    setModalOpen(false);
    setEditingIndex(null);
    setForm(DEFAULT_FEATURE);
  };

  const handleSave = async () => {
    if (!form.label.trim()) {
      setError('Please enter a feature label.');
      return;
    }

    try {
      const nextFeatures = [...features];

      const feature = {
        ...form,
        label: form.label.trim().toUpperCase(),
      };

      if (editingIndex === null) {
        nextFeatures.push(feature);
      } else {
        nextFeatures[editingIndex] = feature;
      }

      await saveFeatures(nextFeatures);

      setModalOpen(false);
      setEditingIndex(null);
      setForm(DEFAULT_FEATURE);
    } catch {
      // Error is already handled by saveFeatures.
    }
  };

  const handleDelete = async (index: number) => {
    const feature = features[index];

    const confirmed = window.confirm(
      `Delete "${feature.label}"? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const nextFeatures = features.filter(
        (_, i) => i !== index
      );

      await saveFeatures(nextFeatures);
    } catch {
      // Error is already handled by saveFeatures.
    }
  };

  const handleToggle = async (index: number) => {
    const nextFeatures = features.map((feature, i) =>
      i === index
        ? {
            ...feature,
            enabled: !feature.enabled,
          }
        : feature
    );

    try {
      await saveFeatures(nextFeatures);
    } catch {
      // Error is already handled by saveFeatures.
    }
  };

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    setDraggedIndex(index);

    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData(
      'text/plain',
      String(index)
    );
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    event.preventDefault();

    if (draggedIndex === null || draggedIndex === index) {
      return;
    }

    setDragOverIndex(index);
  };

  const handleDrop = async (
    event: React.DragEvent<HTMLDivElement>,
    dropIndex: number
  ) => {
    event.preventDefault();

    if (
      draggedIndex === null ||
      draggedIndex === dropIndex
    ) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const nextFeatures = [...features];
    const [movedFeature] = nextFeatures.splice(
      draggedIndex,
      1
    );

    nextFeatures.splice(dropIndex, 0, movedFeature);

    setDraggedIndex(null);
    setDragOverIndex(null);

    try {
      await saveFeatures(nextFeatures);
    } catch {
      // Error is already handled by saveFeatures.
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const getIcon = (iconName: string) => {
    return ICONS[iconName] || Sparkles;
  };

  const activeCount = features.filter(
    (feature) => feature.enabled
  ).length;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles
              size={18}
              className="text-[#C89A5A]"
            />

            <span className="text-xs font-semibold tracking-widest text-[#C89A5A] uppercase">
              Homepage
            </span>
          </div>

          <h2 className="text-2xl font-semibold text-[#111111]">
            Feature Strip
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage the features displayed in the scrolling
            strip on your homepage.
          </p>
        </div>

        <button
          onClick={openAddModal}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#111111] text-white rounded-lg text-sm font-medium hover:bg-black/80 transition disabled:opacity-50"
        >
          <Plus size={17} />
          Add Feature
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-lg">
          <X
            size={18}
            className="text-red-500 mt-0.5 flex-shrink-0"
          />

          <div className="flex-1">
            <p className="text-sm font-medium text-red-700">
              {error}
            </p>

            <button
              onClick={() => setError('')}
              className="mt-1 text-xs text-red-600 underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      {!loading && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs uppercase tracking-wider text-gray-400">
              Total Features
            </p>

            <p className="mt-2 text-2xl font-semibold text-[#111111]">
              {features.length}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <p className="text-xs uppercase tracking-wider text-gray-400">
              Active Features
            </p>

            <p className="mt-2 text-2xl font-semibold text-[#111111]">
              {activeCount}
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-[#111111]">
                Homepage Features
              </h3>

              <p className="text-xs text-gray-400 mt-1">
                Drag items to change their display order.
              </p>
            </div>

            {saving && (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-3 h-3 border-2 border-gray-300 border-t-[#C89A5A] rounded-full animate-spin" />
                Saving...
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="mx-auto w-8 h-8 border-2 border-gray-200 border-t-[#C89A5A] rounded-full animate-spin" />

            <p className="mt-4 text-sm text-gray-500">
              Loading features...
            </p>
          </div>
        ) : features.length === 0 ? (
          <div className="p-12 text-center">
            <Sparkles
              size={32}
              className="mx-auto text-gray-300"
            />

            <h3 className="mt-4 text-sm font-semibold text-gray-700">
              No features yet
            </h3>

            <p className="mt-1 text-sm text-gray-400">
              Add your first homepage feature.
            </p>

            <button
              onClick={openAddModal}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-[#111111] text-white rounded-lg text-sm font-medium"
            >
              <Plus size={16} />
              Add Feature
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {features.map((feature, index) => {
              const Icon = getIcon(feature.icon);

              return (
                <div
                  key={`${feature.label}-${index}`}
                  draggable={!saving}
                  onDragStart={(event) =>
                    handleDragStart(event, index)
                  }
                  onDragOver={(event) =>
                    handleDragOver(event, index)
                  }
                  onDrop={(event) =>
                    handleDrop(event, index)
                  }
                  onDragEnd={handleDragEnd}
                  className={`
                    group flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4
                    transition-all duration-150
                    ${
                      dragOverIndex === index
                        ? 'bg-[#C89A5A]/5 border-t-2 border-[#C89A5A]'
                        : 'hover:bg-gray-50'
                    }
                    ${
                      draggedIndex === index
                        ? 'opacity-40'
                        : ''
                    }
                  `}
                >
                  {/* Drag Handle */}
                  <div
                    className={`flex-shrink-0 ${
                      saving
                        ? 'cursor-not-allowed'
                        : 'cursor-grab active:cursor-grabbing'
                    }`}
                    title="Drag to reorder"
                  >
                    <GripVertical
                      size={19}
                      className="text-gray-300 group-hover:text-gray-500"
                    />
                  </div>

                  {/* Order */}
                  <div className="hidden sm:flex w-8 h-8 rounded-full bg-gray-100 items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-gray-500">
                      {index + 1}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="w-10 h-10 rounded-lg bg-[#111111] flex items-center justify-center flex-shrink-0">
                    <Icon
                      size={18}
                      strokeWidth={1.6}
                      className="text-[#C89A5A]"
                    />
                  </div>

                  {/* Feature */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#111111] truncate">
                      {feature.label}
                    </p>

                    <p className="text-xs text-gray-400 mt-0.5">
                      Icon: {feature.icon}
                    </p>
                  </div>

                  {/* Status */}
                  <button
                    onClick={() =>
                      handleToggle(index)
                    }
                    disabled={saving}
                    className={`
                      hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition
                      ${
                        feature.enabled
                          ? 'bg-green-50 text-green-600'
                          : 'bg-gray-100 text-gray-500'
                      }
                    `}
                  >
                    {feature.enabled ? (
                      <>
                        <Check size={13} />
                        Active
                      </>
                    ) : (
                      <>
                        <X size={13} />
                        Inactive
                      </>
                    )}
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        openEditModal(index)
                      }
                      disabled={saving}
                      className="p-2 text-gray-400 hover:text-[#111111] hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(index)
                      }
                      disabled={saving}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile hint */}
      {!loading && features.length > 0 && (
        <p className="mt-4 text-xs text-gray-400 sm:hidden">
          Tip: Use a desktop screen to drag features into a
          different order.
        </p>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={
          editingIndex === null
            ? 'Add Feature'
            : 'Edit Feature'
        }
      >
        <div className="space-y-5">
          {/* Label */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feature Label
            </label>

            <input
              type="text"
              value={form.label}
              onChange={(event) =>
                setForm({
                  ...form,
                  label: event.target.value,
                })
              }
              placeholder="e.g. BREATHABLE FABRIC"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#C89A5A]"
              autoFocus
            />

            <p className="mt-1.5 text-xs text-gray-400">
              The label will automatically display in uppercase.
            </p>
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {ICON_OPTIONS.map((option) => {
                const Icon = ICONS[option.value];

                const selected =
                  form.icon === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        icon: option.value,
                      })
                    }
                    className={`
                      flex flex-col items-center justify-center gap-2 p-3 rounded-lg border transition
                      ${
                        selected
                          ? 'border-[#C89A5A] bg-[#C89A5A]/5 text-[#C89A5A]'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon size={19} />

                    <span className="text-[10px]">
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Enabled */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Feature Status
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Show this feature on the storefront.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setForm({
                  ...form,
                  enabled: !form.enabled,
                })
              }
              className={`
                relative w-11 h-6 rounded-full transition
                ${
                  form.enabled
                    ? 'bg-[#C89A5A]'
                    : 'bg-gray-300'
                }
              `}
            >
              <span
                className={`
                  absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition
                  ${
                    form.enabled
                      ? 'left-6'
                      : 'left-1'
                  }
                `}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
              disabled={saving}
              className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !form.label.trim()}
              className="px-5 py-2.5 bg-[#111111] text-white rounded-lg text-sm font-medium hover:bg-black/80 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}

              {editingIndex === null
                ? 'Add Feature'
                : 'Save Changes'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}