import css from "./layout.module.css";

interface LayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export default function FilterLayout({
  children,
  sidebar,
}: LayoutProps) {
  return (
    <section className={css.container}>
      <aside className={css.sidebar}>
        <h2>SIDEBAR</h2>
        {sidebar}
      </aside>

      <div className={css.notesWrapper}>{children}</div>
    </section>
  );
}