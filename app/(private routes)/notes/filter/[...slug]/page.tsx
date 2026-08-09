import type { Metadata } from "next";
import {
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api/serverApi";
import { getQueryClient } from "@/lib/getQueryClient";

import NotesClient from "./Notes.client";

interface Props {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const tag = slug[0] === "all" ? "All notes" : slug[0];

  return {
    title: `${tag} | NoteHub`,
    description: `Notes filtered by ${tag}.`,
    openGraph: {
      title: `${tag} | NoteHub`,
      description: `Notes filtered by ${tag}.`,
      url: `https://notehub.com/notes/filter/${slug.join("/")}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub",
        },
      ],
    },
  };
}

export default async function NotesPage({
  params,
}: Props) {
  const { slug } = await params;

  const tag = slug[0] === "all" ? undefined : slug[0];

  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, "", tag],
    queryFn: () =>
      fetchNotes({
        page: 1,
        perPage: 12,
        search: "",
        tag,
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}