interface Props {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function SettingsSection({
  title,
  description,
  children,
}: Props) {
  return (
    <section>
      <h2 className="text-xl font-semibold">{title}</h2>

      {description && <p className="aurora-text-muted mt-1">{description}</p>}

      <div className="aurora-card mt-4 p-5 space-y-4">{children}</div>
    </section>
  );
}
