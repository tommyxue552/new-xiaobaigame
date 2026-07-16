"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayout";
import { useAdminAuthStore } from "@/store/admin-auth";
import { showToast } from "@/components/admin/Toaster";
import { getAdminDownloads, createDownload, updateDownload, deleteDownload, getAdminProviders } from "@/features/admin/api";

interface DItem { id: string; game_id: string; provider: { id: string; name: string; slug: string }; download_url: string; extract_code: string | null; priority: number; status: string; notes: string | null; created_at: string; }
interface PItem { id: string; name: string; slug: string; }

export default function AdminDownloadsPage() {
  const router = useRouter();
  const { isAuthenticated, hydrate } = useAdminAuthStore();
  const [items, setItems] = useState<DItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<DItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [providers, setProviders] = useState<PItem[]>([]);
  const [form, setForm] = useState({ game_id: "", provider_id: "", download_url: "", extract_code: "", priority: 0, status: "active", notes: "" });

  useEffect(() => { hydrate(); }, [hydrate]);

  const fetch = useCallback(async () => {
    setLoading(true);
    try { const r = await getAdminDownloads({ page, page_size: pageSize }); setItems(r.items); setTotal(r.total); }
    catch {} finally { setLoading(false); }
  }, [page, pageSize]);

  useEffect(() => {
    if (!useAdminAuthStore.getState().isAuthenticated) { router.push("/admin/login"); return; }
    fetch();
    getAdminProviders().then(setProviders).catch(() => {});
  }, [fetch, router]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const openCreate = () => { setEditing(null); setForm({ game_id: "", provider_id: "", download_url: "", extract_code: "", priority: 0, status: "active", notes: "" }); setModalOpen(true); };
  const openEdit = (d: DItem) => { setEditing(d); setForm({ game_id: d.game_id, provider_id: d.provider.id, download_url: d.download_url, extract_code: d.extract_code || "", priority: d.priority, status: d.status, notes: d.notes || "" }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.game_id.trim() || !form.provider_id.trim() || !form.download_url.trim()) return;
    setSaving(true);
    try {
      const data = { game_id: form.game_id, provider_id: form.provider_id, download_url: form.download_url, extract_code: form.extract_code || null, priority: form.priority, status: form.status, notes: form.notes || null };
      if (editing) { await updateDownload(editing.id, data); showToast("Download updated", "success"); }
      else { await createDownload(data); showToast("Download created", "success"); }
      setModalOpen(false); fetch();
    } catch (err: unknown) { showToast(err instanceof Error ? err.message : "Save failed", "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this download resource?")) return;
    try { await deleteDownload(id); showToast("Deleted", "success"); fetch(); }
    catch (err: unknown) { showToast(err instanceof Error ? err.message : "Delete failed", "error"); }
  };

  if (!isAuthenticated) return null;

  return (
    <AdminLayoutShell>
      <div className="max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Download Management</h2>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"><Plus size={16}/> Add Download</button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center gap-2 px-5 py-12 justify-center text-gray-500"><Loader2 size={18} className="animate-spin"/> Loading...</div>
          ) : items.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-gray-400">No downloads found</p>
          ) : (
            <>
              <table className="w-full text-sm"><thead><tr className="border-b border-gray-200 bg-gray-50 text-left">
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase">Provider</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase">URL</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase">Extract Code</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase">Priority</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase">Status</th>
                <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase w-24">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-700">{d.provider.name}</td>
                    <td className="px-5 py-3 text-gray-500 text-xs max-w-[200px] truncate">{d.download_url}</td>
                    <td className="px-5 py-3 text-gray-600">{d.extract_code || "-"}</td>
                    <td className="px-5 py-3 text-gray-600">{d.priority}</td>
                    <td className="px-5 py-3"><StatusBadge status={d.status}/></td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openEdit(d)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600" title="Edit"><Pencil size={15}/></button>
                        <button onClick={() => handleDelete(d.id)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600" title="Delete"><Trash2 size={15}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody></table>
              <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between text-sm">
                <span className="text-gray-500">Total {total}</span>
                <div className="flex items-center gap-2">
                  <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronLeft size={16}/></button>
                  <span className="text-gray-600">{page} / {totalPages}</span>
                  <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"><ChevronRight size={16}/></button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {modalOpen && <DownloadModal form={form} setForm={setForm} providers={providers} saving={saving} editing={!!editing} onSave={handleSave} onClose={() => setModalOpen(false)} />}
    </AdminLayoutShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = { active: "bg-green-100 text-green-700", expired: "bg-red-100 text-red-700", disabled: "bg-gray-100 text-gray-600" };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] || "bg-gray-100 text-gray-600"}`}>{status}</span>;
}

function DownloadModal({ form, setForm, providers, saving, editing, onSave, onClose }: {
  form: { game_id: string; provider_id: string; download_url: string; extract_code: string; priority: number; status: string; notes: string };
  setForm: (f: typeof form) => void; providers: PItem[]; saving: boolean; editing: boolean; onSave: () => void; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">{editing ? "Edit Download" : "Add Download"}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-400"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Game ID *</label>
            <input type="text" value={form.game_id} onChange={(e) => setForm({ ...form, game_id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="UUID" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Provider *</label>
            <select value={form.provider_id} onChange={(e) => setForm({ ...form, provider_id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select provider</option>
              {providers.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Download URL *</label>
            <input type="text" value={form.download_url} onChange={(e) => setForm({ ...form, download_url: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Extract Code</label>
              <input type="text" value={form.extract_code} onChange={(e) => setForm({ ...form, extract_code: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Priority</label>
              <input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="active">Active</option><option value="expired">Expired</option><option value="disabled">Disabled</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button onClick={onSave} disabled={saving} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg flex items-center gap-2">
            {saving && <Loader2 size={14} className="animate-spin"/>}{editing ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
