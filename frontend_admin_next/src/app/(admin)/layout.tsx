import { auth } from "@/auth";
import AdminLayoutClient from "@/layout/admin.layout.client";

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = async ({ children }) => {
    const session = await auth();
    return <AdminLayoutClient session={session}>{children}</AdminLayoutClient>;
};

export default AdminLayout