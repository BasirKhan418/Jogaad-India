"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { logoutUser } from "@/actions/logout";
import { useCallback } from "react";

export function RoleConflictBanner() {
  const params = useSearchParams();
  const router = useRouter();
  const show = params.get("logout_required") === "1";
  const currentRole = params.get("currentRole") || "current";
  const targetRole = params.get("targetRole") || "requested";

  const handleLogout = useCallback(async () => {
    await logoutUser();
    const url = new URL(window.location.href);
    url.searchParams.delete("logout_required");
    url.searchParams.delete("currentRole");
    url.searchParams.delete("targetRole");
    router.replace(url.pathname + (url.search ? url.search : ""));
  }, [router]);

  if (!show) return null;

  return (
    <div className="w-full bg-amber-50 border-b border-amber-200 text-amber-900">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-4">
        <p className="text-sm">
          You are currently logged in as <span className="font-semibold">{currentRole}</span>. To switch to <span className="font-semibold">{targetRole}</span>, please log out first.
        </p>
        <button onClick={handleLogout} className="text-sm px-3 py-1.5 rounded-md bg-amber-600 text-white hover:bg-amber-700">
          Logout now
        </button>
      </div>
    </div>
  );
}
