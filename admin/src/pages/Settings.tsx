import { useEffect, useState } from 'react';
import { Save, Store, Palette, CreditCard, Truck, Plus, Trash2, } from 'lucide-react';
import { shippingApi } from '../lib/api';
export default function Settings() {
  const [storeName, setStoreName] = useState('Sela Athleisure');
  const [storeDesc, setStoreDesc] = useState('Premium athleisure wear for the modern lifestyle.');
  const [contactEmail, setContactEmail] = useState('hello@sela.com');
  const [contactPhone, setContactPhone] = useState('+234 800 123 4567');
  const [primaryColor, setPrimaryColor] = useState('#111111');
  const [accentColor, setAccentColor] = useState('#fbbf24');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [shippingZones, setShippingZones] = useState<any[]>([]);
const [shippingLoading, setShippingLoading] = useState(true);
const [shippingSaving, setShippingSaving] = useState(false);

const [newZone, setNewZone] = useState({
  name: '',
  state: '',
  description: '',
  shipping_fee: '',
  free_shipping_threshold: '',
});
useEffect(() => {
  loadShippingZones();
}, []);

async function loadShippingZones() {
  try {
    setShippingLoading(true);

    const response = await shippingApi.listZones();

    setShippingZones(response.data?.zones || []);
  } catch (error) {
    console.error('Failed to load shipping zones:', error);
  } finally {
    setShippingLoading(false);
  }
}
async function addShippingZone() {
  if (!newZone.name || !newZone.shipping_fee) return;

  try {
    setShippingSaving(true);

    await shippingApi.createZone({
      name: newZone.name,
      state: newZone.state || null,
      description: newZone.description || null,
      shipping_fee: Number(newZone.shipping_fee),
      free_shipping_threshold:
        newZone.free_shipping_threshold === ''
          ? null
          : Number(newZone.free_shipping_threshold),
      is_active: true,
    });

    setNewZone({
      name: '',
      state: '',
      description: '',
      shipping_fee: '',
      free_shipping_threshold: '',
    });

    await loadShippingZones();
  } catch (error) {
    console.error('Failed to create shipping zone:', error);
  } finally {
    setShippingSaving(false);
  }
}

async function deleteShippingZone(id: string) {
  if (!confirm('Delete this shipping zone?')) return;

  try {
    await shippingApi.deleteZone(id);
    await loadShippingZones();
  } catch (error) {
    console.error('Failed to delete shipping zone:', error);
  }
}

  return (
    <div className="max-w-3xl space-y-6">
      {/* Store Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Store size={18} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Store Information</h2>
            <p className="text-sm text-gray-500">Basic details about your store</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={storeDesc}
              onChange={(e) => setStoreDesc(e.target.value)}
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Phone</label>
              <input
                type="tel"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Brand Colors */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Palette size={18} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Brand Colors</h2>
            <p className="text-sm text-gray-500">Customize your store&apos;s color scheme</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Primary Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Accent Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Background Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="mt-4 p-4 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-3">Preview</p>
            <div
              className="p-6 rounded-lg flex items-center justify-center gap-4"
              style={{ backgroundColor: bgColor }}
            >
              <div
                className="px-6 py-3 rounded-lg text-sm font-medium"
                style={{ backgroundColor: primaryColor, color: bgColor === '#ffffff' ? '#fff' : '#000' }}
              >
                Primary Button
              </div>
              <div
                className="px-6 py-3 rounded-lg text-sm font-medium"
                style={{ backgroundColor: accentColor, color: '#111111' }}
              >
                Accent Button
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Shipping Settings */}
<div className="bg-white rounded-lg border border-gray-200 p-6">
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 bg-orange-100 rounded-lg">
      <Truck size={18} className="text-orange-600" />
    </div>

    <div>
      <h2 className="text-lg font-semibold text-gray-900">
        Shipping Zones
      </h2>

      <p className="text-sm text-gray-500">
        Control delivery fees and free-shipping thresholds.
      </p>
    </div>
  </div>

  {/* Existing zones */}
  <div className="space-y-3 mb-8">
    {shippingLoading ? (
      <p className="text-sm text-gray-500">
        Loading shipping zones...
      </p>
    ) : shippingZones.length === 0 ? (
      <p className="text-sm text-gray-500">
        No shipping zones configured.
      </p>
    ) : (
      shippingZones.map((zone) => (
        <div
          key={zone.id}
          className="border border-gray-200 rounded-lg p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium text-gray-900">
                {zone.name}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {zone.state || 'All other locations'}
              </p>

              {zone.description && (
                <p className="text-sm text-gray-500 mt-2 leading-6">
                  {zone.description}
                </p>
              )}

              <div className="flex gap-5 mt-3 text-sm">
                <span>
                  Shipping:{' '}
                  <strong>
                    ₦{Number(zone.shipping_fee).toLocaleString()}
                  </strong>
                </span>

                <span>
                  Free from:{' '}
                  <strong>
                    {zone.free_shipping_threshold
                      ? `₦${Number(
                          zone.free_shipping_threshold
                        ).toLocaleString()}`
                      : 'Never'}
                  </strong>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => deleteShippingZone(zone.id)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))
    )}
  </div>

  {/* Add zone */}
  <div className="border-t border-gray-200 pt-6">
    <h3 className="text-sm font-semibold text-gray-900 mb-4">
      Add Shipping Zone
    </h3>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <input
        placeholder="Zone name e.g. Abuja (Area A)"
        value={newZone.name}
        onChange={(e) =>
          setNewZone({
            ...newZone,
            name: e.target.value,
          })
        }
        className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg"
      />

      <input
        placeholder="State e.g. FCT"
        value={newZone.state}
        onChange={(e) =>
          setNewZone({
            ...newZone,
            state: e.target.value,
          })
        }
        className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg"
      />

      <input
        type="number"
        min="0"
        placeholder="Shipping fee"
        value={newZone.shipping_fee}
        onChange={(e) =>
          setNewZone({
            ...newZone,
            shipping_fee: e.target.value,
          })
        }
        className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg"
      />

      <input
        type="number"
        min="0"
        placeholder="Free shipping threshold"
        value={newZone.free_shipping_threshold}
        onChange={(e) =>
          setNewZone({
            ...newZone,
            free_shipping_threshold: e.target.value,
          })
        }
        className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg"
      />
    </div>

    <textarea
      rows={3}
      placeholder="Neighborhoods e.g. Apo, Kaura, Guzape, Prince & Princess..."
      value={newZone.description}
      onChange={(e) =>
        setNewZone({
          ...newZone,
          description: e.target.value,
        })
      }
      className="mt-4 w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg resize-none"
    />

    <button
      type="button"
      onClick={addShippingZone}
      disabled={shippingSaving}
      className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-[#111] text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
    >
      <Plus size={16} />
      {shippingSaving ? 'Adding...' : 'Add Shipping Zone'}
    </button>
  </div>
</div>

      {/* Payment Settings */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <CreditCard size={18} className="text-emerald-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Payment Settings</h2>
            <p className="text-sm text-gray-500">Your Paystack configuration (read-only)</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Paystack Public Key</label>
            <input
              type="text"
              value="••••••••pk_live_abc123"
              disabled
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Paystack Secret Key</label>
            <input
              type="text"
              value="••••••••sk_live_xxxxxxxx"
              disabled
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-2.5 bg-amber-400 text-[#111111] rounded-lg text-sm font-medium hover:bg-amber-500 transition-colors">
          <Save size={16} />
          Save Settings
        </button>
      </div>
    </div>
  );
}
