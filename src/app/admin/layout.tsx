import { getServerAuth } from "@/lib/auth";
import { AdminLayoutClient } from "./AdminLayoutClient";
import { AuthProvider } from "@/contexts/AuthProvider";
import { DisplayProvider } from "@/contexts/DisplayContext";

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
      <DisplayProvider>
        <AdminLayoutClient
          user={
            user
              ? {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  role: user.role,
                  avatar: user.avatar,
                }
              : undefined
          }
        >
          {children}
        </AdminLayoutClient>
      </DisplayProvider>
    </AuthProvider>
  );
}
