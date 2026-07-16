"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayout";
import { useAdminAuthStore } from "@/store/admin-auth";
import { showToast } from "@/components/admin/Toaster";
import { getAdminTags, createTag, updateTag, deleteTag } from "@/features/admin/api";

interface TagItem { id: string; name: string; slug: string; game_count: number; created_at: string; }

export default function AdminTagsPage() {
  const router = useRouter();
  const { isAuthenticated, hydrate } = useAdminAuthStore();
  const [tags, setTags] = useState<TagItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<TagItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "" });

  useEffect(() => { hydrate(); }, [hydrate]);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | boolean | undefined> = { page, page_size: pageSize };
      if (keyword) params.keyword = keyword;
      const r = await getAdminTags(params);
      setTags(r.items); setTotal(r.total);
    } catch {} finally { setLoading(false); }
  }, [page, pageSize, keyword]);

  useEffect(() => {
    if (!useAdminAuthStore.getState().isAuthenticated) { router.push("/admin/login"); return; }
    fetch();
  }, [fetch, router]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const openCreate = () => { setEditing(null); setForm({ name: "", slug: "" }); setModalOpen(true); };
  const openEdit = (t: TagItem) => { setEditing(t); setForm({ name: t.name, slug: t.slug }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editing) { await updateTag(editing.id, { name: form.name, slug: form.slug || null }); showToast("Tag updated", "success"); }
      else { await createTag({ name: form.name, slug: form.slug || null }); showToast("Tag created", "success"); }
      setModalOpen(false); fetch();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Save failed", "error");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tag?")) return;
    try { await deleteTag(id); showToast("Tag deleted", "success"); fetch(); }
    catch (err: unknown) { showToast(err instanceof Error ? err.message : "Delete failed", "error"); }
  };

  if (!isAuthenticated) return null;

  return (
    <AdminLayoutShell>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Tag Management</h2>
          <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg">
            <Plus size={16} /> Add Tag
          </button>
        </div>
        <div className="mb-4">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search tags..." value={keyword}
              onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center gap-2 px-5 py-12 justify-center text-gray-500"><Loader2 size={18} className="animate-spin"/> Loading...</div>
          ) : tags.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-gray-400">No tags found</p>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gray-200 bg-gray-50 text-left">
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase">Name</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase">Slug</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase">Games</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase">Created</th>
                  <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase w-24">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {tags.map((tag) => (
                    <tr key={tag.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3 font-medium text-gray-800">{tag.name}</td>
                      <td className="px-5 py-3 text-gray-500">{tag.slug}</td>
                      <td className="px-5 py-3 text-gray-600">{tag.game_count}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{new Date(tag.created_at).toLocaleDateString()}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(tag)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600" title="Edit"><Pencil size={15}/></button>
                          <button onClick={() => handleDelete(tag.id)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600" title="Delete"><Trash2 size={15}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between text-sm">
                <span className="text-gray-500">Total {total} tags</span>
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800">{editing ? "Edit Tag" : "Add Tag"}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded hover:bg-gray-100 text-gray-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Slug (auto if empty)</label>
                <input type="text" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name.trim()}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg flex items-center gap-2">
                {saving && <Loader2 size={14} className="animate-spin"/>}
                {editing ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayoutShell>
  );
}
