export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-deep-black text-foreground relative overflow-x-hidden">
        {children}
    </div>
  );
}
