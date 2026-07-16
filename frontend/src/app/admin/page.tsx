"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Gamepad2, FolderTree, Tags, Download, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { AdminLayoutShell } from "@/components/admin/AdminLayout";
import { useAdminAuthStore } from "@/store/admin-auth";
import { getDashboardStats } from "@/features/admin/api";
import type { DashboardStats } from "@/types/admin";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { isAuthenticated, hydrate } = useAdminAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!useAdminAuthStore.getState().isAuthenticated) {
      router.push("/admin/login");
      return;
    }
    getDashboardStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  if (!isAuthenticated) return null;

  return (
    <AdminLayoutShell>
      <div className="max-w-6xl">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Dashboard</h2>

        {loading ? (
          <div className="flex items-center gap-2 text-gray-500">
            <Loader2 size={18} className="animate-spin" />
            <span>Loading stats...</span>
          </div>
        ) : stats ? (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={Gamepad2} label="Games" value={stats.games_count} color="blue" />
              <StatCard icon={FolderTree} label="Categories" value={stats.categories_count} color="green" />
              <StatCard icon={Tags} label="Tags" value={stats.tags_count} color="purple" />
              <StatCard icon={Download} label="Downloads" value={stats.downloads_count} color="orange" />
            </div>

            {/* Recent games */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-medium text-gray-700 text-sm">Recent Games</h3>
                <Link
                  href="/admin/games"
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {stats.recent_games.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-gray-400">No games yet</p>
                ) : (
                  stats.recent_games.map((game) => (
                    <div
                      key={game.id}
                      className="px-5 py-3 flex items-center justify-between hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500 overflow-hidden">
                          {game.cover ? (
                            <img src={game.cover} alt="" className="w-full h-full object-cover" />
                          ) : (
                            "N/A"
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">{game.title}</p>
                          <p className="text-xs text-gray-400">{game.slug}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={game.status} />
                        <span className="text-xs text-gray-400">
                          {game.created_at ? new Date(game.created_at).toLocaleDateString() : "-"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Failed to load dashboard data.</p>
        )}
      </div>
    </AdminLayoutShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ size?: number | string; className?: string; strokeWidth?: number | string }>;
  label: string;
  value: number;
  color: "blue" | "green" | "purple" | "orange";
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg ${colorMap[color]}`}>
          <Icon size={20} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    published: "bg-green-100 text-green-700",
    draft: "bg-gray-100 text-gray-600",
    hidden: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[status] || "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}
