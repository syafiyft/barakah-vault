'use client'

import { useSession } from 'next-auth/react'
import { Bell, Search, User, Wallet } from 'lucide-react'

export default function Navbar() {
    const { data: session } = useSession()
    const firstName = session?.user?.name?.split(' ')[0] || 'User'

    return (
        <header className="h-16 bg-dark-900/50 backdrop-blur-xl border-b border-dark-700/50 flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                    type="text"
                    placeholder="Search companies, projects..."
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-dark-400 focus:outline-none focus:border-primary-500 transition-all"
                />
            </div>

            <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-dark-800 border border-dark-700 hover:border-primary-500/50 transition-all text-dark-200 hover:text-white">
                    <Wallet className="w-4 h-4" />
                    <span className="text-sm font-medium">Connect Wallet</span>
                </button>

                <button className="relative p-2 rounded-xl bg-dark-800 hover:bg-dark-700 transition-all">
                    <Bell className="w-5 h-5 text-dark-300" />
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                </button>

                <div className="flex items-center gap-3 pl-4 border-l border-dark-700">
                    <div className="text-right">
                        <p className="text-sm font-medium text-white">{firstName}</p>
                        <p className="text-xs text-dark-400">Premium User</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                </div>
            </div>
        </header>
    )
}
