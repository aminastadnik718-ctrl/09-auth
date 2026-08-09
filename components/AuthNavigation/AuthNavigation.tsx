"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

export default function AuthNavigation() {
  const router = useRouter();

  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated,
  );

  const clearIsAuthenticated = useAuthStore(
    (state) => state.clearIsAuthenticated,
  );

  const handleLogout = async () => {
    try {
      await logout();
      clearIsAuthenticated();
      router.push("/sign-in");
    } catch {
      clearIsAuthenticated();
      router.push("/sign-in");
    }
  };

  if (isAuthenticated) {
    return (
      <>
        <li>
          <Link href="/profile">Profile</Link>
        </li>

        <li>
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </li>
      </>
    );
  }

  return (
    <>
      <li>
        <Link href="/sign-up">Register</Link>
      </li>

      <li>
        <Link href="/sign-in">Login</Link>
      </li>
    </>
  );
}