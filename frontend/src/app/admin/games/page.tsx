"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Search, Pencil, Trash2, Loader2, ChevronLeft, ChevronRight,
  X,
} from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayout";
import { useAdminAuthStore } from "@/store/admin-auth";
import { showToast } from "@/components/admin/Toaster";
import {
  getAdminGames,
  createGame,
  updateGame,
  deleteGame,
  getAdminCategories,
  getAdminTags,
} from "@/features/admin/api";
import type { AdminGameCreate, AdminGameUpdate } from "@/types/admin";

interface GameItem {
  id: string; title: string; title_en: string | null; slug: string; cover: string | null;
  summary: string | null;
  category: { id: string; name: string; slug: string } | null;
  status: string; published_at: string | null;
  view_count: number; download_count: number;
  tags: { id: string; name: string; slug: string }[];
  created_at: string;
}

interface CatNode {
  id: string; name: string; slug: string; children: CatNode[];
}

interface TagItem {
  id: string; name: string; slug: string;
}

export default function AdminGamesPage() {
  const router = useRouter();
  const { isAuthenticated, hydrate } = useAdminAuthStore();

  const [games, setGames] = useState<GameItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(20);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<GameItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", title_en: "", slug: "", summary: "", content: "",
    cover: "", category_id: "", status: "draft",
    seo_title: "", seo_keywords: "", seo_description: "",
    tag_ids: [] as string[],
  });

  // Reference data
  const [categories, setCategories] = useState<CatNode[]>([]);
  const [tags, setTags] = useState<TagItem[]>([]);

  useEffect(() => { hydrate(); }, [hydrate]);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number | boolean | undefined> = { page, page_size: pageSize };
      if (keyword) params.keyword = keyword;
      const result = await getAdminGames(params);
      setGames(result.items);
      setTotal(result.total);
    } catch { /* handled */ }
    finally { setLoading(false); }
  }, [page, pageSize, keyword]);

  useEffect(() => {
    if (!useAdminAuthStore.getState().isAuthenticated) {
      router.push("/admin/login");
      return;
    }
    fetchGames();
    getAdminCategories().then(setCategories).catch(() => {});
    getAdminTags({ page_size: 200 }).then((r) => setTags(r.items)).catch(() => {});
  }, [fetchGames, router]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const openCreate = () => {
    setEditingGame(null);
    setForm({ title: "", title_en: "", slug: "", summary: "", content: "", cover: "", category_id: "", status: "draft", seo_title: "", seo_keywords: "", seo_description: "", tag_ids: [] });
    setModalOpen(true);
  };

  const openEdit = (game: GameItem) => {
    setEditingGame(game);
    setForm({
      title: game.title, title_en: game.title_en || "", slug: game.slug,
      summary: game.summary || "", content: "", cover: game.cover || "",
      category_id: game.category?.id || "", status: game.status,
      seo_title: "", seo_keywords: "", seo_description: "",
      tag_ids: game.tags.map((t) => t.id),
    });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      const data: AdminGameCreate = {
        title: form.title,
        title_en: form.title_en || null,
        slug: form.slug || null,
        summary: form.summary || null,
        cover: form.cover || null,
        category_id: form.category_id || null,
        status: form.status,
        seo_title: form.seo_title || null,
        seo_keywords: form.seo_keywords || null,
        seo_description: form.seo_description || null,
        tag_ids: form.tag_ids,
      };
      if (editingGame) {
        await updateGame(editingGame.id, data as AdminGameUpdate);
        showToast("Game updated", "success");
      } else {
        await createGame(data);
        showToast("Game created", "success");
      }
      setModalOpen(false);
      fetchGames();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this game?")) return;
    try {
      await deleteGame(id);
      showToast("Game deleted", "success");
      fetchGames();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Delete failed", "error");
    }
  };

  if (!isAuthenticated) return null;

  return (
    <AdminLayoutShell>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Game Management</h2>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            <Plus size={16} /> Add Game
          </button>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search games..."
              value={keyword}
              onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center gap-2 px-5 py-12 text-gray-500 justify-center">
              <Loader2 size={18} className="animate-spin" /> Loading...
            </div>
          ) : games.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-gray-400">No games found</p>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left">
                    <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase">Game</th>
                    <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase">Category</th>
                    <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase">Status</th>
                    <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase">Downloads</th>
                    <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase">Created</th>
                    <th className="px-5 py-3 font-medium text-gray-500 text-xs uppercase w-24">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {games.map((game) => (
                    <tr key={game.id} className="hover:bg-gray-50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-gray-200 flex-shrink-0 overflow-hidden">
                            {game.cover && <img src={game.cover} alt="" className="w-full h-full object-cover" />}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{game.title}</p>
                            <p className="text-xs text-gray-400">{game.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-gray-600">{game.category?.name || "-"}</td>
                      <td className="px-5 py-3">
                        <StatusBadge status={game.status} />
                      </td>
                      <td className="px-5 py-3 text-gray-600">{game.download_count}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">
                        {game.created_at ? new Date(game.created_at).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEdit(game)}
                            className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(game.id)}
                            className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="px-5 py-3 border-t border-gray-200 flex items-center justify-between text-sm">
                <span className="text-gray-500">Total {total} games</span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-gray-600">
                    {page} / {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {modalOpen && (
        <GameFormModal
          form={form}
          setForm={setForm}
          categories={categories}
          tags={tags}
          saving={saving}
          editing={!!editingGame}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </AdminLayoutShell>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    published: "bg-green-100 text-green-700",
    draft: "bg-gray-100 text-gray-600",
    hidden: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] || "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}

function GameFormModal({
  form, setForm, categories, tags, saving, editing, onSave, onClose,
}: {
  form: { title: string; title_en: string; slug: string; summary: string; content: string; cover: string; category_id: string; status: string; seo_title: string; seo_keywords: string; seo_description: string; tag_ids: string[] };
  setForm: (f: typeof form) => void;
  categories: CatNode[];
  tags: TagItem[];
  saving: boolean;
  editing: boolean;
  onSave: () => void;
  onClose: () => void;
}) {
  const flatCats = flattenCategories(categories);
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">{editing ? "Edit Game" : "Add Game"}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-400">
            <X size={18} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
              <input
                type="text" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">English Title</label>
              <input
                type="text" value={form.title_en}
                onChange={(e) => setForm({ ...form, title_en: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Slug (auto if empty)</label>
              <input
                type="text" value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">None</option>
                {flatCats.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Cover URL</label>
              <input
                type="text" value={form.cover}
                onChange={(e) => setForm({ ...form, cover: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://..."
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Summary</label>
            <textarea
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Tags</label>
            <div className="flex flex-wrap gap-1.5 border border-gray-300 rounded-lg p-2 min-h-[36px]">
              {tags.slice(0, 40).map((tag) => {
                const checked = form.tag_ids.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      setForm({
                        ...form,
                        tag_ids: checked
                          ? form.tag_ids.filter((id) => id !== tag.id)
                          : [...form.tag_ids, tag.id],
                      });
                    }}
                    className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${checked ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    {tag.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SEO section */}
          <details className="border border-gray-200 rounded-lg">
            <summary className="px-4 py-2 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-50">
              SEO Information
            </summary>
            <div className="p-4 space-y-3 border-t border-gray-200">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">SEO Title</label>
                <input
                  type="text" value={form.seo_title}
                  onChange={(e) => setForm({ ...form, seo_title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">SEO Keywords</label>
                <input
                  type="text" value={form.seo_keywords}
                  onChange={(e) => setForm({ ...form, seo_keywords: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">SEO Description</label>
                <textarea
                  value={form.seo_description}
                  onChange={(e) => setForm({ ...form, seo_description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </details>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving || !form.title.trim()}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg flex items-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            {editing ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

function flattenCategories(nodes: CatNode[]): CatNode[] {
  const result: CatNode[] = [];
  function walk(list: CatNode[], depth: number) {
    for (const node of list) {
      result.push({ ...node, name: `${"--".repeat(depth)} ${node.name}` });
      if (node.children?.length) walk(node.children, depth + 1);
    }
  }
  walk(nodes, 0);
  return result;
}
