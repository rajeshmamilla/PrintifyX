import { Outlet, Navigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

const AdminLayout = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // Protection logic: Must be logged in AND must be an ADMIN
    if (!token || role !== "ADMIN") {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="ml-64">
                <AdminHeader />
                <main className="pt-28 pb-10 px-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
