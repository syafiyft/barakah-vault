'use client'

import { useState } from 'react'
import CompanySlot from './CompanySlot'
import CompanySearchModal from './CompanySearchModal'
import ComparisonRadarChart from './ComparisonRadarChart'
import DimensionComparison from './DimensionComparison'

const MAX_COMPANIES = 3

export default function ComparisonView() {
    const [companies, setCompanies] = useState([null, null, null])
    const [loading, setLoading] = useState([false, false, false])
    const [searchModalOpen, setSearchModalOpen] = useState(false)
    const [activeSlotIndex, setActiveSlotIndex] = useState(null)

    const handleSelectSlot = (index) => {
        setActiveSlotIndex(index)
        setSearchModalOpen(true)
    }

    const handleCompanySelect = async (companyName) => {
        if (activeSlotIndex === null) return

        // Capture the slot index immediately to avoid stale closure
        const slotIndex = activeSlotIndex

        // Check if company is already selected
        const alreadySelected = companies.some(
            c => c && c.company.toLowerCase() === companyName.toLowerCase()
        )
        if (alreadySelected) {
            setSearchModalOpen(false)
            return
        }

        // Set loading for this slot using functional update
        setLoading(prev => {
            const newLoading = [...prev]
            newLoading[slotIndex] = true
            return newLoading
        })

        try {
            const res = await fetch('/api/maqasid/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: companyName }),
            })
            const data = await res.json()

            // Use functional update to get latest state
            setCompanies(prev => {
                const newCompanies = [...prev]
                newCompanies[slotIndex] = data
                return newCompanies
            })
        } catch (error) {
            console.error('Failed to analyze company:', error)
        } finally {
            // Use functional update to get latest state
            setLoading(prev => {
                const finalLoading = [...prev]
                finalLoading[slotIndex] = false
                return finalLoading
            })
        }
    }

    const handleRemoveCompany = (index) => {
        const newCompanies = [...companies]
        newCompanies[index] = null
        setCompanies(newCompanies)
    }

    const filledCompanies = companies.filter(c => c !== null)
    const showComparison = filledCompanies.length >= 2

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Company Selection Grid */}
            <div>
                <h2 className="text-lg font-semibold text-white mb-4">Select Companies to Compare</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {companies.map((company, index) => (
                        <CompanySlot
                            key={index}
                            company={company}
                            loading={loading[index]}
                            colorIndex={index}
                            onSelect={() => handleSelectSlot(index)}
                            onRemove={() => handleRemoveCompany(index)}
                        />
                    ))}
                </div>
                {filledCompanies.length < 2 && (
                    <p className="text-sm text-dark-500 mt-3 text-center">
                        Select at least 2 companies to see comparison
                    </p>
                )}
            </div>

            {/* Comparison Results */}
            {showComparison && (
                <div className="space-y-8">
                    {/* Radar Chart */}
                    <ComparisonRadarChart companies={filledCompanies} />

                    {/* Overall Score Summary */}
                    <div className="glass-card">
                        <h3 className="text-lg font-semibold text-white mb-4">Overall Scores</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {filledCompanies.map((company, index) => {
                                const colors = [
                                    { dot: 'bg-purple-500', text: 'text-purple-400' },
                                    { dot: 'bg-emerald-500', text: 'text-emerald-400' },
                                    { dot: 'bg-gold-500', text: 'text-gold-400' },
                                ]
                                const color = colors[companies.indexOf(company)]
                                const isHighest = filledCompanies.every(c => c.totalScore <= company.totalScore)

                                return (
                                    <div
                                        key={company.company}
                                        className={`p-4 rounded-xl bg-dark-800/50 border border-dark-700 ${isHighest ? 'ring-2 ring-gold-500/50' : ''}`}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={`w-2.5 h-2.5 rounded-full ${color.dot}`} />
                                            <span className="text-sm text-dark-300 truncate">{company.company}</span>
                                        </div>
                                        <div className={`text-3xl font-bold ${color.text}`}>
                                            {company.totalScore}
                                            <span className="text-lg text-dark-500">/100</span>
                                        </div>
                                        {isHighest && (
                                            <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-400 border border-gold-500/30">
                                                Highest Score
                                            </span>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Dimension Comparison */}
                    <DimensionComparison companies={filledCompanies} />
                </div>
            )}

            {/* Search Modal */}
            <CompanySearchModal
                isOpen={searchModalOpen}
                onClose={() => {
                    setSearchModalOpen(false)
                    setActiveSlotIndex(null)
                }}
                onSelect={handleCompanySelect}
            />
        </div>
    )
}
