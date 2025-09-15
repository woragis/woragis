import { getServerAuth } from "@/lib/auth-middleware";
import { AdminLayoutClient } from "./AdminLayoutClient";
import { AuthProvider } from "@/contexts/AuthProvider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth check - but don't redirect immediately
  // Let the client-side handle the final auth decisions
  const user = await getServerAuth();

  return (
    <AuthProvider>
      <AdminLayoutClient user={user}>{children}</AdminLayoutClient>
    </AuthProvider>
  );
}
