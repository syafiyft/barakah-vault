'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Award, Users, Clock, CheckCircle, Circle, Play, Wallet, Loader2, ArrowUpRight } from 'lucide-react'
import { useWeb3 } from '@/context/Web3Context'
import { ethers } from 'ethers'

// Default images by category
const categoryImages = {
    Masjid: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&q=80',
    Education: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    Welfare: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
    Healthcare: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80',
    default: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800&q=80',
}

// Mock Data (replace with actual fetch in real app)
const project = {
    id: 1,
    title: 'Build Community Masjid in Kelantan',
    description: 'A new masjid to serve 5,000+ Muslims in Kampung Baru. This project includes a prayer hall for 1,000 people, ablution facilities, and a community center for Islamic education and community gatherings.',
    category: 'Masjid',
    goal: 500000,
    raised: 320000,
    backers: 456,
    daysLeft: 45,
    verified: true,
    image: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&q=80',
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
    const { isConnected, connectWallet, contracts, account } = useWeb3()
    const [amount, setAmount] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [txHash, setTxHash] = useState(null)
    const [tokenId, setTokenId] = useState(null)
    const [projectStats, setProjectStats] = useState({
        raised: project.raised,
        backers: project.backers
    })
    const [paymentMethod, setPaymentMethod] = useState('crypto') // 'crypto' or 'bank'
    const [hasLoaded, setHasLoaded] = useState(false)

    // Load stats from local storage on mount
    useEffect(() => {
        const savedStats = localStorage.getItem(`project_${project.id}_stats`)
        if (savedStats) {
            setProjectStats(JSON.parse(savedStats))
        }
        setHasLoaded(true)
    }, [])

    // Save stats to local storage whenever they change
    useEffect(() => {
        if (hasLoaded) {
            localStorage.setItem(`project_${project.id}_stats`, JSON.stringify(projectStats))
        }
    }, [projectStats, hasLoaded])

    const progress = (projectStats.raised / project.goal) * 100

    const handleContribute = async () => {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return

        setIsLoading(true)
        setTxHash(null)
        setTokenId(null)

        try {
            if (paymentMethod === 'bank') {
                // Mock Bank Transfer
                await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call

                const contributionAmount = parseFloat(amount)
                setProjectStats(prev => ({
                    raised: prev.raised + contributionAmount,
                    backers: prev.backers + 1
                }))

                alert(`Bank Transfer Successful! RM ${contributionAmount.toLocaleString()} added to campaign.`)
                setAmount('')
            } else {
                // Crypto Contribution
                // Hardcoded project ID 1 and metadata URI for demo
                const tx = await contracts.crowdfunding.contribute(1, "ipfs://Qmd7...", {
                    value: ethers.parseEther(amount.toString())
                })
                const receipt = await tx.wait()
                setTxHash(tx.hash)

                // Find NFT Token ID from logs
                if (contracts.receipt) {
                    for (const log of receipt.logs) {
                        try {
                            if (log.address.toLowerCase() === contracts.receipt.target.toLowerCase()) {
                                const parsedLog = contracts.receipt.interface.parseLog(log);
                                if (parsedLog && parsedLog.name === 'Transfer') {
                                    setTokenId(parsedLog.args[2].toString());
                                    break;
                                }
                            }
                        } catch (e) {
                            console.log("Log parse error:", e);
                        }
                    }
                }

                // Update stats (convert ETH to RM for demo, 1 ETH = ~12,000 RM)
                const ethAmount = parseFloat(amount)
                const rmValue = ethAmount * 12000

                setProjectStats(prev => ({
                    raised: prev.raised + rmValue,
                    backers: prev.backers + 1
                }))

                alert("Contribution successful! NFT Receipt minted.")
                setAmount('')
            }
        } catch (err) {
            console.error(err)
            alert("Transaction failed: " + (err.reason || err.message))
        } finally {
            setIsLoading(false)
        }
    }

    const getExplorerLink = (hash) => {
        // Simple logic: if hash starts with 0x, assume it's valid.
        // For Localhost, we can't link effectively.
        // For Sepolia: https://sepolia.etherscan.io/tx/${hash}
        return `https://sepolia.etherscan.io/tx/${hash}` // Default to Sepolia/Mainnet structure
    }

    const imageUrl = project.image || categoryImages[project.category] || categoryImages.default

    return (
        <div className="space-y-6">
            <Link href="/crowdfunding" className="inline-flex items-center gap-2 text-dark-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Projects
            </Link>

            {/* Hero Image */}
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden">
                <img
                    src={imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-sm bg-dark-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full">{project.category}</span>
                        {project.verified && (
                            <span className="flex items-center gap-1 text-sm text-primary-400 bg-dark-900/80 backdrop-blur-sm px-3 py-1 rounded-full">
                                <Award className="w-4 h-4" /> Shariah Verified
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-white">{project.title}</h1>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    <div className="glass-card">
                        <p className="text-dark-300 mb-6">{project.description}</p>

                        <div className="mb-4">
                            <div className="flex items-end justify-between mb-2">
                                <div>
                                    <p className="text-3xl font-bold text-white">RM {projectStats.raised.toLocaleString()}</p>
                                    <p className="text-sm text-dark-400">raised of RM {project.goal.toLocaleString()} goal</p>
                                </div>
                                <p className="text-lg font-semibold text-primary-400">{progress.toFixed(0)}%</p>
                            </div>
                            <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full" style={{ width: `${progress}%` }} />
                            </div>
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                            <span className="flex items-center gap-2 text-dark-300"><Users className="w-4 h-4" /> {projectStats.backers} backers</span>
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
                        <label className="block text-sm text-dark-400 mb-2">Payment Method</label>
                        <div className="flex p-1 bg-dark-800 rounded-lg mb-4">
                            <button
                                onClick={() => {
                                    setPaymentMethod('crypto')
                                    setAmount('')
                                }}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${paymentMethod === 'crypto' ? 'bg-primary-500 text-white shadow-lg' : 'text-dark-400 hover:text-white'}`}
                            >
                                Crypto (ETH)
                            </button>
                            <button
                                onClick={() => {
                                    setPaymentMethod('bank')
                                    setAmount('')
                                }}
                                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${paymentMethod === 'bank' ? 'bg-primary-500 text-white shadow-lg' : 'text-dark-400 hover:text-white'}`}
                            >
                                Bank Transfer
                            </button>
                        </div>

                        <label className="block text-sm text-dark-400 mb-2">
                            Amount ({paymentMethod === 'crypto' ? 'ETH' : 'RM'})
                        </label>
                        <input
                            type="number"
                            placeholder="Enter amount"
                            className="input-field"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                        <div className="flex gap-2 mt-2">
                            {paymentMethod === 'crypto' ? (
                                [0.01, 0.05, 0.1, 0.5].map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => setAmount(amt.toString())}
                                        className="flex-1 py-2 rounded-lg bg-dark-800 text-dark-300 text-sm hover:bg-dark-700 transition-colors"
                                    >
                                        {amt} ETH
                                    </button>
                                ))
                            ) : (
                                [10, 50, 100, 500].map((amt) => (
                                    <button
                                        key={amt}
                                        onClick={() => setAmount(amt.toString())}
                                        className="flex-1 py-2 rounded-lg bg-dark-800 text-dark-300 text-sm hover:bg-dark-700 transition-colors"
                                    >
                                        RM {amt}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {paymentMethod === 'crypto' && !isConnected ? (
                        <button
                            onClick={connectWallet}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                        >
                            <Wallet className="w-5 h-5" /> Connect Wallet to Contribute
                        </button>
                    ) : (
                        <button
                            onClick={handleContribute}
                            disabled={isLoading || !amount}
                            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wallet className="w-5 h-5" />}
                            {isLoading ? "Processing..." : paymentMethod === 'bank' ? "Proceed with Bank Transfer" : "Contribute Now"}
                        </button>
                    )}
                    {isConnected && <p className="text-xs text-dark-400 mt-2 text-center">Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>}

                    {txHash && (
                        <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center animate-in fade-in slide-in-from-top-2">
                            <p className="text-sm text-green-400 mb-1 font-medium">Verified on Blockchain!</p>
                            {tokenId && <p className="text-xs text-green-500 mb-2">Receipt NFT #{tokenId} Minted</p>}
                            <a
                                href={getExplorerLink(txHash)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-green-300 hover:text-green-200 flex items-center justify-center gap-1"
                            >
                                View Transaction <ArrowUpRight className="w-3 h-3" />
                            </a>
                        </div>
                    )}

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
