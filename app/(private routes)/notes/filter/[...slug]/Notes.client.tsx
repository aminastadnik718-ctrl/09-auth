"use client";

import Link from "next/link";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api/clientApi";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";

interface NotesClientProps {
  tag?: string;
}

export default function NotesClient({
  tag,
}: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");

  const perPage = 12;

  const updateSearch = useDebouncedCallback(
    (value: string) => {
      setSearch(value);
      setPage(1);
    },
    500,
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search, tag],
    queryFn: () =>
      fetchNotes({
        page,
        perPage,
        search,
        tag,
      }),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });

  return (
    <main>
      <header>
        <SearchBox
          value={inputValue}
          onChange={(value) => {
            setInputValue(value);
            updateSearch(value);
          }}
        />

        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={page}
            pageCount={data.totalPages}
            onPageChange={setPage}
          />
        )}

        <Link href="/notes/action/create">
          Create note +
        </Link>
      </header>

      {isLoading && <p>Loading...</p>}

      {isError && (
        <p>Could not fetch the list of notes.</p>
      )}

      {data && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}

      {data && data.notes.length === 0 && !isLoading && (
        <p>No notes found.</p>
      )}
    </main>
  );
}