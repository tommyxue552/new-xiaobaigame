"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayout";
import { useAdminAuthStore } from "@/store/admin-auth";
import { showToast } from "@/components/admin/Toaster";
import { getAdminProviders, createProvider, updateProvider, deleteProvider } from "@/features/admin/api";

interface PItem {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
  website_url: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

function ProviderModal({
  form, setForm, saving, editing, onSave, onClose,
}: {
  form: { name: string; slug: string; icon_url: string; website_url: string; sort_order: number; is_active: boolean };
  setForm: (f: { name: string; slug: string; icon_url: string; website_url: string; sort_order: number; is_active: boolean }) => void;
  saving: boolean;
  editing: boolean;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">{editing ? "Edit Provider" : "Add Provider"}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-400">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Slug (auto if empty)</label>
            <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Website URL</label>
            <input type="text" value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Icon URL</label>
            <input type="text" value={form.icon_url} onChange={(e) => setForm({ ...form, icon_url: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-gray-600">Enabled</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button onClick={onSave} disabled={saving || !form.name.trim()} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg flex items-center gap-2">
            {saving && <Loader2 size={14} className="animate-spin" />}
            {editing ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminProvidersPage() {
  const router = useRouter();
  const { isAuthenticated, hydrate } = useAdminAuthStore();
  const [items, setItems] = useState<PItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    icon_url: "",
    website_url: "",
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => { hydrate(); }, [hydrate]);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try { setItems(await getAdminProviders()); } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!useAdminAuthStore.getState().isAuthenticated) { router.push("/admin/login"); return; }
    fetchItems();
  }, [fetchItems, router]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", slug: "", icon_url: "", website_url: "", sort_order: 0, is_active: true });
    setModalOpen(true);
  };

  const openEdit = (p: PItem) => {
    setEditing(p);
    setForm({
      name: p.name,
      slug: p.slug,
      icon_url: p.icon_url || "",
      website_url: p.website_url || "",
      sort_order: p.sort_order,
      is_active: p.is_active,
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      const data = {
        name: form.name,
        slug: form.slug || null,
        icon_url: form.icon_url || null,
        website_url: form.website_url || null,
        sort_order: form.sort_order,
        is_active: form.is_active,
      };
      if (editing) {
        await updateProvider(editing.id, data);
        showToast("Provider updated", "success");
      } else {
        await createProvider(data);
        showToast("Provider created", "success");
      }
      setModalOpen(false);
      fetchItems();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this provider?")) return;
    try {
      await deleteProvider(id);
      showToast("Deleted", "success");
      fetchItems();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  };

  if (!isAuthenticated) return null;

  return (
    <AdminLayoutShell>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Provider Management</h2>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
          >
            <Plus size={16} /> Add Provider
          </button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center gap-2 px-5 py-12 justify-center text-gray-500">
              <Loader2 size={18} className="animate-spin" /> Loading...
            </div>
          ) : items.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-gray-400">No providers found</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left">
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase">Name</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase">Slug</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase">Sort</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase">Status</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase">Website</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase w-24">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-800">{p.name}</td>
                    <td className="px-5 py-3 text-gray-500">{p.slug}</td>
                    <td className="px-5 py-3 text-gray-600">{p.sort_order}</td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                        {p.is_active ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs max-w-[150px] truncate">{p.website_url || "-"}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600" title="Edit">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600" title="Delete">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modalOpen && (
        <ProviderModal
          form={form}
          setForm={setForm}
          saving={saving}
          editing={!!editing}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </AdminLayoutShell>
  );
}
