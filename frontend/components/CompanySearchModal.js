import { useState } from 'react'
import { X, Search } from 'lucide-react'

const quickCompanies = ['Apple', 'Tesla', 'Microsoft', 'NVIDIA', 'Google', 'Amazon', 'Meta', 'Netflix']

export default function CompanySearchModal({ isOpen, onClose, onSelect }) {
    const [searchQuery, setSearchQuery] = useState('')

    if (!isOpen) return null

    const handleSelect = (company) => {
        onSelect(company)
        setSearchQuery('')
        onClose()
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            handleSelect(searchQuery.trim())
        }
    }

    const filteredCompanies = quickCompanies.filter(c =>
        c.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-dark-800">
                    <h2 className="text-lg font-semibold text-white">Select Company</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-dark-800 rounded-full text-dark-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Search Input */}
                <form onSubmit={handleSubmit} className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search company name..."
                            autoFocus
                            className="w-full pl-10 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-xl text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
                        />
                    </div>
                </form>

                {/* Quick Tags */}
                <div className="px-4 pb-4">
                    <p className="text-xs text-dark-500 mb-3">Popular companies</p>
                    <div className="flex flex-wrap gap-2">
                        {filteredCompanies.map((company) => (
                            <button
                                key={company}
                                onClick={() => handleSelect(company)}
                                className="text-sm px-3 py-1.5 rounded-full bg-dark-800 text-dark-300 hover:bg-primary-500/20 hover:text-primary-400 hover:border-primary-500/30 transition-colors border border-dark-700"
                            >
                                {company}
                            </button>
                        ))}
                    </div>
                    {searchQuery && !filteredCompanies.length && (
                        <button
                            onClick={() => handleSelect(searchQuery)}
                            className="mt-3 w-full py-3 rounded-xl bg-primary-500/10 border border-primary-500/30 text-primary-400 hover:bg-primary-500/20 transition-colors"
                        >
                            Search for "{searchQuery}"
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
