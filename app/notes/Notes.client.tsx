"use client";

import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import NoteList from "@/components/NoteList/NoteList";

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const perPage = 12;

  const updateSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", page, search],
    queryFn: () =>
      fetchNotes({
        page,
        perPage,
        search,
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

        <button onClick={() => setIsOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}

      {isError && (
        <p>Could not fetch the list of notes.</p>
      )}

      {data && data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <NoteForm onClose={() => setIsOpen(false)} />
        </Modal>
      )}
    </main>
  );
}