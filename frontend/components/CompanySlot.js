import { Plus, X, Loader2, Sparkles } from 'lucide-react'

const getCardStyles = (score) => {
    if (score >= 80) return {
        border: 'border-primary-500/30',
        bg: 'bg-primary-500/5',
        glow: 'shadow-primary-500',
        text: 'text-primary-400'
    }
    if (score >= 70) return {
        border: 'border-gold-500/30',
        bg: 'bg-gold-500/5',
        glow: 'shadow-gold-500',
        text: 'text-gold-400'
    }
    return {
        border: 'border-red-500/40',
        bg: 'bg-red-500/10',
        glow: 'shadow-red-500',
        text: 'text-red-400'
    }
}

export default function CompanySlot({ company, loading, onSelect, onRemove, colorIndex = 0 }) {
    const slotColors = [
        { border: 'border-purple-500/50', bg: 'bg-purple-500/10', dot: 'bg-purple-500' },
        { border: 'border-emerald-500/50', bg: 'bg-emerald-500/10', dot: 'bg-emerald-500' },
        { border: 'border-gold-500/50', bg: 'bg-gold-500/10', dot: 'bg-gold-500' },
    ]
    const slotColor = slotColors[colorIndex % slotColors.length]

    // Empty state
    if (!company && !loading) {
        return (
            <button
                onClick={onSelect}
                className="h-36 w-full rounded-2xl border-2 border-dashed border-dark-700 bg-dark-800/30 hover:border-primary-500/50 hover:bg-dark-800/50 transition-all duration-300 flex flex-col items-center justify-center gap-2 group"
            >
                <div className="w-10 h-10 rounded-full bg-dark-700 group-hover:bg-primary-500/20 flex items-center justify-center transition-colors">
                    <Plus className="w-5 h-5 text-dark-400 group-hover:text-primary-400 transition-colors" />
                </div>
                <span className="text-sm text-dark-400 group-hover:text-dark-300 transition-colors">Select Company</span>
            </button>
        )
    }

    // Loading state
    if (loading) {
        return (
            <div className={`h-36 w-full rounded-2xl border ${slotColor.border} ${slotColor.bg} flex flex-col items-center justify-center gap-3`}>
                <Loader2 className="w-8 h-8 text-dark-400 animate-spin" />
                <span className="text-sm text-dark-400">Analyzing...</span>
            </div>
        )
    }

    // Filled state with company data
    const styles = getCardStyles(company.totalScore)

    return (
        <div className={`h-36 w-full rounded-2xl border ${slotColor.border} ${slotColor.bg} p-4 relative group transition-all duration-300`}>
            {/* Color indicator dot */}
            <div className={`absolute top-3 left-3 w-2.5 h-2.5 rounded-full ${slotColor.dot}`} />

            {/* Remove button */}
            <button
                onClick={onRemove}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-dark-800/80 text-dark-400 hover:text-white hover:bg-red-500/20 opacity-0 group-hover:opacity-100 transition-all"
            >
                <X className="w-4 h-4" />
            </button>

            {/* Company info */}
            <div className="flex flex-col h-full justify-between pl-4">
                <div>
                    <h3 className="font-semibold text-white truncate pr-8">{company.company}</h3>
                    <span className="text-xs text-dark-400 bg-dark-800 px-1.5 py-0.5 rounded border border-dark-700">
                        {company.ticker}
                    </span>
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <div className="text-xs text-dark-500 mb-1">Maqasid Score</div>
                        <div className={`text-2xl font-bold ${styles.text}`}>
                            {company.totalScore}
                        </div>
                    </div>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${styles.bg} border ${styles.border}`}>
                        <Sparkles className={`w-4 h-4 ${styles.text}`} />
                    </div>
                </div>
            </div>
        </div>
    )
}
