import DashboardLayout from '@/components/admin/DashboardLayout'

export default function AdminRootLayout({ children }) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}