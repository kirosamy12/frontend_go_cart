import AdminLayout from "@/components/admin/AdminLayout";
import { redirect } from "next/navigation";

export const metadata = {
    title: "ShopVerse. - Admin",
    description: "ShopVerse. - Admin",
};

export default function RootAdminLayout({ children }) {
    // Check if user is admin on the client side
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        if (!token) {
            redirect('/signin')
            return null
        }

        try {
            // Decode token to check role
            const parts = token.split('.')
            if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]))
                if (payload.role !== 'admin') {
                    redirect('/')
                    return null
                }
            } else {
                redirect('/signin')
                return null
            }
        } catch (error) {
            console.error('Error decoding token:', error)
            redirect('/signin')
            return null
        }
    }

    return (
        <>
            <AdminLayout>
                {children}
            </AdminLayout>
        </>
    );
}
