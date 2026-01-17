import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen flex">
            <Sidebar />
            <div className="flex-1 flex flex-col ml-64">
                <Navbar />
                <main className="flex-1 p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
