"use client";

import { useAuth } from "@/stores/auth-store";

export function LogoutButton() {
  const { logout, user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-700">Welcome, {user.name}</span>
      <button
        onClick={logout}
        className="text-sm text-gray-500 hover:text-gray-700 underline"
      >
        Logout
      </button>
    </div>
  );
}
