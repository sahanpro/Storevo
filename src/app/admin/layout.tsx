import { AdminSidebar } from "@/components/admin/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[70vh] rounded border bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}
