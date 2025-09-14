import { redirect } from "next/navigation";
import { getServerAuth } from "@/lib/auth-middleware";
import { AdminLayoutClient } from "./AdminLayoutClient";
import { AuthProvider } from "@/contexts/AuthProvider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side auth check
  const user = await getServerAuth();

  if (!user) {
    redirect("/login");
  }

  if (user.role !== "admin") {
    redirect("/");
  }

  return (
    <AuthProvider>
      <AdminLayoutClient user={user}>{children}</AdminLayoutClient>
    </AuthProvider>
  );
}
