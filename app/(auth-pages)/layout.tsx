export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-screen w-full">{children}</div>;
}
