'use client'

import { useState } from 'react'
import { Search, Loader2, Info } from 'lucide-react'
import ScoreCard from '@/components/ScoreCard'
import MaqasidInfoModal from '@/components/MaqasidInfoModal'

export default function Invest() {
    const [query, setQuery] = useState('')
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const [showInfo, setShowInfo] = useState(false)

    const handleSearch = async (e) => {
        e.preventDefault()
        if (!query.trim()) return

        setLoading(true)
        setResult(null)

        try {
            const res = await fetch('/api/maqasid/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            })
            const data = await res.json()
            setResult(data)
        } catch (error) {
            console.error('Search failed:', error)
        } finally {
            setLoading(false)
        }
    }

    // Popular searches
    const quickSearch = (term) => {
        setQuery(term)
        // Trigger search artificially or just let user click
        // For better UX, let's auto trigger in a real app, but here just fill input
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold text-gradient">Maqasid AI Screener</h1>
                <p className="text-lg text-dark-300 max-w-2xl mx-auto">
                    Analyze any company's alignment with the 5 Objectives of Shariah: Faith, Life, Intellect, Lineage, and Wealth.
                </p>
                <button
                    onClick={() => setShowInfo(true)}
                    className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors text-sm font-medium"
                >
                    <Info className="w-4 h-4" />
                    How does the screening work?
                </button>
            </div>

            <MaqasidInfoModal isOpen={showInfo} onClose={() => setShowInfo(false)} />

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-gold-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Enter company name (e.g. Apple, Tesla)..."
                            className="block w-full p-5 pl-14 text-lg bg-dark-900 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all shadow-2xl"
                        />
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-dark-400 group-hover:text-primary-400 transition-colors" />
                        <button
                            type="submit"
                            disabled={loading}
                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-dark-800 hover:bg-dark-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analyze'}
                        </button>
                    </div>
                </div>

                {/* Quick Tags */}
                <div className="flex justify-center gap-2 mt-4">
                    {['Apple', 'Tesla', 'Microsoft', 'NVIDIA'].map((term) => (
                        <button
                            key={term}
                            type="button"
                            onClick={() => setQuery(term)}
                            className="text-sm px-3 py-1 rounded-full bg-dark-800 text-dark-400 hover:bg-dark-700 hover:text-white transition-colors border border-dark-700"
                        >
                            {term}
                        </button>
                    ))}
                </div>
            </form>

            {/* Results Area */}
            <div className="min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 space-y-4 animate-pulse">
                        <div className="w-16 h-16 rounded-full border-4 border-primary-500/30 border-t-primary-500 animate-spin"></div>
                        <p className="text-dark-400">Analyzing compliance data...</p>
                    </div>
                ) : result ? (
                    <ScoreCard data={result} />
                ) : (
                    !loading && (
                        <div className="text-center py-12 border-2 border-dashed border-dark-800 rounded-2xl bg-dark-800/30">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-800 flex items-center justify-center">
                                <Search className="w-8 h-8 text-dark-500" />
                            </div>
                            <h3 className="text-xl font-medium text-white mb-2">Ready to Analyze</h3>
                            <p className="text-dark-400">Search for a company to see its comprehensive Maqasid breakdown.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    )
}
