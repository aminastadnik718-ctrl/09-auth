interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onChange,
}: Props) {
  return (
    <div>
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
      >
        Previous
      </button>

      <span>
        {page} / {totalPages}
      </span>

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
      >
        Next
      </button>
    </div>
  );
}