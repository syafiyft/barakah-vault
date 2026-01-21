'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { TrendingUp, Calculator, Heart, Award, ArrowUpRight, Star, Briefcase, Loader2, Newspaper, Clock, ExternalLink } from 'lucide-react'

const topCompanies = [
    { symbol: 'TSLA', name: 'Tesla, Inc.', score: 88, industry: 'Automotive', change: '+5.4%' },
    { symbol: 'AAPL', name: 'Apple Inc.', score: 85, industry: 'Technology', change: '+2.3%' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', score: 82, industry: 'Technology', change: '+1.8%' },
    { symbol: 'COST', name: 'Costco', score: 76, industry: 'Retail', change: '+0.5%' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', score: 75, industry: 'Technology', change: '+1.2%' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', score: 74, industry: 'Technology', change: '+3.1%' },
    { symbol: 'AMZN', name: 'Amazon.com', score: 72, industry: 'Retail', change: '-0.4%' },
    { symbol: 'ADBE', name: 'Adobe Inc.', score: 70, industry: 'Technology', change: '+0.8%' },
    { symbol: 'INTC', name: 'Intel Corp.', score: 68, industry: 'Technology', change: '-1.5%' },
    { symbol: 'META', name: 'Meta Platforms', score: 65, industry: 'Technology', change: '+2.1%' },
]

const featuredProjects = [
    {
        id: 1,
        title: 'Build Masjid in Kelantan',
        progress: 64,
        backers: 456,
        goal: 500000,
        image: 'https://images.unsplash.com/photo-1564769625673-cb8e7721bc6b?w=800&q=80'
    },
    {
        id: 2,
        title: 'Islamic School - Selangor',
        progress: 75,
        backers: 234,
        goal: 300000,
        image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80'
    },
]

function ScoreBadge({ score }) {
    const color = score >= 80 ? 'score-excellent' : score >= 70 ? 'score-good' : score >= 60 ? 'score-average' : 'score-poor'
    return <span className={`px-3 py-1 rounded-full text-sm font-semibold ${color}`}>{score}/100</span>
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-MY', {
        style: 'currency',
        currency: 'MYR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

function formatTimeAgo(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString('en-MY', { month: 'short', day: 'numeric' })
}

export default function Dashboard() {
    const { data: session } = useSession()
    const firstName = session?.user?.name?.split(' ')[0] || 'User'
    const [portfolioValue, setPortfolioValue] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [news, setNews] = useState([])
    const [isNewsLoading, setIsNewsLoading] = useState(true)

    // Fetch news
    useEffect(() => {
        async function fetchNews() {
            try {
                const res = await fetch('/api/news')
                if (res.ok) {
                    const data = await res.json()
                    setNews(data.news || [])
                }
            } catch (error) {
                console.error('Failed to fetch news:', error)
            }
            setIsNewsLoading(false)
        }
        fetchNews()
    }, [])

    useEffect(() => {
        async function fetchPortfolioData() {
            try {
                // Fetch portfolio
                const portfolioRes = await fetch('/api/portfolio')
                if (portfolioRes.ok) {
                    const portfolio = await portfolioRes.json()

                    // Fetch prices
                    const pricesRes = await fetch('/api/prices')
                    const prices = pricesRes.ok ? await pricesRes.json() : { btc: 440000, eth: 15000 }

                    // Calculate stock values (use average cost as fallback)
                    let stocksValue = 0
                    if (portfolio.stocks?.length > 0) {
                        const symbols = portfolio.stocks.map(s => s.symbol).join(',')
                        const stocksRes = await fetch(`/api/stocks?symbols=${symbols}`)
                        if (stocksRes.ok) {
                            const stocksData = await stocksRes.json()
                            const stockPrices = {}
                            stocksData.stocks?.forEach(s => {
                                if (!s.error) stockPrices[s.symbol] = s.price
                            })
                            stocksValue = portfolio.stocks.reduce((sum, s) => {
                                const price = stockPrices[s.symbol] || s.averageCost
                                return sum + (s.quantity * price)
                            }, 0)
                        } else {
                            stocksValue = portfolio.stocks.reduce((sum, s) => sum + (s.quantity * s.averageCost), 0)
                        }
                    }

                    // Calculate crypto values
                    const cryptoValue = portfolio.crypto?.reduce((sum, c) => {
                        const price = c.symbol === 'BTC' ? prices.btc : c.symbol === 'ETH' ? prices.eth : c.averageCost
                        return sum + (c.quantity * price)
                    }, 0) || 0

                    // Calculate savings
                    const savingsValue = portfolio.savings?.reduce((sum, s) => sum + s.amount, 0) || 0

                    setPortfolioValue(stocksValue + cryptoValue + savingsValue)
                }
            } catch (error) {
                console.error('Failed to fetch portfolio:', error)
            }
            setIsLoading(false)
        }

        fetchPortfolioData()
    }, [])

    return (
        <div className="space-y-6">
            {/* Same Welcome & Stats ... */}
            {/* ... */}

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
                <Link href="/portfolio" className="glass-card flex items-center gap-4 hover:border-primary-500/50 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-primary-400" />
                    </div>
                    <div>
                        <p className="text-sm text-dark-400">Portfolio Value</p>
                        {isLoading ? (
                            <Loader2 className="w-5 h-5 text-primary-400 animate-spin mt-1" />
                        ) : (
                            <p className="text-xl font-bold text-white">{formatCurrency(portfolioValue)}</p>
                        )}
                    </div>
                </Link>
                {[
                    { icon: Star, label: 'Avg Maqasid Score', value: '78/100', color: 'gold', href: '/invest' },
                    { icon: Calculator, label: 'Zakat Paid (2025)', value: 'RM 4,500', color: 'primary', href: '/zakat' },
                    { icon: Heart, label: 'Projects Backed', value: '4', color: 'gold', href: '/crowdfunding' },
                ].map((stat, i) => (
                    <Link key={i} href={stat.href} className="glass-card flex items-center gap-4 hover:border-primary-500/50 transition-colors">
                        <div className={`w-12 h-12 rounded-xl bg-${stat.color}-500/20 flex items-center justify-center`}>
                            <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                        </div>
                        <div>
                            <p className="text-sm text-dark-400">{stat.label}</p>
                            <p className="text-xl font-bold text-white">{stat.value}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-12 gap-6">
                {/* Top Companies - Narrower */}
                <div className="col-span-3 glass-card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary-400" />
                            Top Maqasid
                        </h2>
                        <Link href="/invest" className="text-sm text-primary-400 hover:text-primary-300">
                            <ArrowUpRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="space-y-3">
                        {topCompanies.slice(0, 5).map((company, i) => (
                            <Link key={company.symbol} href="/invest" className="flex items-center gap-3 p-3 rounded-xl bg-dark-800/50 hover:bg-dark-800 transition-all">
                                <span className={`text-sm font-bold ${i < 3 ? 'text-gold-400' : 'text-dark-500'}`}>{i + 1}</span>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-white text-sm truncate">{company.symbol}</h3>
                                    <p className="text-xs text-dark-400 truncate">{company.name}</p>
                                </div>
                                <span className="text-sm font-semibold text-primary-400">{company.score}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Market News - Wider */}
                <div className="col-span-5 glass-card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Newspaper className="w-5 h-5 text-blue-400" />
                            Market News
                        </h2>
                        <span className="text-xs text-dark-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Live
                        </span>
                    </div>

                    {isNewsLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {news.slice(0, 5).map((item, index) => (
                                <a
                                    key={item.id || index}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group block p-3 rounded-xl bg-dark-800/50 hover:bg-dark-800 transition-all"
                                >
                                    <h3 className="font-medium text-white group-hover:text-primary-400 text-sm line-clamp-2 leading-tight mb-1">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-dark-400">{item.source}</span>
                                        <span className="text-xs text-dark-500">{formatTimeAgo(item.publishedAt)}</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </div>

                {/* Zakat Widget */}
                <div className="col-span-4 glass-card">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                        <Calculator className="w-5 h-5 text-gold-400" />
                        Zakat Tools
                    </h2>

                    <div className="space-y-3">
                        <Link href="/zakat?type=traditional" className="block p-3 rounded-xl bg-dark-800/50 hover:bg-dark-800 transition-all group">
                            <h3 className="font-medium text-white group-hover:text-primary-400">Traditional Calculator</h3>
                            <p className="text-sm text-dark-400">Gold, savings, stocks</p>
                        </Link>

                        <Link href="/zakat?type=crypto" className="block p-3 rounded-xl bg-dark-800/50 hover:bg-dark-800 transition-all group">
                            <h3 className="font-medium text-white group-hover:text-primary-400">Crypto Calculator</h3>
                            <p className="text-sm text-dark-400">BTC, ETH, multi-method</p>
                        </Link>

                        <div className="pt-3 border-t border-dark-700">
                            <p className="text-sm text-dark-400 mb-1">Your Zakat Summary</p>
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
                        <Link key={project.id} href={`/crowdfunding/${project.id}`} className="group rounded-xl bg-dark-800/50 hover:bg-dark-800 transition-all overflow-hidden">
                            {/* Project Image */}
                            <div className="relative h-32 overflow-hidden">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                                <span className="absolute top-2 right-2 flex items-center gap-1 text-xs text-primary-400 bg-dark-900/80 backdrop-blur-sm px-2 py-1 rounded-full">
                                    <Award className="w-3 h-3" /> Verified
                                </span>
                            </div>

                            <div className="p-4">
                                <h3 className="font-semibold text-white mb-3 group-hover:text-primary-400 transition-colors">{project.title}</h3>

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
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
