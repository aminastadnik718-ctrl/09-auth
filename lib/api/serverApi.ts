import type { AxiosResponse } from "axios";
import { cookies } from "next/headers";

import type { Note } from "@/types/note";
import type { User } from "@/types/user";

import { api } from "./api";

async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ");
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function checkSession(): Promise<
  AxiosResponse<{ success: boolean }>
> {
  const cookieHeader = await getCookieHeader();

  return api.get("/auth/session", {
    headers: {
      Cookie: cookieHeader,
    },
  });
}

export async function getMe(): Promise<User> {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get("/users/me", {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return data;
}

export async function fetchNotes({
  page,
  perPage,
  search,
  tag,
}: {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}): Promise<FetchNotesResponse> {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get("/notes", {
    params: {
      page,
      perPage,
      search,
      tag,
    },
    headers: {
      Cookie: cookieHeader,
    },
  });

  return data;
}

export async function fetchNoteById(
  id: string,
): Promise<Note> {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get(`/notes/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return data;
}