'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, User, Sparkles } from 'lucide-react'

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const updateField = (field, value) => { setFormData(p => ({ ...p, [field]: value })); setError('') }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return }
        if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return }
        setLoading(true)
        setTimeout(() => { setLoading(false); router.push('/') }, 1000)
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gradient mb-2">BarakahVault</h1>
                    <p className="text-dark-400">Start your ethical investment journey</p>
                </div>

                <div className="glass-card">
                    <h2 className="text-xl font-semibold text-white mb-6">Create Account</h2>

                    {error && <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">{error}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-dark-400 mb-2">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                <input type="text" value={formData.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Ahmad Abdullah" className="input-field pl-11" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-dark-400 mb-2">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                <input type="email" value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="your@email.com" className="input-field pl-11" required />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-dark-400 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => updateField('password', e.target.value)} placeholder="••••••••" className="input-field pl-11 pr-12" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white">
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-dark-400 mb-2">Confirm Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                                <input type={showPassword ? 'text' : 'password'} value={formData.confirmPassword} onChange={(e) => updateField('confirmPassword', e.target.value)} placeholder="••••••••" className="input-field pl-11" required />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? 'Creating account...' : 'Create Account'}</button>
                    </form>

                    <p className="text-center text-dark-400 mt-6">
                        Already have an account? <Link href="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
