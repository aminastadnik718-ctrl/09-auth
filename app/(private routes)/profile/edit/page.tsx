"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getMe, updateMe } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";

import css from "./EditProfilePage.module.css";

export default function EditProfilePage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const [username, setUsername] = useState(user?.username ?? "");
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!user) {
      getMe()
        .then((currentUser) => {
          setUser(currentUser);
          setUsername(currentUser.username);
        })
        .catch(() => {
          setError("Could not load profile");
        });
    }
  }, [user, setUser]);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");
    setIsPending(true);

    try {
      const updatedUser = await updateMe(username);

      setUser(updatedUser);
      router.push("/profile");
      router.refresh();
    } catch {
      setError("Could not update profile");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} onSubmit={handleSubmit}>
        <h1 className={css.formTitle}>Edit profile</h1>

        {user?.avatar && (
          <Image
            src={user.avatar}
            alt={user.username}
            width={120}
            height={120}
          />
        )}

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            value={user?.email ?? ""}
            readOnly
            className={css.input}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="username">Username</label>

          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            className={css.input}
            required
          />
        </div>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.submitButton}
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            className={css.cancelButton}
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}