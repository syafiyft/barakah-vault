'use client'

import { useState, useEffect } from 'react'
import {
    Coins, Bitcoin, Info, Calculator, History, Settings, Check, X,
    Loader2, RefreshCw, Download, Calendar, Wallet, ChevronDown, ChevronUp,
    CheckCircle, Clock, AlertCircle, TrendingUp, Trash2
} from 'lucide-react'
import { toast } from 'sonner'

const NISAB_GRAMS = 85

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-MY', {
        style: 'currency',
        currency: 'MYR',
        minimumFractionDigits: 2,
    }).format(amount)
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-MY', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

// Haul Configuration Component
function HaulConfig({ config, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false)
    const [haulDate, setHaulDate] = useState('')

    useEffect(() => {
        if (config?.haulStartDate) {
            setHaulDate(new Date(config.haulStartDate).toISOString().split('T')[0])
        }
    }, [config])

    const handleSave = async () => {
        await onUpdate(haulDate)
        setIsEditing(false)
    }

    const haulEndDate = config?.haulStartDate
        ? new Date(new Date(config.haulStartDate).setFullYear(new Date(config.haulStartDate).getFullYear() + 1))
        : null

    return (
        <div className="glass-card">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gold-500/20 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Your Haul Year</h3>
                        {isEditing ? (
                            <input
                                type="date"
                                value={haulDate}
                                onChange={(e) => setHaulDate(e.target.value)}
                                className="mt-1 px-2 py-1 bg-dark-700 border border-dark-600 rounded text-sm text-white"
                            />
                        ) : (
                            <p className="text-sm text-dark-400">
                                Started: {config?.haulStartDate ? formatDate(config.haulStartDate) : 'Not set'}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {!isEditing && config?.daysUntilHaul !== undefined && (
                        <div className="text-right">
                            <p className="text-2xl font-bold text-gold-400">{config.daysUntilHaul}</p>
                            <p className="text-xs text-dark-400">days until due</p>
                        </div>
                    )}
                    {isEditing ? (
                        <div className="flex gap-2">
                            <button onClick={() => setIsEditing(false)} className="p-2 text-dark-400 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                            <button onClick={handleSave} className="p-2 text-primary-400 hover:text-primary-300">
                                <Check className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-sm text-primary-400 hover:text-primary-300"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

// Portfolio Import Component
function PortfolioAssets({ calculation, excludedIds, onToggleExclude }) {
    const [expandedSection, setExpandedSection] = useState(null)

    const sections = [
        {
            key: 'savings',
            label: 'Savings',
            total: calculation?.savings?.total || 0,
            holdings: calculation?.savings?.holdings || [],
            color: 'green',
        },
        {
            key: 'stocks',
            label: 'Stocks',
            total: calculation?.stocks?.total || 0,
            holdings: calculation?.stocks?.holdings || [],
            color: 'blue',
        },
        {
            key: 'crypto',
            label: 'Crypto',
            total: calculation?.crypto?.total || 0,
            holdings: calculation?.crypto?.holdings || [],
            color: 'orange',
        },
    ]

    return (
        <div className="space-y-3">
            {sections.map((section) => (
                <div key={section.key} className="bg-dark-800/50 rounded-xl overflow-hidden">
                    <button
                        onClick={() => setExpandedSection(expandedSection === section.key ? null : section.key)}
                        className="w-full flex items-center justify-between p-4 hover:bg-dark-800 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full bg-${section.color}-500`} />
                            <span className="text-white font-medium">{section.label}</span>
                            <span className="text-xs text-dark-400">({section.holdings.length} items)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`font-semibold text-${section.color}-400`}>
                                {formatCurrency(section.total)}
                            </span>
                            {expandedSection === section.key ? (
                                <ChevronUp className="w-4 h-4 text-dark-400" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-dark-400" />
                            )}
                        </div>
                    </button>

                    {expandedSection === section.key && section.holdings.length > 0 && (
                        <div className="px-4 pb-4 space-y-2">
                            {section.holdings.map((holding) => {
                                const isExcluded = excludedIds.includes(holding.id)
                                return (
                                    <div
                                        key={holding.id}
                                        className={`flex items-center justify-between p-3 rounded-lg ${isExcluded ? 'bg-dark-700/50 opacity-50' : 'bg-dark-700'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => onToggleExclude(holding.id)}
                                                className={`w-5 h-5 rounded border flex items-center justify-center ${isExcluded ? 'border-dark-500' : 'border-primary-500 bg-primary-500/20'}`}
                                            >
                                                {!isExcluded && <Check className="w-3 h-3 text-primary-400" />}
                                            </button>
                                            <div>
                                                <p className="text-sm text-white">{holding.name || holding.symbol}</p>
                                                {holding.quantity && (
                                                    <p className="text-xs text-dark-400">
                                                        {holding.quantity} {holding.symbol} @ {formatCurrency(holding.price || 0)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <span className="text-sm text-white">{formatCurrency(holding.value)}</span>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

// Main Calculator Component
function ZakatCalculator({ onSave, zakatData }) {
    const [loading, setLoading] = useState(true)
    const [calculating, setCalculating] = useState(false)
    const [calculation, setCalculation] = useState(null)
    const [prices, setPrices] = useState(null)
    const [excludedIds, setExcludedIds] = useState([])
    const [manualAssets, setManualAssets] = useState({
        gold999: '',
        gold916: '',
        additionalSavings: '',
        otherAssets: '',
    })
    const [saving, setSaving] = useState(false)

    // Fetch calculation from portfolio
    const fetchCalculation = async () => {
        setCalculating(true)
        try {
            const res = await fetch('/api/zakat/calculate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    includePortfolio: true,
                    manualAssets: {
                        gold999: parseFloat(manualAssets.gold999) || 0,
                        gold916: parseFloat(manualAssets.gold916) || 0,
                        additionalSavings: parseFloat(manualAssets.additionalSavings) || 0,
                        otherAssets: parseFloat(manualAssets.otherAssets) || 0,
                    },
                    excludeHoldings: excludedIds,
                }),
            })
            const data = await res.json()
            setCalculation(data.calculation)
            setPrices(data.prices)
        } catch (error) {
            console.error('Failed to calculate:', error)
        }
        setCalculating(false)
        setLoading(false)
    }

    useEffect(() => {
        fetchCalculation()
    }, [])

    // Recalculate when inputs change
    useEffect(() => {
        if (!loading) {
            const timer = setTimeout(() => {
                fetchCalculation()
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [manualAssets, excludedIds])

    const handleToggleExclude = (id) => {
        setExcludedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const handleSaveCalculation = async () => {
        if (!calculation) return
        setSaving(true)
        try {
            const res = await fetch('/api/zakat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'save',
                    calculation,
                    assets: {
                        gold: calculation.gold,
                        savings: calculation.savings.total,
                        stocks: {
                            totalValue: calculation.stocks.total,
                            holdings: calculation.stocks.holdings,
                        },
                        crypto: {
                            totalValue: calculation.crypto.total,
                            holdings: calculation.crypto.holdings,
                        },
                        otherAssets: calculation.otherAssets,
                    },
                    prices,
                }),
            })
            if (res.ok) {
                onSave()
                toast.success('Calculation saved successfully')
            }
        } catch (error) {
            console.error('Failed to save:', error)
            toast.error('Failed to save calculation')
        }
        setSaving(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Nisab Info */}
            <div className="grid grid-cols-2 gap-4">
                <div className="glass-card">
                    <p className="text-sm text-dark-400 mb-1">Nisab Threshold (85g Gold)</p>
                    <p className="text-2xl font-bold text-white">
                        {formatCurrency(calculation?.nisabThreshold || 0)}
                    </p>
                    <p className="text-xs text-dark-500 mt-1">
                        Gold price: {formatCurrency(prices?.gold999 || 0)}/gram
                    </p>
                </div>
                <div className="glass-card">
                    <p className="text-sm text-dark-400 mb-1">Status</p>
                    {calculation?.aboveNisab ? (
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-6 h-6 text-primary-400" />
                            <span className="text-xl font-bold text-primary-400">Above Nisab</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-6 h-6 text-dark-400" />
                            <span className="text-xl font-bold text-dark-400">Below Nisab</span>
                        </div>
                    )}
                    <p className="text-xs text-dark-500 mt-1">Zakat is obligatory when above Nisab</p>
                </div>
            </div>

            {/* Gold Input (Manual) */}
            <div className="glass-card">
                <h3 className="font-semibold text-white mb-4">Gold Holdings (Manual Entry)</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-dark-400 mb-2">999 Karat (grams)</label>
                        <input
                            type="number"
                            value={manualAssets.gold999}
                            onChange={(e) => setManualAssets(p => ({ ...p, gold999: e.target.value }))}
                            placeholder="0"
                            className="input-field"
                        />
                        <p className="text-xs text-dark-500 mt-1">
                            = {formatCurrency((parseFloat(manualAssets.gold999) || 0) * (prices?.gold999 || 0))}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm text-dark-400 mb-2">916 Karat (grams)</label>
                        <input
                            type="number"
                            value={manualAssets.gold916}
                            onChange={(e) => setManualAssets(p => ({ ...p, gold916: e.target.value }))}
                            placeholder="0"
                            className="input-field"
                        />
                        <p className="text-xs text-dark-500 mt-1">
                            = {formatCurrency((parseFloat(manualAssets.gold916) || 0) * (prices?.gold916 || 0))}
                        </p>
                    </div>
                </div>
            </div>

            {/* Portfolio Assets */}
            <div className="glass-card">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Portfolio Assets</h3>
                    <button
                        onClick={fetchCalculation}
                        disabled={calculating}
                        className="flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"
                    >
                        <RefreshCw className={`w-4 h-4 ${calculating ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
                <PortfolioAssets
                    calculation={calculation}
                    excludedIds={excludedIds}
                    onToggleExclude={handleToggleExclude}
                />
            </div>

            {/* Additional Assets */}
            <div className="glass-card">
                <h3 className="font-semibold text-white mb-4">Additional Assets</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-dark-400 mb-2">Additional Savings (RM)</label>
                        <input
                            type="number"
                            value={manualAssets.additionalSavings}
                            onChange={(e) => setManualAssets(p => ({ ...p, additionalSavings: e.target.value }))}
                            placeholder="0"
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-dark-400 mb-2">Other Zakatable Assets (RM)</label>
                        <input
                            type="number"
                            value={manualAssets.otherAssets}
                            onChange={(e) => setManualAssets(p => ({ ...p, otherAssets: e.target.value }))}
                            placeholder="0"
                            className="input-field"
                        />
                    </div>
                </div>
            </div>

            {/* Calculation Result */}
            <div className="glass-card bg-gradient-to-br from-primary-500/10 to-gold-500/10 border-primary-500/20">
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                        <p className="text-sm text-dark-400 mb-1">Total Zakatable Assets</p>
                        <p className="text-3xl font-bold text-white">
                            {formatCurrency(calculation?.totalAssets || 0)}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-dark-400 mb-1">Zakat Due (2.5%)</p>
                        <p className="text-3xl font-bold text-gold-400">
                            {formatCurrency(calculation?.zakatDue || 0)}
                        </p>
                    </div>
                </div>

                {/* Breakdown */}
                <div className="pt-4 border-t border-dark-700 grid grid-cols-5 gap-4 text-center">
                    <div>
                        <p className="text-xs text-dark-500">Gold</p>
                        <p className="text-sm font-semibold text-gold-400">
                            {formatCurrency(calculation?.gold?.value || 0)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-dark-500">Savings</p>
                        <p className="text-sm font-semibold text-green-400">
                            {formatCurrency(calculation?.savings?.total || 0)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-dark-500">Stocks</p>
                        <p className="text-sm font-semibold text-blue-400">
                            {formatCurrency(calculation?.stocks?.total || 0)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-dark-500">Crypto</p>
                        <p className="text-sm font-semibold text-orange-400">
                            {formatCurrency(calculation?.crypto?.total || 0)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-dark-500">Other</p>
                        <p className="text-sm font-semibold text-purple-400">
                            {formatCurrency(calculation?.otherAssets || 0)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            {calculation?.zakatDue > 0 && (
                <button
                    onClick={handleSaveCalculation}
                    disabled={saving}
                    className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {saving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Check className="w-5 h-5" />
                    )}
                    Save Calculation
                </button>
            )}
        </div>
    )
}

// History Component
function ZakatHistory({ records, onMarkPaid, onRefresh }) {
    const [payingRecord, setPayingRecord] = useState(null)
    const [paymentAmount, setPaymentAmount] = useState('')
    const [paymentMethod, setPaymentMethod] = useState('bank_transfer')
    const [deletingRecord, setDeletingRecord] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleMarkPaid = async () => {
        if (!payingRecord) return

        try {
            const res = await fetch('/api/zakat', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'markPaid',
                    recordId: payingRecord._id,
                    paidAmount: parseFloat(paymentAmount) || payingRecord.zakatDue,
                    paymentMethod,
                }),
            })
            if (res.ok) {
                onRefresh()
                setPayingRecord(null)
                setPaymentAmount('')
            }
        } catch (error) {
            console.error('Failed to mark paid:', error)
        }
    }

    const handleDelete = async (recordId) => {
        setIsDeleting(true)
        try {
            const res = await fetch('/api/zakat', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'deleteRecord',
                    recordId,
                }),
            })
            if (res.ok) {
                onRefresh()
                setDeletingRecord(null)
            }
        } catch (error) {
            console.error('Failed to delete record:', error)
        }
        setIsDeleting(false)
    }

    const getStatusBadge = (status) => {
        switch (status) {
            case 'paid':
                return (
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-primary-500/20 text-primary-400">
                        <CheckCircle className="w-3 h-3" /> Paid
                    </span>
                )
            case 'partial':
                return (
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-gold-500/20 text-gold-400">
                        <Clock className="w-3 h-3" /> Partial
                    </span>
                )
            default:
                return (
                    <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-dark-700 text-dark-400">
                        <AlertCircle className="w-3 h-3" /> Pending
                    </span>
                )
        }
    }

    if (!records || records.length === 0) {
        return (
            <div className="glass-card text-center py-12">
                <History className="w-12 h-12 text-dark-500 mx-auto mb-4" />
                <p className="text-dark-400">No Zakat calculations saved yet</p>
                <p className="text-sm text-dark-500 mt-1">Calculate your Zakat and save it to see history</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Delete Confirmation Modal */}
            {deletingRecord && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-card max-w-md w-full">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                                <Trash2 className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">Delete Record</h3>
                                <p className="text-sm text-dark-400">This action cannot be undone</p>
                            </div>
                        </div>
                        <p className="text-dark-300 mb-4">
                            Are you sure you want to delete the Zakat record for {deletingRecord.haulYear}?
                            This will remove the calculation of {formatCurrency(deletingRecord.zakatDue)}.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeletingRecord(null)}
                                disabled={isDeleting}
                                className="flex-1 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deletingRecord._id)}
                                disabled={isDeleting}
                                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {records.map((record) => (
                <div key={record._id} className="glass-card">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-white">Zakat {record.haulYear}</h3>
                                {getStatusBadge(record.status)}
                            </div>
                            <p className="text-sm text-dark-400">
                                Calculated: {formatDate(record.calculatedAt)}
                            </p>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gold-400">{formatCurrency(record.zakatDue)}</p>
                                {record.paidAmount > 0 && (
                                    <p className="text-sm text-primary-400">
                                        Paid: {formatCurrency(record.paidAmount)}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => setDeletingRecord(record)}
                                className="p-2 text-dark-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                title="Delete record"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 py-3 border-t border-dark-700">
                        <div>
                            <p className="text-xs text-dark-500">Total Assets</p>
                            <p className="text-sm font-medium text-white">{formatCurrency(record.totalAssets)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-dark-500">Nisab</p>
                            <p className="text-sm font-medium text-white">{formatCurrency(record.nisabThreshold)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-dark-500">Gold Price</p>
                            <p className="text-sm font-medium text-white">{formatCurrency(record.nisabGoldPrice)}/g</p>
                        </div>
                        <div>
                            <p className="text-xs text-dark-500">Remaining</p>
                            <p className="text-sm font-medium text-white">
                                {formatCurrency(Math.max(0, record.zakatDue - (record.paidAmount || 0)))}
                            </p>
                        </div>
                    </div>

                    {record.status !== 'paid' && (
                        <div className="pt-4 border-t border-dark-700">
                            {payingRecord?._id === record._id ? (
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="number"
                                            value={paymentAmount}
                                            onChange={(e) => setPaymentAmount(e.target.value)}
                                            placeholder={`Amount (max ${record.zakatDue - (record.paidAmount || 0)})`}
                                            className="input-field text-sm"
                                        />
                                        <select
                                            value={paymentMethod}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="input-field text-sm"
                                        >
                                            <option value="bank_transfer">Bank Transfer</option>
                                            <option value="cash">Cash</option>
                                            <option value="organization">Zakat Organization</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPayingRecord(null)}
                                            className="flex-1 py-2 bg-dark-700 text-white rounded-lg text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleMarkPaid}
                                            className="flex-1 py-2 bg-primary-500 text-white rounded-lg text-sm"
                                        >
                                            Confirm Payment
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        setPayingRecord(record)
                                        setPaymentAmount((record.zakatDue - (record.paidAmount || 0)).toFixed(2))
                                    }}
                                    className="w-full py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg text-sm flex items-center justify-center gap-2"
                                >
                                    <Wallet className="w-4 h-4" />
                                    Mark as Paid
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

// Traditional Zakat Calculator Component
function TraditionalCalculator({ prices, onRefreshPrices }) {
    const [assets, setAssets] = useState({
        gold999: '',
        gold916: '',
        silver: '',
        cash: '',
        savings: '',
        stocks: '',
        business: '',
        other: '',
    })

    const goldValue = (parseFloat(assets.gold999) || 0) * (prices?.gold999 || 385) +
        (parseFloat(assets.gold916) || 0) * (prices?.gold916 || 352)
    const silverValue = (parseFloat(assets.silver) || 0) * (prices?.silver || 3.5)
    const cashValue = parseFloat(assets.cash) || 0
    const savingsValue = parseFloat(assets.savings) || 0
    const stocksValue = parseFloat(assets.stocks) || 0
    const businessValue = parseFloat(assets.business) || 0
    const otherValue = parseFloat(assets.other) || 0

    const totalAssets = goldValue + silverValue + cashValue + savingsValue + stocksValue + businessValue + otherValue
    const nisabThreshold = NISAB_GRAMS * (prices?.gold999 || 385)
    const aboveNisab = totalAssets >= nisabThreshold
    const zakatDue = aboveNisab ? totalAssets * 0.025 : 0

    return (
        <div className="space-y-6">
            {/* Nisab Info */}
            <div className="grid grid-cols-2 gap-4">
                <div className="glass-card">
                    <p className="text-sm text-dark-400 mb-1">Nisab Threshold (85g Gold)</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(nisabThreshold)}</p>
                    <p className="text-xs text-dark-500 mt-1">Gold: {formatCurrency(prices?.gold999 || 385)}/g</p>
                </div>
                <div className="glass-card">
                    <p className="text-sm text-dark-400 mb-1">Status</p>
                    {aboveNisab ? (
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-6 h-6 text-primary-400" />
                            <span className="text-xl font-bold text-primary-400">Above Nisab</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-6 h-6 text-dark-400" />
                            <span className="text-xl font-bold text-dark-400">Below Nisab</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Gold & Silver */}
            <div className="glass-card">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Coins className="w-5 h-5 text-gold-400" />
                    Precious Metals
                </h3>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm text-dark-400 mb-2">Gold 999 (grams)</label>
                        <input
                            type="number"
                            value={assets.gold999}
                            onChange={(e) => setAssets(p => ({ ...p, gold999: e.target.value }))}
                            placeholder="0"
                            className="input-field"
                        />
                        <p className="text-xs text-gold-500 mt-1">= {formatCurrency((parseFloat(assets.gold999) || 0) * (prices?.gold999 || 385))}</p>
                    </div>
                    <div>
                        <label className="block text-sm text-dark-400 mb-2">Gold 916 (grams)</label>
                        <input
                            type="number"
                            value={assets.gold916}
                            onChange={(e) => setAssets(p => ({ ...p, gold916: e.target.value }))}
                            placeholder="0"
                            className="input-field"
                        />
                        <p className="text-xs text-gold-500 mt-1">= {formatCurrency((parseFloat(assets.gold916) || 0) * (prices?.gold916 || 352))}</p>
                    </div>
                    <div>
                        <label className="block text-sm text-dark-400 mb-2">Silver (grams)</label>
                        <input
                            type="number"
                            value={assets.silver}
                            onChange={(e) => setAssets(p => ({ ...p, silver: e.target.value }))}
                            placeholder="0"
                            className="input-field"
                        />
                        <p className="text-xs text-dark-500 mt-1">= {formatCurrency((parseFloat(assets.silver) || 0) * (prices?.silver || 3.5))}</p>
                    </div>
                </div>
            </div>

            {/* Cash & Savings */}
            <div className="glass-card">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-green-400" />
                    Cash & Savings
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-dark-400 mb-2">Cash on Hand (RM)</label>
                        <input
                            type="number"
                            value={assets.cash}
                            onChange={(e) => setAssets(p => ({ ...p, cash: e.target.value }))}
                            placeholder="0"
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-dark-400 mb-2">Bank Savings (RM)</label>
                        <input
                            type="number"
                            value={assets.savings}
                            onChange={(e) => setAssets(p => ({ ...p, savings: e.target.value }))}
                            placeholder="0"
                            className="input-field"
                        />
                    </div>
                </div>
            </div>

            {/* Investments & Business */}
            <div className="glass-card">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    Investments & Business
                </h3>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm text-dark-400 mb-2">Stocks Value (RM)</label>
                        <input
                            type="number"
                            value={assets.stocks}
                            onChange={(e) => setAssets(p => ({ ...p, stocks: e.target.value }))}
                            placeholder="0"
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-dark-400 mb-2">Business Assets (RM)</label>
                        <input
                            type="number"
                            value={assets.business}
                            onChange={(e) => setAssets(p => ({ ...p, business: e.target.value }))}
                            placeholder="0"
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-dark-400 mb-2">Other Assets (RM)</label>
                        <input
                            type="number"
                            value={assets.other}
                            onChange={(e) => setAssets(p => ({ ...p, other: e.target.value }))}
                            placeholder="0"
                            className="input-field"
                        />
                    </div>
                </div>
            </div>

            {/* Result */}
            <div className="glass-card bg-gradient-to-br from-primary-500/10 to-gold-500/10 border-primary-500/20">
                <div className="grid grid-cols-2 gap-6 mb-4">
                    <div>
                        <p className="text-sm text-dark-400 mb-1">Total Zakatable Assets</p>
                        <p className="text-3xl font-bold text-white">{formatCurrency(totalAssets)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-dark-400 mb-1">Zakat Due (2.5%)</p>
                        <p className="text-3xl font-bold text-gold-400">{formatCurrency(zakatDue)}</p>
                    </div>
                </div>
                <div className="pt-4 border-t border-dark-700 grid grid-cols-4 gap-4 text-center text-sm">
                    <div>
                        <p className="text-xs text-dark-500">Gold & Silver</p>
                        <p className="font-semibold text-gold-400">{formatCurrency(goldValue + silverValue)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-dark-500">Cash & Savings</p>
                        <p className="font-semibold text-green-400">{formatCurrency(cashValue + savingsValue)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-dark-500">Stocks</p>
                        <p className="font-semibold text-blue-400">{formatCurrency(stocksValue)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-dark-500">Business & Other</p>
                        <p className="font-semibold text-purple-400">{formatCurrency(businessValue + otherValue)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Crypto Zakat Calculator Component
function CryptoCalculator({ prices }) {
    const [method, setMethod] = useState('market') // 'market', 'cost', 'average'
    const [holdings, setHoldings] = useState({
        btc: '',
        btcCost: '',
        eth: '',
        ethCost: '',
        other: '',
    })

    const btcPrice = prices?.btc || 440000
    const ethPrice = prices?.eth || 15000

    // Calculate values based on method
    const getBtcValue = () => {
        const qty = parseFloat(holdings.btc) || 0
        if (method === 'market') return qty * btcPrice
        if (method === 'cost') return parseFloat(holdings.btcCost) || 0
        return ((qty * btcPrice) + (parseFloat(holdings.btcCost) || 0)) / 2
    }

    const getEthValue = () => {
        const qty = parseFloat(holdings.eth) || 0
        if (method === 'market') return qty * ethPrice
        if (method === 'cost') return parseFloat(holdings.ethCost) || 0
        return ((qty * ethPrice) + (parseFloat(holdings.ethCost) || 0)) / 2
    }

    const btcValue = getBtcValue()
    const ethValue = getEthValue()
    const otherValue = parseFloat(holdings.other) || 0
    const totalAssets = btcValue + ethValue + otherValue
    const nisabThreshold = NISAB_GRAMS * (prices?.gold999 || 385)
    const aboveNisab = totalAssets >= nisabThreshold
    const zakatDue = aboveNisab ? totalAssets * 0.025 : 0

    return (
        <div className="space-y-6">
            {/* Method Selection */}
            <div className="glass-card">
                <h3 className="font-semibold text-white mb-4">Valuation Method</h3>
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { id: 'market', label: 'Market Value', desc: 'Current market price' },
                        { id: 'cost', label: 'Cost Basis', desc: 'Original purchase price' },
                        { id: 'average', label: 'Average', desc: 'Average of both methods' },
                    ].map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setMethod(m.id)}
                            className={`p-3 rounded-xl border text-left transition-all ${method === m.id
                                ? 'border-primary-500 bg-primary-500/10'
                                : 'border-dark-700 hover:border-dark-600'
                                }`}
                        >
                            <p className={`font-medium ${method === m.id ? 'text-primary-400' : 'text-white'}`}>
                                {m.label}
                            </p>
                            <p className="text-xs text-dark-400">{m.desc}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Nisab Info */}
            <div className="grid grid-cols-2 gap-4">
                <div className="glass-card">
                    <p className="text-sm text-dark-400 mb-1">Nisab Threshold</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(nisabThreshold)}</p>
                </div>
                <div className="glass-card">
                    <p className="text-sm text-dark-400 mb-1">Status</p>
                    {aboveNisab ? (
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-6 h-6 text-primary-400" />
                            <span className="text-xl font-bold text-primary-400">Above Nisab</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <AlertCircle className="w-6 h-6 text-dark-400" />
                            <span className="text-xl font-bold text-dark-400">Below Nisab</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Bitcoin */}
            <div className="glass-card">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Bitcoin className="w-5 h-5 text-orange-400" />
                    Bitcoin (BTC)
                    <span className="text-xs text-dark-400 font-normal ml-auto">
                        Market: {formatCurrency(btcPrice)}
                    </span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-dark-400 mb-2">Quantity (BTC)</label>
                        <input
                            type="number"
                            step="0.00000001"
                            value={holdings.btc}
                            onChange={(e) => setHoldings(p => ({ ...p, btc: e.target.value }))}
                            placeholder="0.00"
                            className="input-field"
                        />
                        <p className="text-xs text-orange-500 mt-1">
                            Market Value: {formatCurrency((parseFloat(holdings.btc) || 0) * btcPrice)}
                        </p>
                    </div>
                    {method !== 'market' && (
                        <div>
                            <label className="block text-sm text-dark-400 mb-2">Cost Basis (RM)</label>
                            <input
                                type="number"
                                value={holdings.btcCost}
                                onChange={(e) => setHoldings(p => ({ ...p, btcCost: e.target.value }))}
                                placeholder="0"
                                className="input-field"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Ethereum */}
            <div className="glass-card">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-400">Ξ</span>
                    </div>
                    Ethereum (ETH)
                    <span className="text-xs text-dark-400 font-normal ml-auto">
                        Market: {formatCurrency(ethPrice)}
                    </span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm text-dark-400 mb-2">Quantity (ETH)</label>
                        <input
                            type="number"
                            step="0.00000001"
                            value={holdings.eth}
                            onChange={(e) => setHoldings(p => ({ ...p, eth: e.target.value }))}
                            placeholder="0.00"
                            className="input-field"
                        />
                        <p className="text-xs text-blue-500 mt-1">
                            Market Value: {formatCurrency((parseFloat(holdings.eth) || 0) * ethPrice)}
                        </p>
                    </div>
                    {method !== 'market' && (
                        <div>
                            <label className="block text-sm text-dark-400 mb-2">Cost Basis (RM)</label>
                            <input
                                type="number"
                                value={holdings.ethCost}
                                onChange={(e) => setHoldings(p => ({ ...p, ethCost: e.target.value }))}
                                placeholder="0"
                                className="input-field"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Other Crypto */}
            <div className="glass-card">
                <h3 className="font-semibold text-white mb-4">Other Cryptocurrencies</h3>
                <div>
                    <label className="block text-sm text-dark-400 mb-2">Total Value (RM)</label>
                    <input
                        type="number"
                        value={holdings.other}
                        onChange={(e) => setHoldings(p => ({ ...p, other: e.target.value }))}
                        placeholder="0"
                        className="input-field"
                    />
                </div>
            </div>

            {/* Result */}
            <div className="glass-card bg-gradient-to-br from-orange-500/10 to-primary-500/10 border-orange-500/20">
                <div className="grid grid-cols-2 gap-6 mb-4">
                    <div>
                        <p className="text-sm text-dark-400 mb-1">Total Crypto Assets</p>
                        <p className="text-3xl font-bold text-white">{formatCurrency(totalAssets)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-dark-400 mb-1">Zakat Due (2.5%)</p>
                        <p className="text-3xl font-bold text-orange-400">{formatCurrency(zakatDue)}</p>
                    </div>
                </div>
                <div className="pt-4 border-t border-dark-700 grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                        <p className="text-xs text-dark-500">Bitcoin</p>
                        <p className="font-semibold text-orange-400">{formatCurrency(btcValue)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-dark-500">Ethereum</p>
                        <p className="font-semibold text-blue-400">{formatCurrency(ethValue)}</p>
                    </div>
                    <div>
                        <p className="text-xs text-dark-500">Other</p>
                        <p className="font-semibold text-purple-400">{formatCurrency(otherValue)}</p>
                    </div>
                </div>
                <p className="text-xs text-dark-500 mt-3 text-center">
                    Calculated using: {method === 'market' ? 'Market Value' : method === 'cost' ? 'Cost Basis' : 'Average Method'}
                </p>
            </div>
        </div>
    )
}

// Main Page Component
export default function ZakatPage() {
    const [activeTab, setActiveTab] = useState('portfolio')
    const [zakatData, setZakatData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [prices, setPrices] = useState(null)

    const fetchZakatData = async () => {
        try {
            const res = await fetch('/api/zakat')
            if (res.ok) {
                const data = await res.json()
                setZakatData(data)
            }
        } catch (error) {
            console.error('Failed to fetch Zakat data:', error)
        }
        setLoading(false)
    }

    const fetchPrices = async () => {
        try {
            const res = await fetch('/api/prices')
            if (res.ok) {
                const data = await res.json()
                setPrices({
                    gold999: data.gold?.gram999 || 385,
                    gold916: data.gold?.gram916 || 352,
                    silver: 3.5,
                    btc: data.btc || 440000,
                    eth: data.eth || 15000,
                })
            }
        } catch (error) {
            console.error('Failed to fetch prices:', error)
        }
    }

    useEffect(() => {
        fetchZakatData()
        fetchPrices()
    }, [])

    const handleUpdateConfig = async (haulDate) => {
        try {
            await fetch('/api/zakat', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'updateConfig',
                    haulStartDate: haulDate,
                }),
            })
            fetchZakatData()
        } catch (error) {
            console.error('Failed to update config:', error)
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Zakat Calculator</h1>
                    <p className="text-dark-400">Calculate and track your Zakat obligations</p>
                </div>
                {zakatData?.summary && (
                    <div className="text-right">
                        <p className="text-sm text-dark-400">Total Paid (All Time)</p>
                        <p className="text-xl font-bold text-primary-400">
                            {formatCurrency(zakatData.summary.totalPaidAllTime)}
                        </p>
                    </div>
                )}
            </div>

            {/* Haul Configuration */}
            {!loading && <HaulConfig config={zakatData?.config} onUpdate={handleUpdateConfig} />}

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setActiveTab('portfolio')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${activeTab === 'portfolio'
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                        }`}
                >
                    <Wallet className="w-4 h-4" />
                    Portfolio
                </button>
                <button
                    onClick={() => setActiveTab('traditional')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${activeTab === 'traditional'
                        ? 'bg-gold-500 text-dark-900'
                        : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                        }`}
                >
                    <Coins className="w-4 h-4" />
                    Traditional
                </button>
                <button
                    onClick={() => setActiveTab('crypto')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${activeTab === 'crypto'
                        ? 'bg-orange-500 text-white'
                        : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                        }`}
                >
                    <Bitcoin className="w-4 h-4" />
                    Crypto
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${activeTab === 'history'
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
                        }`}
                >
                    <History className="w-4 h-4" />
                    History
                    {zakatData?.records?.filter(r => r.status === 'pending').length > 0 && (
                        <span className="w-2 h-2 rounded-full bg-gold-500" />
                    )}
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
                </div>
            ) : activeTab === 'portfolio' ? (
                <ZakatCalculator onSave={fetchZakatData} zakatData={zakatData} />
            ) : activeTab === 'traditional' ? (
                <TraditionalCalculator prices={prices} onRefreshPrices={fetchPrices} />
            ) : activeTab === 'crypto' ? (
                <CryptoCalculator prices={prices} />
            ) : (
                <ZakatHistory
                    records={zakatData?.records}
                    onMarkPaid={() => { }}
                    onRefresh={fetchZakatData}
                />
            )}

            {/* Info Note */}
            <div className="glass-card border-gold-500/30">
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="font-medium text-gold-400 mb-1">About Zakat Calculation</p>
                        <p className="text-sm text-dark-300">
                            Zakat is due at 2.5% when your total zakatable assets exceed the Nisab threshold
                            (equivalent to 85 grams of gold) and have been held for one lunar year (Haul).
                            This calculator uses live gold prices to determine the current Nisab value.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
