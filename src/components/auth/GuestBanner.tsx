export function GuestBanner() {
  return (
    <div
      className="h-8 flex items-center justify-center text-[12px] font-medium"
      style={{ background: 'var(--color-accent-muted)', color: 'var(--color-accent)', borderBottom: '1px solid var(--color-border)' }}
    >
      Guest view — read only
    </div>
  );
}
