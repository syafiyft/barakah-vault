'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Award, Users, Clock, Landmark, GraduationCap, Home, HeartHandshake } from 'lucide-react'

const projects = [
    { id: 1, title: 'Build Community Masjid in Kelantan', description: 'A new masjid to serve 5,000+ Muslims.', category: 'Masjid', icon: Landmark, goal: 500000, raised: 320000, backers: 456, daysLeft: 45, verified: true },
    { id: 2, title: 'Islamic School - Selangor', description: 'Establish a tahfiz center for 200 students.', category: 'Education', icon: GraduationCap, goal: 300000, raised: 225000, backers: 234, daysLeft: 30, verified: true },
    { id: 3, title: 'Orphanage Renovation - Johor', description: 'Renovate orphanage for 50 more children.', category: 'Welfare', icon: Home, goal: 150000, raised: 67500, backers: 189, daysLeft: 60, verified: true },
    { id: 4, title: 'Free Medical Clinic - Pahang', description: 'Weekly free clinic for underprivileged.', category: 'Healthcare', icon: HeartHandshake, goal: 100000, raised: 45000, backers: 112, daysLeft: 90, verified: true },
]

const categories = ['All', 'Masjid', 'Education', 'Welfare', 'Healthcare']

function ProjectCard({ project }) {
    const progress = (project.raised / project.goal) * 100
    const Icon = project.icon

    return (
        <Link href={`/crowdfunding/${project.id}`} className="glass-card group transition-all hover:scale-102">
            <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500/20 to-gold-500/20 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary-400" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors">{project.title}</h3>
                    </div>
                    <span className="text-xs bg-dark-700 text-dark-300 px-2 py-0.5 rounded">{project.category}</span>
                </div>
                {project.verified && (
                    <span className="flex items-center gap-1 text-xs text-primary-400 bg-primary-500/20 px-2 py-1 rounded-full">
                        <Award className="w-3 h-3" /> Verified
                    </span>
                )}
            </div>

            <p className="text-sm text-dark-400 mb-4">{project.description}</p>

            <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-dark-400">{progress.toFixed(0)}% funded</span>
                    <span className="text-white font-semibold">RM {project.raised.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full" style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className="flex items-center justify-between text-sm text-dark-400">
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {project.backers}</span>
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {project.daysLeft} days</span>
            </div>
        </Link>
    )
}

export default function Crowdfunding() {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('All')

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">Verified Crowdfunding Projects</h1>
                    <p className="text-dark-400">Give transparently to scholar-verified halal projects</p>
                </div>
                <div className="text-right">
                    <p className="text-sm text-dark-400">Total Raised</p>
                    <p className="text-2xl font-bold text-primary-400">RM {projects.reduce((s, p) => s + p.raised, 0).toLocaleString()}</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search projects..." className="input-field pl-12" />
                </div>
                <div className="flex items-center gap-2">
                    {categories.map((cat) => (
                        <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === cat ? 'bg-primary-500 text-white' : 'bg-dark-800 text-dark-300 hover:bg-dark-700'}`}>
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                {filteredProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
            </div>
        </div>
    )
}
