"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";

import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";

export default function NotesClient() {
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", search, 1],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search,
      }),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading...</p>;

  if (isError || !data) {
    return <p>Could not fetch notes.</p>;
  }

  return (
    <main>
      <SearchBox
        value={search}
        onChange={setSearch}
      />

      <NoteList notes={data.notes} />
    </main>
  );
}