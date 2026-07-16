"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, ChevronRight, ChevronDown, FolderTree } from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayout";
import { useAdminAuthStore } from "@/store/admin-auth";
import { showToast } from "@/components/admin/Toaster";
import {
  getAdminCategories, createCategory, updateCategory, deleteCategory,
} from "@/features/admin/api";

interface CatNode {
  id: string; name: string; slug: string; description: string | null;
  parent_id: string | null; sort_order: number; game_count: number;
  children: CatNode[];
}

export default function AdminCategoriesPage() {
  const router = useRouter();
  const { isAuthenticated, hydrate } = useAdminAuthStore();
  const [tree, setTree] = useState<CatNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CatNode | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "", description: "", parent_id: "", sort_order: 0 });

  useEffect(() => { hydrate(); }, [hydrate]);

  const fetch = useCallback(async () => {
    setLoading(true);
    try { setTree(await getAdminCategories()); } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!useAdminAuthStore.getState().isAuthenticated) { router.push("/admin/login"); return; }
    fetch();
  }, [fetch, router]);

  const openCreate = (parentId: string | null = null) => {
    setEditing(null);
    setForm({ name: "", slug: "", description: "", parent_id: parentId || "", sort_order: 0 });
    setModalOpen(true);
  };

  const openEdit = (c: CatNode) => {
    setEditing(c);
    setForm({ name: c.name, slug: c.slug, description: c.description || "", parent_id: c.parent_id || "", sort_order: c.sort_order });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        await updateCategory(editing.id, { name: form.name, slug: form.slug || null, description: form.description || null, parent_id: form.parent_id || null, sort_order: form.sort_order });
        showToast("Category updated", "success");
      } else {
        await createCategory({ name: form.name, slug: form.slug || null, description: form.description || null, parent_id: form.parent_id || null, sort_order: form.sort_order });
        showToast("Category created", "success");
      }
      setModalOpen(false);
      fetch();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Save failed", "error");
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Child categories will become top-level.")) return;
    try { await deleteCategory(id); showToast("Category deleted", "success"); fetch(); }
    catch (err: unknown) { showToast(err instanceof Error ? err.message : "Delete failed", "error"); }
  };

  if (!isAuthenticated) return null;

  return (
    <AdminLayoutShell>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Category Management</h2>
          <button onClick={() => openCreate(null)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg">
            <Plus size={16} /> Add Category
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          {loading ? (
            <div className="flex items-center gap-2 px-5 py-12 justify-center text-gray-500">
              <Loader2 size={18} className="animate-spin" /> Loading...
            </div>
          ) : tree.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-gray-400">No categories</p>
          ) : (
            <div className="py-2">
              {tree.map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  onEdit={openEdit}
                  onDelete={handleDelete}
                  onAddChild={openCreate}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <CategoryModal
          form={form} setForm={setForm} tree={tree}
          saving={saving} editing={!!editing}
          onSave={handleSave} onClose={() => setModalOpen(false)}
        />
      )}
    </AdminLayoutShell>
  );
}

function TreeNode({
  node, onEdit, onDelete, onAddChild, depth = 0,
}: {
  node: CatNode; onEdit: (c: CatNode) => void; onDelete: (id: string) => void;
  onAddChild: (parentId: string) => void; depth?: number;
}) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className={`flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 group border-b border-gray-50`}
        style={{ paddingLeft: `${16 + depth * 24}px` }}
      >
        <button
          onClick={() => setExpanded(!expanded)}
          className={`p-0.5 rounded ${hasChildren ? "hover:bg-gray-100" : "opacity-30 cursor-default"}`}
          disabled={!hasChildren}
        >
          {hasChildren ? (expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />) : <FolderTree size={14} />}
        </button>
        <span className="text-sm font-medium text-gray-700 flex-1">{node.name}</span>
        <span className="text-xs text-gray-400">{node.game_count} games</span>
        <span className="text-xs text-gray-300">{node.slug}</span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          <button onClick={() => onAddChild(node.id)} className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-blue-600" title="Add child">
            <Plus size={13} />
          </button>
          <button onClick={() => onEdit(node)} className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-blue-600" title="Edit">
            <Pencil size={13} />
          </button>
          <button onClick={() => onDelete(node.id)} className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-600" title="Delete">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      {expanded && hasChildren && (
        <div>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} onEdit={onEdit} onDelete={onDelete} onAddChild={onAddChild} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryModal({
  form, setForm, tree, saving, editing, onSave, onClose,
}: {
  form: { name: string; slug: string; description: string; parent_id: string; sort_order: number };
  setForm: (f: typeof form) => void;
  tree: CatNode[];
  saving: boolean; editing: boolean;
  onSave: () => void; onClose: () => void;
}) {
  const flatCats = flattenCategories(tree).filter((c) => c.id !== (editing ? undefined : undefined));
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">{editing ? "Edit Category" : "Add Category"}</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-gray-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
            <input type="text" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Slug (auto if empty)</label>
            <input type="text" value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Parent Category</label>
            <select value={form.parent_id}
              onChange={(e) => setForm({ ...form, parent_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">None (Top Level)</option>
              {flatCats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <textarea value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button onClick={onSave} disabled={saving || !form.name.trim()}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg flex items-center gap-2">
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
    for (const n of list) {
      result.push({ ...n, name: `${"--".repeat(depth)} ${n.name}` } as CatNode);
      if (n.children?.length) walk(n.children, depth + 1);
    }
  }
  walk(nodes, 0);
  return result;
}
