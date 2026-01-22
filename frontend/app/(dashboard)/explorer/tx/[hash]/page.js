'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft, Loader2, CheckCircle, XCircle, Copy, ExternalLink, Box } from 'lucide-react'
import Link from 'next/link'
import { useWeb3 } from '@/context/Web3Context'
import { ethers } from 'ethers'

export default function TransactionExplorer({ params }) {
    const { provider, chainId } = useWeb3()
    const { hash } = params
    const [tx, setTx] = useState(null)
    const [receipt, setReceipt] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchTx = async () => {
            if (!provider || !hash) return

            try {
                setLoading(true)
                const transaction = await provider.getTransaction(hash)
                const txReceipt = await provider.getTransactionReceipt(hash)

                if (!transaction) {
                    setError('Transaction not found')
                } else {
                    setTx(transaction)
                    setReceipt(txReceipt)
                }
            } catch (err) {
                console.error(err)
                setError('Failed to fetch transaction details')
            } finally {
                setLoading(false)
            }
        }

        fetchTx()
    }, [provider, hash])

    const formatEth = (val) => {
        if (!val) return '0'
        return ethers.formatEther(val)
    }

    if (loading && !tx) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 text-primary-400 animate-spin mb-4" />
                <p className="text-dark-400">Loading transaction details...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <XCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-white mb-2">Error</h2>
                <p className="text-dark-400">{error}</p>
                <Link href="/crowdfunding" className="mt-6 text-primary-400 hover:text-primary-300">
                    Back to Projects
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/crowdfunding" className="p-2 rounded-lg bg-dark-800 hover:bg-dark-700 text-dark-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        Transaction Details
                        <span className="text-sm font-normal px-3 py-1 rounded-full bg-dark-800 text-dark-400 border border-dark-700">
                            {chainId === 31337 || chainId === 1337 ? 'Localhost' : 'Testnet'}
                        </span>
                    </h1>
                </div>
            </div>

            <div className="glass-card space-y-6">
                {/* Status Banner */}
                <div className={`p-4 rounded-xl flex items-center gap-3 ${receipt?.status === 1 ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                    {receipt?.status === 1 ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                        <XCircle className="w-6 h-6 text-red-500" />
                    )}
                    <div>
                        <p className={`font-semibold ${receipt?.status === 1 ? 'text-green-400' : 'text-red-400'}`}>
                            {receipt?.status === 1 ? 'Transaction Successful' : 'Transaction Failed'}
                        </p>
                        {receipt?.blockNumber && (
                            <p className="text-xs text-dark-400 mt-0.5">Confirmed in Block #{receipt.blockNumber}</p>
                        )}
                    </div>
                </div>

                {/* Main Details */}
                <div className="space-y-4">
                    <div className="group">
                        <label className="text-sm text-dark-400 mb-1 block">Transaction Hash</label>
                        <div className="flex items-center gap-2">
                            <code className="text-sm text-white bg-dark-900/50 px-3 py-2 rounded-lg break-all font-mono border border-dark-700 flex-1">
                                {hash}
                            </code>
                            <button
                                onClick={() => navigator.clipboard.writeText(hash)}
                                className="p-2 text-dark-400 hover:text-white transition-colors"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-sm text-dark-400 mb-1 block">From</label>
                            <Link href={`/explorer/address/${tx.from}`} className="text-primary-400 hover:text-primary-300 font-mono text-sm break-all">
                                {tx.from}
                            </Link>
                        </div>
                        <div>
                            <label className="text-sm text-dark-400 mb-1 block">To</label>
                            <span className="text-white font-mono text-sm break-all">{tx.to}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-dark-800">
                        <div>
                            <label className="text-sm text-dark-400 mb-1 block">Value</label>
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl font-bold text-white">{formatEth(tx.value)} ETH</span>
                            </div>
                        </div>
                        <div>
                            <label className="text-sm text-dark-400 mb-1 block">Gas Used</label>
                            <span className="text-white font-mono">
                                {receipt?.gasUsed?.toString()}
                                <span className="text-dark-500 ml-2 text-xs">({formatEth(receipt?.gasUsed * receipt?.gasPrice)} ETH)</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Raw Data Toggle (Optional expansion) */}
                <div className="pt-4 border-t border-dark-800">
                    <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                        <Box className="w-4 h-4 text-primary-400" /> Transaction Data
                    </h3>
                    <div className="bg-dark-900/50 rounded-lg p-3 overflow-x-auto">
                        <pre className="text-xs text-dark-300 font-mono">
                            {tx.data === '0x' ? 'No input data' : tx.data}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
    )
}
