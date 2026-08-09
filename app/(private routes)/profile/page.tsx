import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { getMe } from "@/lib/api/serverApi";

import css from "./ProfilePage.module.css";

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "Your NoteHub profile.",
};

export default async function ProfilePage() {
  const user = await getMe();

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Profile</h1>

        <div className={css.avatar}>
          <Image
            src={user.avatar}
            alt={user.username}
            width={120}
            height={120}
          />
        </div>

        <div className={css.info}>
          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <p>
            <strong>Username:</strong> {user.username}
          </p>
        </div>

        <Link
          href="/profile/edit"
          className={css.editButton}
        >
          Edit profile
        </Link>
      </div>
    </main>
  );
}