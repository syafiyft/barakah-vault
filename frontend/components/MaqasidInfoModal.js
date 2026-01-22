import { X, Shield, Heart, Brain, Baby, Coins } from 'lucide-react'

export default function MaqasidInfoModal({ isOpen, onClose }) {
    if (!isOpen) return null

    const dimensions = [
        {
            icon: <Shield className="w-6 h-6 text-emerald-400" />,
            title: "1. Faith (Deen)",
            desc: "Protection of religious freedom, ethical marketing, and privacy.",
            good: "Privacy protection, Ethics boards, Halal financing.",
            bad: "Selling user data, Gambling mechanics, Anti-religious lobbying."
        },
        {
            icon: <Heart className="w-6 h-6 text-rose-400" />,
            title: "2. Life (Nafs)",
            desc: "Worker safety, environmental protection, and product safety.",
            good: "Strong safety record, Carbon neutral, Healthcare benefits.",
            bad: "Pollution/Waste, Child labor, Dangerous products."
        },
        {
            icon: <Brain className="w-6 h-6 text-blue-400" />,
            title: "3. Intellect (Aql)",
            desc: "Innovation (R&D), truthfulness, and avoidance of harmful addictions.",
            good: "R&D investment, Educational grants, Transparent reporting.",
            bad: "Misinformation, Addictive algorithms, Hidden fees."
        },
        {
            icon: <Baby className="w-6 h-6 text-purple-400" />,
            title: "4. Lineage (Nasl)",
            desc: "Family-friendly policies, parental leave, and future sustainability.",
            good: "Paid parental leave, DEI initiatives, Child safety.",
            bad: "Sexual harassment issues, Harmful content for kids."
        },
        {
            icon: <Coins className="w-6 h-6 text-amber-400" />,
            title: "5. Wealth (Mal)",
            desc: "Fair wages, economic stability, and ethical wealth distribution.",
            good: "Fair living wages, Charity/Zakat, Financial stability.",
            bad: "Bribery/Corruption, Tax evasion, Excessive debt."
        }
    ]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-dark-900 border border-dark-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="sticky top-0 bg-dark-900/95 backdrop-blur border-b border-dark-800 p-4 sm:p-6 flex justify-between items-center z-10">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white">How Our AI Scoring Works</h2>
                        <p className="text-dark-400 text-xs sm:text-sm">Based on Maqasid al-Shariah (Higher Objectives of Islamic Law)</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-dark-800 rounded-full text-dark-400 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    <div className="bg-primary-500/10 border border-primary-500/20 rounded-xl p-3 sm:p-4 text-primary-200 text-xs sm:text-sm">
                        <p>
                            Traditional screening only checks if a company is <strong>not doing bad</strong> (e.g. no alcohol).
                            Our AI checks if a company is <strong>actively doing good</strong>.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:gap-4">
                        {dimensions.map((item, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-dark-800/50 border border-dark-800 hover:border-dark-700 transition-colors">
                                <div className="flex items-center gap-2 sm:block p-2 bg-dark-800 rounded-lg shrink-0 w-full sm:w-auto">
                                    {item.icon}
                                    <span className="font-semibold text-white sm:hidden">{item.title}</span>
                                </div>
                                <div className="space-y-2 w-full">
                                    <div>
                                        <h3 className="font-semibold text-white mb-1 hidden sm:block">{item.title}</h3>
                                        <p className="text-dark-300 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-2 text-xs pt-1">
                                        <div className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                                            ✅ {item.good}
                                        </div>
                                        <div className="px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300">
                                            ❌ {item.bad}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3 pt-2">
                        <h3 className="font-semibold text-white">Score Legend</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm">
                            <div className="p-2 sm:p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-between sm:block">
                                <span className="block text-emerald-400 font-bold sm:mb-1">90 - 100</span>
                                <span className="text-emerald-200 text-xs sm:text-base">Exemplary Leader</span>
                            </div>
                            <div className="p-2 sm:p-3 bg-primary-500/10 border border-primary-500/20 rounded-lg flex items-center justify-between sm:block">
                                <span className="block text-primary-400 font-bold sm:mb-1">80 - 89</span>
                                <span className="text-primary-200 text-xs sm:text-base">Strong Alignment</span>
                            </div>
                            <div className="p-2 sm:p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-between sm:block">
                                <span className="block text-amber-400 font-bold sm:mb-1">70 - 79</span>
                                <span className="text-amber-200 text-xs sm:text-base">Average Compliance</span>
                            </div>
                            <div className="p-2 sm:p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg flex items-center justify-between sm:block">
                                <span className="block text-rose-400 font-bold sm:mb-1">Below 70</span>
                                <span className="text-rose-200 text-xs sm:text-base">Major Concerns</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-xs text-center text-dark-500 pt-4 border-t border-dark-800">
                        Scoring powered by AI analysis of annual reports, ESG data, and news.
                    </div>
                </div>
            </div>
        </div>
    )
}
