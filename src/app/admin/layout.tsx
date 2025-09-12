import { AdminLayoutClient } from "./AdminLayoutClient";
import { AuthProvider } from "@/contexts/AuthProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </AuthProvider>
  );
}
