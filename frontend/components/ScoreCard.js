import { Shield, Heart, Brain, Users, Coins, Sparkles } from 'lucide-react';

export default function ScoreCard({ data }) {
    if (!data) return null;

    const dimensions = [
        { key: 'faith', label: 'Faith (Deen)', icon: Shield, color: 'text-purple-400', bg: 'bg-purple-500/20' },
        { key: 'life', label: 'Life (Nafs)', icon: Heart, color: 'text-red-400', bg: 'bg-red-500/20' },
        { key: 'intellect', label: 'Intellect (\'Aql)', icon: Brain, color: 'text-blue-400', bg: 'bg-blue-500/20' },
        { key: 'lineage', label: 'Lineage (Nasl)', icon: Users, color: 'text-green-400', bg: 'bg-green-500/20' },
        { key: 'wealth', label: 'Wealth (Mal)', icon: Coins, color: 'text-gold-400', bg: 'bg-gold-500/20' },
    ];

    const getScoreColor = (score) => {
        if (score >= 80) return 'bg-primary-500';
        if (score >= 60) return 'bg-gold-500';
        return 'bg-red-500';
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="glass-card flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-gold-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{data.company}</h2>
                            <span className="text-sm text-dark-400 bg-dark-800 px-2 py-0.5 rounded border border-dark-700">{data.ticker}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm text-dark-400 mb-1">Maqasid Score</div>
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-gold-400">
                        {data.totalScore}/100
                    </div>
                </div>
            </div>

            {/* Dimensions Grid */}
            <div className="grid md:grid-cols-2 gap-4">
                {dimensions.map((dim) => {
                    const scoreData = data.breakdown[dim.key];
                    return (
                        <div key={dim.key} className="glass-card hover:bg-dark-800/80 transition-all duration-300 group">
                            <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-lg ${dim.bg} flex items-center justify-center shrink-0`}>
                                    <dim.icon className={`w-5 h-5 ${dim.color}`} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-semibold text-white">{dim.label}</h3>
                                        <span className={`text-sm font-bold ${dim.color}`}>{scoreData.score}/100</span>
                                    </div>

                                    <div className="h-2 bg-dark-700 rounded-full overflow-hidden mb-3">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ${getScoreColor(scoreData.score)}`}
                                            style={{ width: `${scoreData.score}%` }}
                                        />
                                    </div>

                                    <p className="text-sm text-dark-400 leading-relaxed">
                                        {scoreData.reasoning}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
