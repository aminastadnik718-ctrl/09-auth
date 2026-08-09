import { cookies } from "next/headers";

import type { Note } from "@/types/note";

import { api } from "./api";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

async function getCookieHeader() {
  const cookieStore = await cookies();

  return cookieStore.toString();
}

export async function fetchNotes({
  page,
  perPage,
  search,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> {
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

export async function getMe() {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get("/users/me", {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return data;
}

export async function checkSession() {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get("/auth/session", {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return data;
}