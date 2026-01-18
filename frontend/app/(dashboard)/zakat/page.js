'use client'

import { useState } from 'react'
import { Coins, Bitcoin, Info } from 'lucide-react'

const NISAB_GRAMS = 85

function TraditionalCalculator() {
    const [assets, setAssets] = useState({ goldWeight: '', goldType: '999', savings: '', stocks: '' })
    const [prices, setPrices] = useState({ 999: 380, 916: 348 }) // Fallback initial
    const [loading, setLoading] = useState(true)

    // Fetch live prices
    useState(() => {
        const fetchPrices = async () => {
            try {
                const res = await fetch('/api/prices')
                const data = await res.json()
                if (data.gold) {
                    setPrices({
                        999: data.gold.gram999,
                        916: data.gold.gram916
                    })
                }
            } catch (error) {
                console.error('Failed to load prices:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchPrices()
    }, [])

    const currentGoldPrice = prices[assets.goldType] || 0
    // Dynamic Nisab: 85g * Price of 999 Gold
    const nisabValue = NISAB_GRAMS * (prices['999'] || 0)

    const goldValue = (parseFloat(assets.goldWeight) || 0) * currentGoldPrice
    const savingsValue = parseFloat(assets.savings) || 0
    const stocksValue = parseFloat(assets.stocks) || 0
    const totalAssets = goldValue + savingsValue + stocksValue

    const isAboveNisab = totalAssets >= nisabValue
    const zakatDue = isAboveNisab ? totalAssets * 0.025 : 0

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div className="glass-card">
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-dark-300">Gold (grams)</label>
                        <div className="flex gap-2">
                            {['999', '916'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setAssets(p => ({ ...p, goldType: type }))}
                                    className={`text-xs px-2 py-1 rounded border ${assets.goldType === type ? 'bg-gold-500/20 border-gold-500 text-gold-400' : 'border-dark-600 text-dark-400'}`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="relative">
                        <input
                            type="number"
                            value={assets.goldWeight}
                            onChange={(e) => setAssets(p => ({ ...p, goldWeight: e.target.value }))}
                            placeholder="e.g. 100"
                            className="input-field"
                        />
                    </div>
                    <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-gold-400 font-medium">Value: RM {goldValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                        <p className="text-xs text-dark-400">
                            {loading ? 'Fetching...' : `Rate: RM ${currentGoldPrice.toFixed(2)}/g`}
                        </p>
                    </div>
                </div>
                <div className="glass-card">
                    <label className="block text-sm font-medium text-dark-300 mb-2">Savings (RM)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 font-medium">RM</span>
                        <input type="number" value={assets.savings} onChange={(e) => setAssets(p => ({ ...p, savings: e.target.value }))} placeholder="15000" className="input-field !pl-12" />
                    </div>
                </div>
                <div className="glass-card">
                    <label className="block text-sm font-medium text-dark-300 mb-2">Halal Stocks (RM)</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400 font-medium">RM</span>
                        <input type="number" value={assets.stocks} onChange={(e) => setAssets(p => ({ ...p, stocks: e.target.value }))} placeholder="50000" className="input-field !pl-12" />
                    </div>
                </div>
            </div>

            <div className="glass-card bg-gradient-to-br from-primary-500/10 to-gold-500/10">
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <p className="text-sm text-dark-400">Total Assets</p>
                        <p className="text-2xl font-bold text-white">RM {totalAssets.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                    </div>
                    <div>
                        <p className="text-sm text-dark-400">Nisab Threshold (85g Gold)</p>
                        <p className="text-lg font-semibold text-dark-300">RM {nisabValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        <p className={`text-sm ${isAboveNisab ? 'text-primary-400' : 'text-dark-400'}`}>{isAboveNisab ? '✓ Above Nisab' : '✗ Below Nisab'}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-dark-400">Zakat Due (2.5%)</p>
                        <p className="text-3xl font-bold text-gold-400">RM {zakatDue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function CryptoCalculator() {
    const [holdings, setHoldings] = useState({ btc: '', eth: '' })
    const [prices, setPrices] = useState({ btc: 0, eth: 0, gold999: 0 })
    const [loading, setLoading] = useState(true)

    // Fetch live prices on mount
    useState(() => {
        const fetchPrices = async () => {
            try {
                const res = await fetch('/api/prices')
                const data = await res.json()
                if (data.btc && data.eth) {
                    setPrices({
                        btc: data.btc,
                        eth: data.eth,
                        gold999: data.gold?.gram999 || 0
                    })
                }
            } catch (error) {
                console.error('Failed to load prices:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchPrices()
    }, [])

    const btcValue = (parseFloat(holdings.btc) || 0) * prices.btc
    const ethValue = (parseFloat(holdings.eth) || 0) * prices.eth
    const totalCrypto = btcValue + ethValue

    // Crypto Nisab follows Gold Standard (85g)
    const cryptoNisab = 85 * prices.gold999
    const isAboveNisab = totalCrypto >= cryptoNisab
    const zakatDue = isAboveNisab ? totalCrypto * 0.025 : 0

    return (
        <div className="space-y-6">
            <div className="glass-card">
                <h3 className="text-lg font-semibold text-white mb-4">Your Crypto Holdings</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-dark-400 mb-2">Bitcoin (BTC) <span className="text-xs text-dark-500">{loading ? 'Loading...' : `~RM ${prices.btc.toLocaleString()}`}</span></label>
                        <div className="relative">
                            <Bitcoin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gold-500" />
                            <input type="number" value={holdings.btc} onChange={(e) => setHoldings(p => ({ ...p, btc: e.target.value }))} placeholder="e.g. 0.5" className="input-field !pl-10" />
                        </div>
                        <p className="text-sm text-gold-400 mt-1">= RM {btcValue.toLocaleString()}</p>
                    </div>
                    <div>
                        <label className="block text-sm text-dark-400 mb-2">Ethereum (ETH) <span className="text-xs text-dark-500">{loading ? 'Loading...' : `~RM ${prices.eth.toLocaleString()}`}</span></label>
                        <div className="relative">
                            <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                            <input type="number" value={holdings.eth} onChange={(e) => setHoldings(p => ({ ...p, eth: e.target.value }))} placeholder="e.g. 5" className="input-field !pl-10" />
                        </div>
                        <p className="text-sm text-gold-400 mt-1">= RM {ethValue.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="glass-card bg-gradient-to-br from-primary-500/10 to-gold-500/10">
                <div className="grid grid-cols-3 gap-6">
                    <div>
                        <p className="text-sm text-dark-400">Total Crypto Value</p>
                        <p className="text-2xl font-bold text-white">RM {totalCrypto.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                    </div>
                    <div>
                        <p className="text-sm text-dark-400">Nisab Threshold (85g Gold)</p>
                        <p className="text-lg font-semibold text-dark-300">RM {cryptoNisab.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                        <p className={`text-sm ${isAboveNisab ? 'text-primary-400' : 'text-dark-400'}`}>{isAboveNisab ? '✓ Above Nisab' : '✗ Below Nisab'}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-dark-400">Zakat Due (2.5%)</p>
                        <p className="text-3xl font-bold text-gold-400">RM {zakatDue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                    </div>
                </div>
            </div>

            <div className="glass-card border-gold-500/30">
                <div className="flex items-center gap-2 mb-2">
                    <Info className="w-5 h-5 text-gold-400" />
                    <span className="font-medium text-gold-400">Scholar Note</span>
                </div>
                <p className="text-sm text-dark-300">
                    Cryptocurrencies are generally treated as 'Urud al-Tijarah' (Trade Goods) or 'Nuqud' (Currency).
                    Therefore, the standard 2.5% rate applies if the total value exceeds the value of 85g of Gold (Nisab).
                </p>
            </div>
        </div>
    )
}

export default function Zakat() {
    const [activeTab, setActiveTab] = useState('traditional')

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Zakat Calculator</h1>
                <p className="text-dark-400">Calculate your zakat accurately with transparent multi-method options</p>
            </div>

            <div className="flex gap-4">
                <button onClick={() => setActiveTab('traditional')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'traditional' ? 'bg-primary-500 text-white' : 'bg-dark-800 text-dark-300 hover:bg-dark-700'}`}>
                    <Coins className="w-5 h-5" /> Traditional
                </button>
                <button onClick={() => setActiveTab('crypto')} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'crypto' ? 'bg-primary-500 text-white' : 'bg-dark-800 text-dark-300 hover:bg-dark-700'}`}>
                    <Bitcoin className="w-5 h-5" /> Crypto
                </button>
            </div>

            {activeTab === 'traditional' ? <TraditionalCalculator /> : <CryptoCalculator />}
        </div>
    )
}
