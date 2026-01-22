'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, TrendingUp, Calculator, Heart, LogOut, Sparkles, Briefcase, ChevronLeft, ChevronRight } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { useSidebar } from '@/context/SidebarContext'

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/invest', icon: TrendingUp, label: 'Invest' },
    { path: '/zakat', icon: Calculator, label: 'Zakat' },
    { path: '/crowdfunding', icon: Heart, label: 'Crowdfunding' },
    { path: '/portfolio', icon: Briefcase, label: 'Portfolio' },
]

export default function Sidebar() {
    const pathname = usePathname()
    const { isCollapsed, toggleSidebar } = useSidebar()

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-dark-900 border-r border-dark-700/50 flex flex-col z-50 transition-all duration-300 ease-in-out ${
                isCollapsed ? 'w-20' : 'w-64'
            }`}
        >
            {/* Logo Section - matches navbar h-16 */}
            <div className={`h-16 border-b border-dark-700/50 flex items-center ${isCollapsed ? 'justify-center px-3' : 'px-6'}`}>
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center shrink-0">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    {!isCollapsed && (
                        <div className="overflow-hidden">
                            <h1 className="text-xl font-bold text-gradient whitespace-nowrap">BarakahVault</h1>
                            <p className="text-xs text-dark-400 whitespace-nowrap">Ethical Investing</p>
                        </div>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-3">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path
                        const Icon = item.icon
                        return (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    title={isCollapsed ? item.label : undefined}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative
                                        ${isCollapsed ? 'justify-center px-3' : ''}
                                        ${isActive
                                            ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                                            : 'text-dark-300 hover:bg-dark-800 hover:text-white'
                                        }`}
                                >
                                    <Icon className="w-5 h-5 shrink-0" />
                                    {!isCollapsed && (
                                        <span className="font-medium whitespace-nowrap">{item.label}</span>
                                    )}

                                    {/* Tooltip for collapsed state */}
                                    {isCollapsed && (
                                        <div className="absolute left-full ml-2 px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                            {item.label}
                                        </div>
                                    )}
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            {/* Collapse Toggle Button */}
            <div className="px-3 pb-2">
                <button
                    onClick={toggleSidebar}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-dark-400 hover:bg-dark-800 hover:text-white transition-all ${
                        isCollapsed ? 'justify-center px-3' : ''
                    }`}
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-5 h-5" />
                    ) : (
                        <>
                            <ChevronLeft className="w-5 h-5" />
                            <span className="font-medium">Collapse</span>
                        </>
                    )}
                </button>
            </div>

            {/* Logout Button */}
            <div className="p-3 border-t border-dark-700/50">
                <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    title={isCollapsed ? 'Logout' : undefined}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all group relative ${
                        isCollapsed ? 'justify-center px-3' : ''
                    }`}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span className="font-medium">Logout</span>}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                        <div className="absolute left-full ml-2 px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-sm text-white whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                            Logout
                        </div>
                    )}
                </button>
            </div>
        </aside>
    )
}
