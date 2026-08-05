"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";

import css from "./NoteForm.module.css";

import { createNote } from "@/lib/api";
import type { CreateNoteData } from "@/types/note";

interface NoteFormProps {
  onClose: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Minimum 3 characters")
    .max(50, "Maximum 50 characters")
    .required("Required"),

  content: Yup.string().max(
    500,
    "Maximum 500 characters"
  ),

  tag: Yup.string()
    .oneOf([
      "Todo",
      "Work",
      "Personal",
      "Meeting",
      "Shopping",
    ])
    .required("Required"),
});

export default function NoteForm({
  onClose,
}: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });

      onClose();
    },
  });

  const initialValues: CreateNoteData = {
    title: "",
    content: "",
    tag: "Todo",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => mutation.mutate(values)}
    >
      <Form className={css.form}>
        <label className={css.label}>
          Title

          <Field
            name="title"
            className={css.input}
          />

          <ErrorMessage
            name="title"
            component="span"
            className={css.error}
          />
        </label>

        <label className={css.label}>
          Content

          <Field
            as="textarea"
            rows={5}
            name="content"
            className={css.textarea}
          />

          <ErrorMessage
            name="content"
            component="span"
            className={css.error}
          />
        </label>

        <label className={css.label}>
          Tag

          <Field
            as="select"
            name="tag"
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>

          <ErrorMessage
            name="tag"
            component="span"
            className={css.error}
          />
        </label>

        <div className={css.actions}>
          <button
            type="submit"
            className={css.button}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Create"}
          </button>

          <button
            type="button"
            className={css.button}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </Form>
    </Formik>
  );
}