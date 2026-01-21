'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import {
    Briefcase, TrendingUp, TrendingDown, Plus, Trash2, Edit2, X, Check,
    Bitcoin, DollarSign, PiggyBank, RefreshCw, Search, Loader2, ChevronDown, ChevronUp
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'

// Popular stocks for quick add
const popularStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.' },
]

// Popular cryptos
const popularCryptos = [
    { symbol: 'BTC', name: 'Bitcoin', coingeckoId: 'bitcoin' },
    { symbol: 'ETH', name: 'Ethereum', coingeckoId: 'ethereum' },
    { symbol: 'BNB', name: 'Binance Coin', coingeckoId: 'binancecoin' },
    { symbol: 'SOL', name: 'Solana', coingeckoId: 'solana' },
    { symbol: 'XRP', name: 'Ripple', coingeckoId: 'ripple' },
]

function formatCurrency(amount, currency = 'MYR') {
    return new Intl.NumberFormat('en-MY', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
    }).format(amount)
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-MY').format(num)
}

// Add Modal Component
function AddModal({ isOpen, onClose, type, onAdd }) {
    const [formData, setFormData] = useState({
        symbol: '',
        name: '',
        quantity: '',
        averageCost: '',
        amount: '',
    })
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching] = useState(false)

    const handleSearch = async (query) => {
        setSearchQuery(query)
        if (query.length < 1) {
            setSearchResults([])
            return
        }

        if (type === 'stock') {
            setIsSearching(true)
            try {
                const res = await fetch('/api/stocks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query }),
                })
                const data = await res.json()
                setSearchResults(data.results || [])
            } catch (error) {
                console.error('Search error:', error)
            }
            setIsSearching(false)
        } else if (type === 'crypto') {
            // Filter popular cryptos
            const filtered = popularCryptos.filter(c =>
                c.symbol.toLowerCase().includes(query.toLowerCase()) ||
                c.name.toLowerCase().includes(query.toLowerCase())
            )
            setSearchResults(filtered)
        }
    }

    const selectAsset = (asset) => {
        setFormData({
            ...formData,
            symbol: asset.symbol,
            name: asset.name,
        })
        setSearchQuery('')
        setSearchResults([])
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (type === 'savings') {
            onAdd({
                name: formData.name,
                amount: parseFloat(formData.amount),
                currency: 'MYR',
            })
        } else {
            onAdd({
                symbol: formData.symbol.toUpperCase(),
                name: formData.name,
                quantity: parseFloat(formData.quantity),
                averageCost: parseFloat(formData.averageCost),
            })
        }
        setFormData({ symbol: '', name: '', quantity: '', averageCost: '', amount: '' })
        onClose()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-md border border-dark-700">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">
                        Add {type === 'stock' ? 'Stock' : type === 'crypto' ? 'Crypto' : 'Savings Account'}
                    </h3>
                    <button onClick={onClose} className="text-dark-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {type !== 'savings' ? (
                        <>
                            {/* Search field */}
                            <div className="relative">
                                <label className="block text-sm text-dark-400 mb-2">
                                    Search {type === 'stock' ? 'Stock' : 'Crypto'}
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        placeholder={`Search by ${type === 'stock' ? 'ticker or company name' : 'symbol'}`}
                                        className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
                                    />
                                    {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 animate-spin" />}
                                </div>

                                {/* Search results dropdown */}
                                {searchResults.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-dark-700 border border-dark-600 rounded-xl max-h-48 overflow-y-auto">
                                        {searchResults.map((result) => (
                                            <button
                                                key={result.symbol}
                                                type="button"
                                                onClick={() => selectAsset(result)}
                                                className="w-full px-4 py-2 text-left hover:bg-dark-600 flex items-center justify-between"
                                            >
                                                <span className="text-white">{result.name}</span>
                                                <span className="text-dark-400 text-sm">{result.symbol}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Quick add for popular */}
                            {!formData.symbol && (
                                <div>
                                    <p className="text-xs text-dark-400 mb-2">Popular {type === 'stock' ? 'Stocks' : 'Cryptos'}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {(type === 'stock' ? popularStocks : popularCryptos).map((asset) => (
                                            <button
                                                key={asset.symbol}
                                                type="button"
                                                onClick={() => selectAsset(asset)}
                                                className="px-3 py-1 text-sm bg-dark-700 hover:bg-dark-600 text-dark-300 rounded-lg"
                                            >
                                                {asset.symbol}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Selected asset */}
                            {formData.symbol && (
                                <div className="p-3 bg-primary-500/10 border border-primary-500/30 rounded-xl">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-white font-medium">{formData.name}</p>
                                            <p className="text-sm text-primary-400">{formData.symbol}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, symbol: '', name: '' })}
                                            className="text-dark-400 hover:text-white"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div>
                                <label className="block text-sm text-dark-400 mb-2">Quantity</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                                    placeholder="e.g., 10"
                                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
                                    required
                                />
                            </div>

                            {/* Average Cost */}
                            <div>
                                <label className="block text-sm text-dark-400 mb-2">Average Cost (RM)</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.averageCost}
                                    onChange={(e) => setFormData({ ...formData, averageCost: e.target.value })}
                                    placeholder="e.g., 150.50"
                                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Savings account name */}
                            <div>
                                <label className="block text-sm text-dark-400 mb-2">Account Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Emergency Fund, Maybank Savings"
                                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
                                    required
                                />
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-sm text-dark-400 mb-2">Amount (RM)</label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    placeholder="e.g., 10000"
                                    className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
                                    required
                                />
                            </div>
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={type !== 'savings' && !formData.symbol}
                        className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Add to Portfolio
                    </button>
                </form>
            </div>
        </div>
    )
}

// Edit Savings Modal Component
function EditSavingsModal({ isOpen, onClose, saving, onSave }) {
    const [name, setName] = useState(saving?.name || '')
    const [amount, setAmount] = useState(saving?.amount?.toString() || '')

    useEffect(() => {
        if (saving) {
            setName(saving.name)
            setAmount(saving.amount.toString())
        }
    }, [saving])

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave({
            name,
            amount: parseFloat(amount),
            currency: 'MYR',
        })
        onClose()
    }

    if (!isOpen || !saving) return null

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-dark-800 rounded-2xl p-6 w-full max-w-md border border-dark-700">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Edit Savings Account</h3>
                    <button onClick={onClose} className="text-dark-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-dark-400 mb-2">Account Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Emergency Fund"
                            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-dark-400 mb-2">Amount (RM)</label>
                        <input
                            type="number"
                            step="any"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="e.g., 10000"
                            className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
                            required
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-dark-700 text-white font-medium rounded-xl hover:bg-dark-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium rounded-xl hover:opacity-90 transition-opacity"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// Holdings Section Component
function HoldingsSection({ title, icon: Icon, iconColor, holdings, prices, type, onAdd, onDelete, onEdit, isLoading }) {
    const [isExpanded, setIsExpanded] = useState(true)

    const calculateValue = (holding) => {
        if (type === 'savings') {
            return holding.amount
        }
        const price = prices[holding.symbol]?.price || holding.averageCost
        return holding.quantity * price
    }

    const calculateGain = (holding) => {
        if (type === 'savings') return { amount: 0, percent: 0 }
        const currentPrice = prices[holding.symbol]?.price || holding.averageCost
        const costBasis = holding.quantity * holding.averageCost
        const currentValue = holding.quantity * currentPrice
        const gain = currentValue - costBasis
        const percent = costBasis > 0 ? (gain / costBasis) * 100 : 0
        return { amount: gain, percent }
    }

    const totalValue = holdings.reduce((sum, h) => sum + calculateValue(h), 0)

    return (
        <div className="glass-card">
            <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${iconColor} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white">{title}</h2>
                        <p className="text-sm text-dark-400">{holdings.length} holdings</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xl font-bold text-white">{formatCurrency(totalValue)}</p>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onAdd(); }}
                        className="p-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors"
                    >
                        <Plus className="w-5 h-5 text-primary-400" />
                    </button>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-dark-400" /> : <ChevronDown className="w-5 h-5 text-dark-400" />}
                </div>
            </div>

            {isExpanded && (
                <div className="mt-6 space-y-3">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="w-6 h-6 text-primary-400 animate-spin" />
                        </div>
                    ) : holdings.length === 0 ? (
                        <div className="text-center py-8 text-dark-400">
                            <p>No {title.toLowerCase()} yet</p>
                            <button
                                onClick={onAdd}
                                className="mt-2 text-primary-400 hover:text-primary-300"
                            >
                                Add your first {type}
                            </button>
                        </div>
                    ) : (
                        holdings.map((holding) => {
                            const value = calculateValue(holding)
                            const gain = calculateGain(holding)
                            const price = type !== 'savings' ? prices[holding.symbol] : null

                            return (
                                <div
                                    key={holding._id}
                                    className="flex items-center justify-between p-4 bg-dark-800/50 rounded-xl hover:bg-dark-800 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-dark-700 flex items-center justify-center">
                                            <span className="text-sm font-bold text-white">
                                                {type === 'savings' ? '💰' : holding.symbol.slice(0, 2)}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-white">{holding.name}</h3>
                                            {type !== 'savings' && (
                                                <p className="text-sm text-dark-400">
                                                    {formatNumber(holding.quantity)} {holding.symbol} @ {formatCurrency(holding.averageCost)}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        {type !== 'savings' && price && (
                                            <div className="text-right">
                                                <p className="text-sm text-dark-400">Current Price</p>
                                                <p className="text-white font-medium">{formatCurrency(price.price)}</p>
                                            </div>
                                        )}

                                        <div className="text-right min-w-[120px]">
                                            <p className="text-white font-semibold">{formatCurrency(value)}</p>
                                            {type !== 'savings' && (
                                                <p className={`text-sm flex items-center justify-end gap-1 ${gain.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    {gain.amount >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                    {gain.amount >= 0 ? '+' : ''}{formatCurrency(gain.amount)} ({gain.percent.toFixed(2)}%)
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1">
                                            {type === 'savings' && onEdit && (
                                                <button
                                                    onClick={() => onEdit(holding)}
                                                    className="p-2 text-dark-400 hover:text-primary-400 transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => onDelete(holding._id)}
                                                className="p-2 text-dark-400 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            )}
        </div>
    )
}

// Portfolio Chart Component
function PortfolioChart({ history, stocksValue, cryptoValue, savingsValue }) {
    const [viewMode, setViewMode] = useState('total') // 'total' or 'breakdown'

    // Generate demo history if no real history exists
    const chartData = history.length > 0 ? history.map(h => ({
        date: new Date(h.date).toLocaleDateString('en-MY', { month: 'short', day: 'numeric' }),
        total: h.totalValue,
        stocks: h.stocksValue,
        crypto: h.cryptoValue,
        savings: h.savingsValue,
    })) : generateDemoHistory(stocksValue, cryptoValue, savingsValue)

    return (
        <div className="glass-card">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Portfolio Performance</h2>

                {/* Toggle Switch */}
                <div className="flex items-center gap-2 bg-dark-800 rounded-xl p-1">
                    <button
                        onClick={() => setViewMode('total')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            viewMode === 'total'
                                ? 'bg-primary-500 text-white'
                                : 'text-dark-400 hover:text-white'
                        }`}
                    >
                        Total Value
                    </button>
                    <button
                        onClick={() => setViewMode('breakdown')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            viewMode === 'breakdown'
                                ? 'bg-primary-500 text-white'
                                : 'text-dark-400 hover:text-white'
                        }`}
                    >
                        By Asset Type
                    </button>
                </div>
            </div>

            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    {viewMode === 'total' ? (
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                            <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: '1px solid #374151',
                                    borderRadius: '12px',
                                }}
                                labelStyle={{ color: '#fff' }}
                                formatter={(value) => [formatCurrency(value), '']}
                            />
                            <Area
                                type="monotone"
                                dataKey="total"
                                stroke="#6366f1"
                                strokeWidth={2}
                                fill="url(#colorTotal)"
                                name="Total Value"
                            />
                        </AreaChart>
                    ) : (
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                            <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1f2937',
                                    border: '1px solid #374151',
                                    borderRadius: '12px',
                                }}
                                labelStyle={{ color: '#fff' }}
                                formatter={(value, name) => [formatCurrency(value), name]}
                            />
                            <Line
                                type="monotone"
                                dataKey="stocks"
                                stroke="#3b82f6"
                                strokeWidth={2}
                                dot={false}
                                name="Stocks"
                            />
                            <Line
                                type="monotone"
                                dataKey="crypto"
                                stroke="#f97316"
                                strokeWidth={2}
                                dot={false}
                                name="Crypto"
                            />
                            <Line
                                type="monotone"
                                dataKey="savings"
                                stroke="#22c55e"
                                strokeWidth={2}
                                dot={false}
                                name="Savings"
                            />
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </div>

            {/* Legend for breakdown view */}
            {viewMode === 'breakdown' && (
                <div className="mt-4 flex items-center justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm text-dark-400">Stocks</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                        <span className="text-sm text-dark-400">Crypto</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm text-dark-400">Savings</span>
                    </div>
                </div>
            )}

            {/* Breakdown bars */}
            <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="p-3 bg-dark-800/50 rounded-xl">
                    <p className="text-xs text-dark-400 mb-1">Stocks</p>
                    <p className="text-lg font-semibold text-blue-400">{formatCurrency(stocksValue)}</p>
                </div>
                <div className="p-3 bg-dark-800/50 rounded-xl">
                    <p className="text-xs text-dark-400 mb-1">Crypto</p>
                    <p className="text-lg font-semibold text-orange-400">{formatCurrency(cryptoValue)}</p>
                </div>
                <div className="p-3 bg-dark-800/50 rounded-xl">
                    <p className="text-xs text-dark-400 mb-1">Savings</p>
                    <p className="text-lg font-semibold text-green-400">{formatCurrency(savingsValue)}</p>
                </div>
            </div>
        </div>
    )
}

// Generate demo history data for visualization
function generateDemoHistory(stocksValue, cryptoValue, savingsValue) {
    const data = []
    const totalCurrent = stocksValue + cryptoValue + savingsValue
    const days = 30

    for (let i = days; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        // Simulate some variance
        const variance = 1 + (Math.random() - 0.5) * 0.1
        const dayVariance = 1 - (i / days) * 0.15 // Trend upward
        data.push({
            date: date.toLocaleDateString('en-MY', { month: 'short', day: 'numeric' }),
            total: totalCurrent * variance * dayVariance,
            stocks: stocksValue * variance * dayVariance,
            crypto: cryptoValue * variance * dayVariance,
            savings: savingsValue,
        })
    }
    return data
}

export default function PortfolioPage() {
    const { data: session } = useSession()
    const [portfolio, setPortfolio] = useState({ stocks: [], crypto: [], savings: [], history: [] })
    const [stockPrices, setStockPrices] = useState({})
    const [cryptoPrices, setCryptoPrices] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [isPricesLoading, setIsPricesLoading] = useState(false)
    const [modalOpen, setModalOpen] = useState(null) // 'stock' | 'crypto' | 'savings' | null
    const [lastUpdated, setLastUpdated] = useState(null)
    const [editingSaving, setEditingSaving] = useState(null) // Saving being edited

    // Fetch portfolio data
    const fetchPortfolio = useCallback(async () => {
        try {
            const res = await fetch('/api/portfolio')
            if (res.ok) {
                const data = await res.json()
                setPortfolio(data)
            }
        } catch (error) {
            console.error('Failed to fetch portfolio:', error)
        }
        setIsLoading(false)
    }, [])

    // Fetch stock prices
    const fetchStockPrices = useCallback(async (symbols) => {
        if (symbols.length === 0) return
        setIsPricesLoading(true)
        try {
            const res = await fetch(`/api/stocks?symbols=${symbols.join(',')}`)
            if (res.ok) {
                const data = await res.json()
                const pricesMap = {}
                data.stocks.forEach(stock => {
                    if (!stock.error) {
                        pricesMap[stock.symbol] = stock
                    }
                })
                setStockPrices(pricesMap)
            }
        } catch (error) {
            console.error('Failed to fetch stock prices:', error)
        }
        setIsPricesLoading(false)
        setLastUpdated(new Date())
    }, [])

    // Fetch crypto prices
    const fetchCryptoPrices = useCallback(async (symbols) => {
        if (symbols.length === 0) return
        try {
            const res = await fetch('/api/prices')
            if (res.ok) {
                const data = await res.json()
                const pricesMap = {
                    'BTC': { price: data.btc, symbol: 'BTC' },
                    'ETH': { price: data.eth, symbol: 'ETH' },
                }
                setCryptoPrices(pricesMap)
            }
        } catch (error) {
            console.error('Failed to fetch crypto prices:', error)
        }
    }, [])

    // Initial load
    useEffect(() => {
        fetchPortfolio()
    }, [fetchPortfolio])

    // Fetch prices when portfolio changes
    useEffect(() => {
        const stockSymbols = portfolio.stocks.map(s => s.symbol)
        const cryptoSymbols = portfolio.crypto.map(c => c.symbol)

        if (stockSymbols.length > 0) {
            fetchStockPrices(stockSymbols)
        }
        if (cryptoSymbols.length > 0) {
            fetchCryptoPrices(cryptoSymbols)
        }
    }, [portfolio.stocks, portfolio.crypto, fetchStockPrices, fetchCryptoPrices])

    // Add holding
    const handleAdd = async (type, data) => {
        try {
            const res = await fetch('/api/portfolio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, data }),
            })
            if (res.ok) {
                const updated = await res.json()
                setPortfolio(updated)
            }
        } catch (error) {
            console.error('Failed to add holding:', error)
        }
    }

    // Delete holding
    const handleDelete = async (type, id) => {
        if (!confirm('Are you sure you want to remove this holding?')) return
        try {
            const res = await fetch(`/api/portfolio?type=${type}&id=${id}`, {
                method: 'DELETE',
            })
            if (res.ok) {
                const updated = await res.json()
                setPortfolio(updated)
            }
        } catch (error) {
            console.error('Failed to delete holding:', error)
        }
    }

    // Edit savings
    const handleEditSaving = async (data) => {
        if (!editingSaving) return
        try {
            const res = await fetch('/api/portfolio', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'savings',
                    id: editingSaving._id,
                    data,
                }),
            })
            if (res.ok) {
                const updated = await res.json()
                setPortfolio(updated)
            }
        } catch (error) {
            console.error('Failed to edit saving:', error)
        }
        setEditingSaving(null)
    }

    // Refresh prices
    const handleRefresh = () => {
        const stockSymbols = portfolio.stocks.map(s => s.symbol)
        const cryptoSymbols = portfolio.crypto.map(c => c.symbol)
        fetchStockPrices(stockSymbols)
        fetchCryptoPrices(cryptoSymbols)
    }

    // Calculate totals
    const stocksValue = portfolio.stocks.reduce((sum, s) => {
        const price = stockPrices[s.symbol]?.price || s.averageCost
        return sum + (s.quantity * price)
    }, 0)

    const cryptoValue = portfolio.crypto.reduce((sum, c) => {
        const price = cryptoPrices[c.symbol]?.price || c.averageCost
        return sum + (c.quantity * price)
    }, 0)

    const savingsValue = portfolio.savings.reduce((sum, s) => sum + s.amount, 0)
    const totalValue = stocksValue + cryptoValue + savingsValue

    // Calculate total gain/loss
    const stocksCostBasis = portfolio.stocks.reduce((sum, s) => sum + (s.quantity * s.averageCost), 0)
    const cryptoCostBasis = portfolio.crypto.reduce((sum, c) => sum + (c.quantity * c.averageCost), 0)
    const totalCostBasis = stocksCostBasis + cryptoCostBasis + savingsValue
    const totalGain = totalValue - totalCostBasis
    const totalGainPercent = totalCostBasis > 0 ? (totalGain / totalCostBasis) * 100 : 0

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="glass-card">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center">
                            <Briefcase className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Portfolio Management</h1>
                            <p className="text-dark-400">Track your investments, crypto, and savings</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {lastUpdated && (
                            <p className="text-xs text-dark-400">
                                Updated: {lastUpdated.toLocaleTimeString()}
                            </p>
                        )}
                        <button
                            onClick={handleRefresh}
                            disabled={isPricesLoading}
                            className="flex items-center gap-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-xl text-white transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${isPricesLoading ? 'animate-spin' : ''}`} />
                            Refresh Prices
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4">
                <div className="glass-card">
                    <p className="text-sm text-dark-400 mb-1">Total Portfolio Value</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(totalValue)}</p>
                    <p className={`text-sm flex items-center gap-1 mt-1 ${totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {totalGain >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {totalGain >= 0 ? '+' : ''}{formatCurrency(totalGain)} ({totalGainPercent.toFixed(2)}%)
                    </p>
                </div>
                <div className="glass-card">
                    <p className="text-sm text-dark-400 mb-1">Stocks</p>
                    <p className="text-2xl font-bold text-blue-400">{formatCurrency(stocksValue)}</p>
                    <p className="text-sm text-dark-400">{portfolio.stocks.length} holdings</p>
                </div>
                <div className="glass-card">
                    <p className="text-sm text-dark-400 mb-1">Crypto</p>
                    <p className="text-2xl font-bold text-orange-400">{formatCurrency(cryptoValue)}</p>
                    <p className="text-sm text-dark-400">{portfolio.crypto.length} holdings</p>
                </div>
                <div className="glass-card">
                    <p className="text-sm text-dark-400 mb-1">Savings</p>
                    <p className="text-2xl font-bold text-green-400">{formatCurrency(savingsValue)}</p>
                    <p className="text-sm text-dark-400">{portfolio.savings.length} accounts</p>
                </div>
            </div>

            {/* Chart */}
            <PortfolioChart
                history={portfolio.history}
                stocksValue={stocksValue}
                cryptoValue={cryptoValue}
                savingsValue={savingsValue}
            />

            {/* Holdings Sections */}
            <HoldingsSection
                title="Stocks"
                icon={TrendingUp}
                iconColor="bg-blue-500"
                holdings={portfolio.stocks}
                prices={stockPrices}
                type="stock"
                onAdd={() => setModalOpen('stock')}
                onDelete={(id) => handleDelete('stock', id)}
                isLoading={isPricesLoading}
            />

            <HoldingsSection
                title="Cryptocurrency"
                icon={Bitcoin}
                iconColor="bg-orange-500"
                holdings={portfolio.crypto}
                prices={cryptoPrices}
                type="crypto"
                onAdd={() => setModalOpen('crypto')}
                onDelete={(id) => handleDelete('crypto', id)}
                isLoading={isPricesLoading}
            />

            <HoldingsSection
                title="Savings Accounts"
                icon={PiggyBank}
                iconColor="bg-green-500"
                holdings={portfolio.savings}
                prices={{}}
                type="savings"
                onAdd={() => setModalOpen('savings')}
                onDelete={(id) => handleDelete('savings', id)}
                onEdit={(saving) => setEditingSaving(saving)}
                isLoading={false}
            />

            {/* Add Modals */}
            <AddModal
                isOpen={modalOpen === 'stock'}
                onClose={() => setModalOpen(null)}
                type="stock"
                onAdd={(data) => handleAdd('stock', data)}
            />
            <AddModal
                isOpen={modalOpen === 'crypto'}
                onClose={() => setModalOpen(null)}
                type="crypto"
                onAdd={(data) => handleAdd('crypto', data)}
            />
            <AddModal
                isOpen={modalOpen === 'savings'}
                onClose={() => setModalOpen(null)}
                type="savings"
                onAdd={(data) => handleAdd('savings', data)}
            />

            {/* Edit Savings Modal */}
            <EditSavingsModal
                isOpen={!!editingSaving}
                onClose={() => setEditingSaving(null)}
                saving={editingSaving}
                onSave={handleEditSaving}
            />
        </div>
    )
}
