import axios from "axios";
import type { Note, CreateNoteData } from "@/types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
  },
});

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
}

export async function fetchNotes({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const { data } = await api.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      search,
    },
  });

  return data;
}

export async function createNote(
  note: CreateNoteData
): Promise<Note> {
  const { data } = await api.post<Note>("/notes", note);

  return data;
}

export async function deleteNote(id: string): Promise<Note> {
  const { data } = await api.delete<Note>(`/notes/${id}`);

  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const { data } = await api.get<Note>(`/notes/${id}`);

  return data;
}
