import Link from "next/link";
import css from "./NoteList.module.css";
import { Note } from "@/types/note";


interface Props {
  notes: Note[];
}

export default function NoteList({ notes }: Props) {
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
          </div>

          <p className={css.tag}>{note.tag}</p>

          <p className={css.content}>{note.content}</p>

          <p className={css.date}>
            {new Date(note.createdAt).toLocaleDateString()}
          </p>

          <div className={css.actions}>
            <Link href={`/notes/${note.id}`}>View details</Link>
          </div>
        </li>
      ))}
    </ul>
  );
}