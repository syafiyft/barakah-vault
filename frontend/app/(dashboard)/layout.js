import Sidebar from '@/components/Sidebar'
import DashboardContent from '@/components/DashboardContent'
import { SidebarProvider } from '@/context/SidebarContext'

export default function DashboardLayout({ children }) {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex">
                <Sidebar />
                <DashboardContent>
                    {children}
                </DashboardContent>
            </div>
        </SidebarProvider>
    )
}
