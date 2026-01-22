'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Award, Users, Clock, Landmark, GraduationCap, Home, HeartHandshake } from 'lucide-react'

// Default images by category (using Unsplash)
const categoryImages = {
    Masjid: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&q=80',
    Education: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    Welfare: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
    Healthcare: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80',
    default: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80',
}

const projects = [
    {
        id: 1,
        title: 'Build Community Masjid in Kelantan',
        description: 'A new masjid to serve 5,000+ Muslims in Kampung Baru. This project includes a prayer hall for 1,000 people, ablution facilities, and a community center.',
        category: 'Masjid',
        icon: Landmark,
        goal: 500000,
        raised: 320000,
        backers: 456,
        daysLeft: 45,
        verified: true,
        image: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&q=80'
    },
    {
        id: 2,
        title: 'Islamic School - Selangor',
        description: 'Establish a tahfiz center for 200 students with modern facilities, qualified teachers, and a comprehensive Islamic curriculum.',
        category: 'Education',
        icon: GraduationCap,
        goal: 300000,
        raised: 225000,
        backers: 234,
        daysLeft: 30,
        verified: true,
        image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80'
    },
    {
        id: 3,
        title: 'Orphanage Renovation - Johor',
        description: 'Renovate and expand the orphanage to accommodate 50 more children with proper bedrooms, study areas, and recreational facilities.',
        category: 'Welfare',
        icon: Home,
        goal: 150000,
        raised: 67500,
        backers: 189,
        daysLeft: 60,
        verified: true,
        image: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800&q=80'
    },
    {
        id: 4,
        title: 'Free Medical Clinic - Pahang',
        description: 'Weekly free clinic providing basic healthcare services for underprivileged communities including check-ups, medications, and health education.',
        category: 'Healthcare',
        icon: HeartHandshake,
        goal: 100000,
        raised: 45000,
        backers: 112,
        daysLeft: 90,
        verified: true,
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80'
    },
]

const categories = ['All', 'Masjid', 'Education', 'Welfare', 'Healthcare']

function ProjectCard({ project }) {
    const [stats, setStats] = useState({
        raised: project.raised,
        backers: project.backers
    })

    useEffect(() => {
        const savedStats = localStorage.getItem(`project_${project.id}_stats`)
        if (savedStats) {
            setStats(JSON.parse(savedStats))
        }
    }, [project.id])

    const progress = (stats.raised / project.goal) * 100
    const Icon = project.icon
    const imageUrl = project.image || categoryImages[project.category] || categoryImages.default

    return (
        <Link href={`/crowdfunding/${project.id}`} className="glass-card group transition-all hover:scale-[1.02] overflow-hidden p-0">
            {/* Project Image */}
            <div className="relative h-48 w-full overflow-hidden">
                <img
                    src={imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/90 via-dark-900/20 to-transparent" />

                {/* Category & Verified Badge */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-xs bg-dark-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full flex items-center gap-1.5">
                        <Icon className="w-3 h-3" /> {project.category}
                    </span>
                    {project.verified && (
                        <span className="flex items-center gap-1 text-xs text-primary-400 bg-dark-900/80 backdrop-blur-sm px-2 py-1 rounded-full">
                            <Award className="w-3 h-3" /> Verified
                        </span>
                    )}
                </div>

                {/* Title overlay */}
                <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors line-clamp-2">
                        {project.title}
                    </h3>
                </div>
            </div>

            {/* Card Content */}
            <div className="p-5">
                <p className="text-sm text-dark-400 mb-4 line-clamp-2">{project.description}</p>

                <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-dark-400">{progress.toFixed(0)}% funded</span>
                        <span className="text-white font-semibold">RM {stats.raised.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-xs text-dark-500 mt-1">of RM {project.goal.toLocaleString()} goal</p>
                </div>

                <div className="flex items-center justify-between text-sm text-dark-400">
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {stats.backers} backers</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {project.daysLeft} days left</span>
                </div>
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
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search projects..." className="input-field !pl-12" />
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
