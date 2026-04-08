import { Outlet, Navigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const AdminLayout = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Protection logic: Must be logged in AND must be an ADMIN
    if (!token || role !== "ADMIN") {
        return <Navigate to="/login" replace />;
    }

    return (
        <SidebarProvider style={{ "--sidebar-width": "13rem" } as React.CSSProperties}>
            <AppSidebar />
            <SidebarInset className="min-h-screen bg-gray-50 flex-1">
                <AdminHeader />
                <main className="pt-8 pb-10 px-8">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default AdminLayout;
