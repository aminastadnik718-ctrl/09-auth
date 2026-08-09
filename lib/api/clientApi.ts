import type { Note, CreateNoteData } from "@/types/note";
import type { User } from "@/types/user";

import { api } from "./api";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface SessionResponse {
  success: boolean;
}

export async function register(
  email: string,
  password: string,
): Promise<User> {
  const { data } = await api.post("/auth/register", {
    email,
    password,
  });

  return data;
}

export async function login(
  email: string,
  password: string,
): Promise<User> {
  const { data } = await api.post("/auth/login", {
    email,
    password,
  });

  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function checkSession(): Promise<SessionResponse> {
  const { data } = await api.get("/auth/session");

  return data;
}

export async function getMe(): Promise<User> {
  const { data } = await api.get("/users/me");

  return data;
}

export async function updateMe(
  username: string,
): Promise<User> {
  const { data } = await api.patch("/users/me", {
    username,
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
  const { data } = await api.get("/notes", {
    params: {
      page,
      perPage,
      search,
      tag,
    },
  });

  return data;
}

export async function fetchNoteById(
  id: string,
): Promise<Note> {
  const { data } = await api.get(`/notes/${id}`);

  return data;
}

export async function createNote(
  note: CreateNoteData,
): Promise<Note> {
  const { data } = await api.post("/notes", note);

  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete(`/notes/${id}`);

  return data;
}