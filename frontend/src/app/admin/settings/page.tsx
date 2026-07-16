"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2 } from "lucide-react";
import { AdminLayoutShell } from "@/components/admin/AdminLayout";
import { useAdminAuthStore } from "@/store/admin-auth";
import { showToast } from "@/components/admin/Toaster";
import { getSettings, updateSettings } from "@/features/admin/api";

export default function AdminSettingsPage() {
  const router = useRouter();
  const { isAuthenticated, hydrate } = useAdminAuthStore();
  const [settings, setSettings] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    if (!useAdminAuthStore.getState().isAuthenticated) { router.push("/admin/login"); return; }
    getSettings().then((s) => { setSettings(s); setLoading(false); }).catch(() => setLoading(false));
  }, [router]);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(settings);
      showToast("Settings saved", "success");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Save failed", "error");
    } finally { setSaving(false); }
  };

  if (!isAuthenticated) return null;

  const fields = [
    { key: "site_name", label: "Site Name", type: "text", placeholder: "xiaobaigame" },
    { key: "site_logo", label: "Site Logo URL", type: "text", placeholder: "https://..." },
    { key: "site_description", label: "Site Description", type: "textarea", placeholder: "A game resource sharing platform" },
    { key: "seo_title", label: "SEO Title", type: "text" },
    { key: "seo_keywords", label: "SEO Keywords", type: "text", placeholder: "game, download, resources" },
    { key: "seo_description", label: "SEO Description", type: "textarea" },
    { key: "icp_number", label: "ICP Record Number (reserved)", type: "text", placeholder: "e.g. ICP-12345678" },
    { key: "analytics_code", label: "Analytics Code (reserved)", type: "textarea", placeholder: "Google Analytics / Baidu Tongji code" },
  ];

  return (
    <AdminLayoutShell>
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">System Settings</h2>
          <button onClick={handleSave} disabled={saving || loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg">
            {saving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16}/>}
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-gray-500"><Loader2 size={18} className="animate-spin"/> Loading...</div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea
                    value={settings[f.key] || ""}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                    placeholder={f.placeholder}
                  />
                ) : (
                  <input
                    type="text"
                    value={settings[f.key] || ""}
                    onChange={(e) => handleChange(f.key, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={f.placeholder}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayoutShell>
  );
}
