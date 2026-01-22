'use client'

import { useSidebar } from '@/context/SidebarContext'
import Navbar from './Navbar'

export default function DashboardContent({ children }) {
    const { isCollapsed } = useSidebar()

    return (
        <div
            className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
                isCollapsed ? 'ml-20' : 'ml-64'
            }`}
        >
            <Navbar />
            <main className="flex-1 p-6 overflow-auto">
                {children}
            </main>
        </div>
    )
}
