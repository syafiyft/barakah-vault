import { Shield, Heart, Brain, Users, Coins, Crown, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const dimensions = [
    { key: 'faith', label: 'Faith (Deen)', icon: Shield, color: 'text-purple-400', bg: 'bg-purple-500/20' },
    { key: 'life', label: 'Life (Nafs)', icon: Heart, color: 'text-red-400', bg: 'bg-red-500/20' },
    { key: 'intellect', label: 'Intellect (\'Aql)', icon: Brain, color: 'text-blue-400', bg: 'bg-blue-500/20' },
    { key: 'lineage', label: 'Lineage (Nasl)', icon: Users, color: 'text-green-400', bg: 'bg-green-500/20' },
    { key: 'wealth', label: 'Wealth (Mal)', icon: Coins, color: 'text-gold-400', bg: 'bg-gold-500/20' },
]

const companyColors = [
    { text: 'text-purple-400', bg: 'bg-purple-500', border: 'border-purple-500/50' },
    { text: 'text-emerald-400', bg: 'bg-emerald-500', border: 'border-emerald-500/50' },
    { text: 'text-gold-400', bg: 'bg-gold-500', border: 'border-gold-500/50' },
]

const getScoreColor = (score) => {
    if (score >= 80) return 'bg-primary-500'
    if (score >= 60) return 'bg-gold-500'
    return 'bg-red-500'
}

export default function DimensionComparison({ companies }) {
    const [expandedDimension, setExpandedDimension] = useState(null)

    if (!companies || companies.length < 2) return null

    const getWinner = (dimensionKey) => {
        let maxScore = -1
        let winnerIndex = -1
        let isTie = false

        companies.forEach((company, index) => {
            const score = company.breakdown[dimensionKey]?.score || 0
            if (score > maxScore) {
                maxScore = score
                winnerIndex = index
                isTie = false
            } else if (score === maxScore) {
                isTie = true
            }
        })

        return isTie ? -1 : winnerIndex
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Dimension Breakdown</h3>

            {dimensions.map((dim) => {
                const winner = getWinner(dim.key)
                const isExpanded = expandedDimension === dim.key

                return (
                    <div key={dim.key} className="glass-card p-4">
                        {/* Dimension Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-lg ${dim.bg} flex items-center justify-center shrink-0`}>
                                <dim.icon className={`w-5 h-5 ${dim.color}`} />
                            </div>
                            <h4 className="font-semibold text-white">{dim.label}</h4>
                        </div>

                        {/* Company Scores */}
                        <div className="space-y-3">
                            {companies.map((company, index) => {
                                const scoreData = company.breakdown[dim.key]
                                const isWinner = winner === index
                                const colorStyle = companyColors[index]

                                return (
                                    <div key={company.company} className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2.5 h-2.5 rounded-full ${colorStyle.bg}`} />
                                                <span className="text-sm text-dark-300">{company.company}</span>
                                                {isWinner && (
                                                    <Crown className="w-4 h-4 text-gold-400" />
                                                )}
                                            </div>
                                            <span className={`text-sm font-bold ${colorStyle.text}`}>
                                                {scoreData?.score || 0}/100
                                            </span>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ${getScoreColor(scoreData?.score || 0)}`}
                                                style={{ width: `${scoreData?.score || 0}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Expand/Collapse Button */}
                        <button
                            onClick={() => setExpandedDimension(isExpanded ? null : dim.key)}
                            className="mt-4 w-full flex items-center justify-center gap-1 text-sm text-dark-400 hover:text-dark-300 transition-colors"
                        >
                            {isExpanded ? (
                                <>
                                    <span>Hide reasoning</span>
                                    <ChevronUp className="w-4 h-4" />
                                </>
                            ) : (
                                <>
                                    <span>Show reasoning</span>
                                    <ChevronDown className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        {/* Expanded Reasoning */}
                        {isExpanded && (
                            <div className="mt-4 space-y-3 pt-4 border-t border-dark-700">
                                {companies.map((company, index) => {
                                    const scoreData = company.breakdown[dim.key]
                                    const colorStyle = companyColors[index]

                                    return (
                                        <div key={company.company} className={`p-3 rounded-lg bg-dark-800/50 border ${colorStyle.border}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className={`w-2 h-2 rounded-full ${colorStyle.bg}`} />
                                                <span className="text-sm font-medium text-white">{company.company}</span>
                                            </div>
                                            <p className="text-sm text-dark-400 leading-relaxed">
                                                {scoreData?.reasoning || 'No reasoning available.'}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}
