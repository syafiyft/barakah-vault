'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, TrendingUp, Calculator, Heart, LogOut, Sparkles } from 'lucide-react'

const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/invest', icon: TrendingUp, label: 'Invest' },
    { path: '/zakat', icon: Calculator, label: 'Zakat' },
    { path: '/crowdfunding', icon: Heart, label: 'Crowdfunding' },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-dark-900 border-r border-dark-700/50 flex flex-col z-50">
            <div className="p-6 border-b border-dark-700/50">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gradient">BarakahVault</h1>
                        <p className="text-xs text-dark-400">Ethical Investing</p>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path
                        const Icon = item.icon
                        return (
                            <li key={item.path}>
                                <Link
                                    href={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
                    ${isActive ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'text-dark-300 hover:bg-dark-800 hover:text-white'}`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-dark-700/50">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    )
}
