"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createNote } from "@/lib/api/clientApi";
import { useNoteStore } from "@/lib/store/noteStore";
import type { CreateNoteData } from "@/types/note";

import css from "./NoteForm.module.css";

const tags = [
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
];

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { draft, setDraft, clearDraft } = useNoteStore();

  const mutation = useMutation({
    mutationFn: createNote,

    onSuccess: () => {
      clearDraft();

      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      router.push("/notes/filter/all");
    },
  });

  const handleSubmit = (formData: FormData) => {
    const title = String(formData.get("title") ?? "");
    const content = String(formData.get("content") ?? "");
    const tag = String(formData.get("tag") ?? "Todo");

    if (title.trim().length < 3 || title.trim().length > 50) {
      return;
    }

    if (content.length > 500) {
      return;
    }

    const note: CreateNoteData = {
      title: title.trim(),
      content,
      tag,
    };

    mutation.mutate(note);
  };

  return (
    <form className={css.form} action={handleSubmit}>
      <label className={css.formGroup}>
        Title
        <input
          name="title"
          defaultValue={draft.title}
          className={css.input}
          onChange={(event) =>
            setDraft({ title: event.target.value })
          }
        />
      </label>

      <label className={css.formGroup}>
        Content
        <textarea
          name="content"
          rows={5}
          defaultValue={draft.content}
          className={css.textarea}
          onChange={(event) =>
            setDraft({ content: event.target.value })
          }
        />
      </label>

      <label className={css.formGroup}>
        Tag
        <select
          name="tag"
          defaultValue={draft.tag}
          className={css.select}
          onChange={(event) =>
            setDraft({ tag: event.target.value })
          }
        >
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </label>

      <div className={css.actions}>
        <button
          type="submit"
          className={css.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Create"}
        </button>

        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}