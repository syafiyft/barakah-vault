'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { TrendingUp, Calculator, Heart, Award, ArrowUpRight, Star } from 'lucide-react'

const topCompanies = [
    { symbol: 'AAPL', name: 'Apple Inc.', score: 85, industry: 'Technology', change: '+2.3%' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', score: 82, industry: 'Technology', change: '+1.8%' },
    { symbol: 'COST', name: 'Costco', score: 76, industry: 'Retail', change: '+0.5%' },
]

const featuredProjects = [
    { id: 1, title: 'Build Masjid in Kelantan', progress: 64, backers: 456, goal: 500000 },
    { id: 2, title: 'Islamic School - Selangor', progress: 75, backers: 234, goal: 300000 },
]

function ScoreBadge({ score }) {
    const color = score >= 80 ? 'score-excellent' : score >= 70 ? 'score-good' : score >= 60 ? 'score-average' : 'score-poor'
    return <span className={`px-3 py-1 rounded-full text-sm font-semibold ${color}`}>{score}/100</span>
}

export default function Dashboard() {
    const { data: session } = useSession()
    const firstName = session?.user?.name?.split(' ')[0] || 'User'

    return (
        <div className="space-y-6">
            {/* Welcome */}
            <div className="glass-card">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white mb-2">Assalamu'alaikum, {firstName} 👋</h1>
                        <p className="text-dark-300">Invest ethically. Calculate accurately. Give transparently.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-dark-400">Your Zakat Due</p>
                        <p className="text-2xl font-bold text-gold-400">RM 2,500</p>
                        <p className="text-xs text-dark-400">in 57 days</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { icon: TrendingUp, label: 'Portfolio Value', value: 'RM 150,000', color: 'primary' },
                    { icon: Star, label: 'Avg Maqasid Score', value: '78/100', color: 'gold' },
                    { icon: Calculator, label: 'Zakat Paid (2025)', value: 'RM 4,500', color: 'primary' },
                    { icon: Heart, label: 'Projects Backed', value: '4', color: 'gold' },
                ].map((stat, i) => (
                    <div key={i} className="glass-card flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center`}>
                            <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                        </div>
                        <div>
                            <p className="text-sm text-dark-400">{stat.label}</p>
                            <p className="text-xl font-bold text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-3 gap-6">
                {/* Top Companies */}
                <div className="col-span-2 glass-card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary-400" />
                            Top Maqasid-Rated Companies
                        </h2>
                        <Link href="/invest" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
                            View All <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {topCompanies.map((company, i) => (
                            <div key={company.symbol} className="flex items-center gap-4 p-4 rounded-xl bg-dark-800/50 hover:bg-dark-800 transition-all cursor-pointer">
                                <span className="text-lg font-bold text-dark-500 w-6">{i + 1}</span>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-white">{company.name}</h3>
                                        <span className="text-xs text-dark-400 bg-dark-700 px-2 py-0.5 rounded">{company.symbol}</span>
                                    </div>
                                    <p className="text-sm text-dark-400">{company.industry}</p>
                                </div>
                                <ScoreBadge score={company.score} />
                                <span className="text-sm text-primary-400 font-medium">{company.change}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Zakat Widget */}
                <div className="glass-card">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-6">
                        <Calculator className="w-5 h-5 text-gold-400" />
                        Zakat Tools
                    </h2>

                    <div className="space-y-4">
                        <Link href="/zakat?type=traditional" className="block p-4 rounded-xl bg-dark-800/50 hover:bg-dark-800 transition-all group">
                            <h3 className="font-medium text-white group-hover:text-primary-400">Traditional Calculator</h3>
                            <p className="text-sm text-dark-400">Gold, savings, stocks</p>
                        </Link>

                        <Link href="/zakat?type=crypto" className="block p-4 rounded-xl bg-dark-800/50 hover:bg-dark-800 transition-all group">
                            <h3 className="font-medium text-white group-hover:text-primary-400">Crypto Calculator</h3>
                            <p className="text-sm text-dark-400">BTC, ETH, multi-method</p>
                        </Link>

                        <div className="pt-4 border-t border-dark-700">
                            <p className="text-sm text-dark-400 mb-2">Your Zakat Summary</p>
                            <p className="text-2xl font-bold text-gold-400">RM 2,500</p>
                            <p className="text-xs text-dark-400">Due: March 15, 2026</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Crowdfunding Projects */}
            <div className="glass-card">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Heart className="w-5 h-5 text-red-400" />
                        Featured Verified Projects
                    </h2>
                    <Link href="/crowdfunding" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1">
                        Browse All <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {featuredProjects.map((project) => (
                        <Link key={project.id} href={`/crowdfunding/${project.id}`} className="p-4 rounded-xl bg-dark-800/50 hover:bg-dark-800 transition-all">
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="font-semibold text-white">{project.title}</h3>
                                <span className="flex items-center gap-1 text-xs text-primary-400 bg-primary-500/20 px-2 py-1 rounded-full">
                                    <Award className="w-3 h-3" /> Verified
                                </span>
                            </div>

                            <div className="mb-3">
                                <div className="flex items-center justify-between text-sm mb-1">
                                    <span className="text-dark-400">{project.progress}% funded</span>
                                    <span className="text-white font-medium">RM {(project.goal * project.progress / 100).toLocaleString()}</span>
                                </div>
                                <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full" style={{ width: `${project.progress}%` }} />
                                </div>
                            </div>

                            <p className="text-sm text-dark-400">{project.backers} backers</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
