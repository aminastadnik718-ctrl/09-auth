"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthNavigation() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );
  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      clearIsAuthenticated();
      router.push("/sign-in");
      router.refresh();
    }
  };

  if (!isAuthenticated) {
    return (
      <nav aria-label="Authentication Navigation">
        <ul>
          <li>
            <Link href="/sign-in">Login</Link>
          </li>

          <li>
            <Link href="/sign-up">Register</Link>
          </li>
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label="Authentication Navigation">
      <ul>
        <li>
          <span>{user?.username ?? user?.email}</span>
        </li>

        <li>
          <Link href="/profile">Profile</Link>
        </li>

        <li>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}