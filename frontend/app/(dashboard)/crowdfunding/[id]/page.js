'use client'

import Link from 'next/link'
import { ArrowLeft, Award, Users, Clock, CheckCircle, Circle, Play, Wallet } from 'lucide-react'

// Mock Data (replace with actual fetch in real app)
const project = {
    id: 1, title: 'Build Community Masjid in Kelantan', description: 'A new masjid to serve 5,000+ Muslims in Kampung Baru.', category: 'Masjid', goal: 500000, raised: 320000, backers: 456, daysLeft: 45, verified: true,
    shariaBoard: [
        { name: 'Sheikh Ahmad bin Abdullah', title: 'Senior Scholar, JAKIM', approved: true },
        { name: 'Ustaz Muhammad Hasan', title: 'Mufti, Kelantan', approved: true },
        { name: 'Dr. Fatima Ibrahim', title: 'Islamic Finance Expert', approved: true },
    ],
    milestones: [
        { phase: 'Land Purchase', amount: 100000, status: 'completed' },
        { phase: 'Foundation & Structure', amount: 200000, status: 'in-progress', progress: 65 },
        { phase: 'Interior & Facilities', amount: 150000, status: 'pending' },
        { phase: 'Landscaping & Finishing', amount: 50000, status: 'pending' },
    ],
}

export default function ProjectDetail({ params }) {
    // In a real app, use params.id to fetch data
    const progress = (project.raised / project.goal) * 100

    return (
        <div className="space-y-6">
            <Link href="/crowdfunding" className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Projects
            </Link>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    <div className="glass-card">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-2">{project.title}</h1>
                                <span className="text-sm bg-dark-700 text-dark-300 px-3 py-1 rounded-full">{project.category}</span>
                            </div>
                            {project.verified && (
                                <span className="flex items-center gap-1 text-sm text-primary-400 bg-primary-500/20 px-3 py-1.5 rounded-full">
                                    <Award className="w-4 h-4" /> Shariah Verified
                                </span>
                            )}
                        </div>

                        <div className="mb-4">
                            <div className="flex items-end justify-between mb-2">
                                <div>
                                    <p className="text-3xl font-bold text-white">RM {project.raised.toLocaleString()}</p>
                                    <p className="text-sm text-dark-400">raised of RM {project.goal.toLocaleString()} goal</p>
                                </div>
                                <p className="text-lg font-semibold text-primary-400">{progress.toFixed(0)}%</p>
                            </div>
                            <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full" style={{ width: `${progress}%` }} />
                            </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                            <span className="flex items-center gap-2 text-dark-300"><Users className="w-4 h-4" /> {project.backers} backers</span>
                            <span className="flex items-center gap-2 text-dark-300"><Clock className="w-4 h-4" /> {project.daysLeft} days left</span>
                        </div>
                    </div>

                    <div className="glass-card">
                        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            <Award className="w-5 h-5 text-primary-400" /> Shariah Board Verification
                        </h2>
                        <div className="space-y-3">
                            {project.shariaBoard.map((scholar, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-dark-800/50">
                                    <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center">
                                        <span className="text-lg font-bold text-primary-400">{scholar.name.charAt(0)}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-white">{scholar.name}</p>
                                        <p className="text-sm text-dark-400">{scholar.title}</p>
                                    </div>
                                    <span className="flex items-center gap-1 text-sm text-primary-400"><CheckCircle className="w-4 h-4" /> Approved</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card">
                        <h2 className="text-lg font-semibold text-white mb-4">Milestones & Fund Release</h2>
                        <div className="space-y-4">
                            {project.milestones.map((milestone, i) => {
                                const isCompleted = milestone.status === 'completed'
                                const isInProgress = milestone.status === 'in-progress'
                                return (
                                    <div key={i} className={`flex gap-4 p-4 rounded-xl ${isCompleted ? 'bg-primary-500/10' : isInProgress ? 'bg-gold-500/10' : 'bg-dark-800/50'}`}>
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-primary-500' : isInProgress ? 'bg-gold-500' : 'bg-dark-700'}`}>
                                            {isCompleted ? <CheckCircle className="w-5 h-5 text-white" /> : isInProgress ? <Play className="w-5 h-5 text-white" /> : <Circle className="w-5 h-5 text-dark-400" />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="font-medium text-white">{milestone.phase}</h4>
                                                <span className={`text-sm font-semibold ${isCompleted ? 'text-primary-400' : isInProgress ? 'text-gold-400' : 'text-dark-400'}`}>RM {milestone.amount.toLocaleString()}</span>
                                            </div>
                                            {isInProgress && (
                                                <div className="h-2 bg-dark-700 rounded-full overflow-hidden mt-2">
                                                    <div className="h-full bg-gold-500 rounded-full" style={{ width: `${milestone.progress}%` }} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                <div className="glass-card sticky top-24 h-fit">
                    <h2 className="text-lg font-semibold text-white mb-4">Contribute</h2>
                    <div className="mb-4">
                        <label className="block text-sm text-dark-400 mb-2">Amount (RM)</label>
                        <input type="number" placeholder="Enter amount" className="input-field" />
                        <div className="flex gap-2 mt-2">
                            {[100, 500, 1000, 5000].map((amt) => (
                                <button key={amt} className="flex-1 py-2 rounded-lg bg-dark-800 text-dark-300 text-sm hover:bg-dark-700 transition-colors">RM {amt}</button>
                            ))}
                        </div>
                    </div>
                    <button className="btn-primary w-full flex items-center justify-center gap-2">
                        <Wallet className="w-5 h-5" /> Connect Wallet to Contribute
                    </button>
                    <div className="mt-6 pt-6 border-t border-dark-700 space-y-2 text-sm">
                        {['All transactions on blockchain', 'NFT receipt for tax purposes', 'Milestone-based fund release'].map((t, i) => (
                            <div key={i} className="flex items-center gap-2 text-dark-400"><CheckCircle className="w-4 h-4 text-primary-400" />{t}</div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
