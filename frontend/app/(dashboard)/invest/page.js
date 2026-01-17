'use client'

import { useState } from 'react'
import { Search, Shield, Heart, BookOpen, Users, TrendingUp } from 'lucide-react'

const companies = [
    {
        symbol: 'AAPL', name: 'Apple Inc.', industry: 'Technology', halalScore: 92, maqasidScore: 85,
        breakdown: { faith: 85, life: 90, intellect: 95, lineage: 70, wealth: 88 },
        recommendation: 'HIGHLY RECOMMENDED',
    },
    {
        symbol: 'MSFT', name: 'Microsoft Corp.', industry: 'Technology', halalScore: 90, maqasidScore: 82,
        breakdown: { faith: 80, life: 85, intellect: 92, lineage: 75, wealth: 80 },
        recommendation: 'RECOMMENDED',
    },
    {
        symbol: 'META', name: 'Meta Platforms', industry: 'Technology', halalScore: 88, maqasidScore: 60,
        breakdown: { faith: 45, life: 65, intellect: 70, lineage: 55, wealth: 65 },
        recommendation: 'CAUTION',
    },
]

const maqasidIcons = { faith: Shield, life: Heart, intellect: BookOpen, lineage: Users, wealth: TrendingUp }
const maqasidLabels = { faith: 'حفظ الدين', life: 'حفظ النفس', intellect: 'حفظ العقل', lineage: 'حفظ النسل', wealth: 'حفظ المال' }

function ScoreRing({ score, size = 100 }) {
    const radius = (size - 8) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (score / 100) * circumference
    const color = score >= 80 ? '#22c55e' : score >= 70 ? '#eab308' : score >= 60 ? '#f97316' : '#ef4444'

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90" width={size} height={size}>
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#334155" strokeWidth={8} />
                <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{score}</span>
                <span className="text-xs text-dark-400">/ 100</span>
            </div>
        </div>
    )
}

export default function Invest() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCompany, setSelectedCompany] = useState(companies[0])

    const filteredCompanies = companies.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.symbol.toLowerCase().includes(searchQuery.toLowerCase()))

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Maqasid al-Shariah Investment Scorer</h1>
                <p className="text-dark-400">Beyond halal screening — find companies that embody Islamic values</p>
            </div>

            <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search company name or symbol..." className="input-field pl-12" />
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="space-y-4">
                    <h2 className="text-sm font-medium text-dark-400 uppercase">Companies</h2>
                    {filteredCompanies.map((company) => (
                        <div key={company.symbol} onClick={() => setSelectedCompany(company)} className={`glass-card cursor-pointer transition-all hover:scale-102 ${selectedCompany?.symbol === company.symbol ? 'ring-2 ring-primary-500' : ''}`}>
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-semibold text-white">{company.name}</h3>
                                        <span className="text-xs bg-dark-700 px-2 py-0.5 rounded text-dark-300">{company.symbol}</span>
                                    </div>
                                    <p className="text-sm text-dark-400">{company.industry}</p>
                                </div>
                                <ScoreRing score={company.maqasidScore} size={70} />
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${company.recommendation === 'HIGHLY RECOMMENDED' ? 'score-excellent' : company.recommendation === 'RECOMMENDED' ? 'score-good' : 'score-average'}`}>
                                {company.recommendation}
                            </span>
                        </div>
                    ))}
                </div>

                {selectedCompany && (
                    <div className="col-span-2 space-y-6">
                        <div className="glass-card">
                            <div className="flex items-start gap-8">
                                <ScoreRing score={selectedCompany.maqasidScore} size={120} />
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white mb-1">{selectedCompany.name}</h2>
                                    <p className="text-dark-400 mb-4">{selectedCompany.symbol} • {selectedCompany.industry}</p>
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="p-3 rounded-xl bg-dark-800/50">
                                            <p className="text-sm text-dark-400">Halal Screening</p>
                                            <p className="text-xl font-bold text-primary-400">{selectedCompany.halalScore}/100 ✓</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-dark-800/50">
                                            <p className="text-sm text-dark-400">Maqasid Score</p>
                                            <p className="text-xl font-bold text-white">{selectedCompany.maqasidScore}/100</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card">
                            <h3 className="text-lg font-semibold text-white mb-6">The 5 Maqasid al-Shariah Breakdown</h3>
                            <div className="space-y-4">
                                {Object.entries(selectedCompany.breakdown).map(([key, value]) => {
                                    const Icon = maqasidIcons[key]
                                    const descriptions = {
                                        faith: 'Religious freedom, privacy protection',
                                        life: 'Worker safety, healthcare benefits',
                                        intellect: 'R&D investment, innovation',
                                        lineage: 'Family-friendly policies',
                                        wealth: 'Fair wages, job creation',
                                    }
                                    return (
                                        <div key={key} className="p-4 rounded-xl bg-dark-800/50">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                                                        <Icon className="w-5 h-5 text-primary-400" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-white capitalize">{key}</h4>
                                                        <p className="text-xs text-dark-400">{maqasidLabels[key]}</p>
                                                    </div>
                                                </div>
                                                <span className={`text-xl font-bold ${value >= 80 ? 'text-primary-400' : value >= 60 ? 'text-gold-400' : 'text-red-400'}`}>{value}/100</span>
                                            </div>
                                            <div className="h-2 bg-dark-700 rounded-full overflow-hidden mb-2">
                                                <div className={`h-full rounded-full ${value >= 80 ? 'bg-primary-500' : value >= 60 ? 'bg-gold-500' : 'bg-red-500'}`} style={{ width: `${value}%` }} />
                                            </div>
                                            <p className="text-sm text-dark-400">{descriptions[key]}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
