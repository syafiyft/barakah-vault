'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react'
import { signIn } from 'next-auth/react'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false
            })

            if (result?.error) {
                console.error('Login failed:', result.error)
                // You could add an error state here to show to user
            } else {
                router.push('/')
                router.refresh()
            }
        } catch (error) {
            console.error('Login error:', error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gradient mb-2">BarakahVault</h1>
                    <p className="text-dark-400">Ethical Islamic Investment Platform</p>
                </div>

                <div className="glass-card">
                    <h2 className="text-xl font-semibold text-white mb-6">Welcome Back</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-dark-400 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="input-field !pl-12"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-dark-400 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input-field !pl-12 !pr-12"
                                    required
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
                    </form>

                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-dark-700" />
                        <span className="text-sm text-dark-500">or continue with</span>
                        <div className="flex-1 h-px bg-dark-700" />
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => signIn('google', { callbackUrl: '/' })}
                            className="btn-secondary w-full flex items-center justify-center gap-2 bg-white text-dark-900 hover:bg-gray-100 border-none transition-colors"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            Sign in with Google
                        </button>
                        <button className="btn-secondary w-full flex items-center justify-center gap-2">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-5 h-5" />
                            Connect with MetaMask
                        </button>
                    </div>

                    <p className="text-center text-dark-400 mt-6">
                        Don&apos;t have an account? <Link href="/register" className="text-primary-400 hover:text-primary-300 font-medium">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
