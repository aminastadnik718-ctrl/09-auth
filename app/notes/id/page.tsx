import {
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

import { fetchNoteById } from "@/lib/api";
import { getQueryClient } from "@/lib/getQueryClient";

import NoteDetailsClient from "@/app/notes/id/NoteDetails.client";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function NoteDetailsPage({ params }: Props) {
  const { id } = await params;

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}