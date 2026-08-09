"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api/clientApi";

import Modal from "@/components/Modal/Modal";
import NoteDetails from "@/components/NoteDetails/NoteDetails";

export default function NotePreviewClient() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (isError || !note) {
    return <p>Something went wrong.</p>;
  }

  return (
    <Modal onClose={() => router.back()}>
      <NoteDetails note={note} />
    </Modal>
  );
}