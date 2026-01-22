import { Shield, Heart, Brain, Users, Coins, Sparkles, ExternalLink, FileText, Newspaper, Building2 } from 'lucide-react';

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

    const getCardStyles = (score) => {
        if (score >= 80) return {
            border: 'border-primary-500/30',
            bg: 'bg-primary-500/5',
            glow: 'shadow-primary-500',
            text: 'text-primary-400'
        };
        if (score >= 70) return {
            border: 'border-gold-500/30',
            bg: 'bg-gold-500/5',
            glow: 'shadow-gold-500',
            text: 'text-gold-400'
        };
        return {
            border: 'border-red-500/40',
            bg: 'bg-red-500/10',
            glow: 'shadow-red-500',
            text: 'text-red-400'
        };
    };

    const styles = getCardStyles(data.totalScore);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            {/* Header */}
            <div className={`glass-card flex flex-col sm:flex-row items-center justify-between gap-4 border-l-4 ${styles.border} ${styles.bg} transition-colors duration-500`}>
                <div className="w-full sm:w-auto">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${styles.glow}/20 bg-dark-800 border border-dark-700 shrink-0`}>
                            <Sparkles className={`w-6 h-6 ${styles.text}`} />
                        </div>
                        <div>
                            <h2 className={`text-xl sm:text-2xl font-bold ${data.totalScore < 70 ? 'text-white' : 'text-white'}`}>{data.company}</h2>
                            <span className="text-sm text-dark-400 bg-dark-800 px-2 py-0.5 rounded border border-dark-700">{data.ticker}</span>
                        </div>
                    </div>
                </div>
                <div className="text-left sm:text-right w-full sm:w-auto flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                    <div className="text-sm text-dark-400 sm:mb-1">Maqasid Score</div>
                    <div className={`text-3xl sm:text-4xl font-bold ${styles.text}`}>
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

            {/* Alternatives Section */}
            {
                data.alternatives && data.alternatives.length > 0 && (
                    <div className="pt-6 border-t border-dark-800">
                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                            {data.totalScore < 75 ? (
                                <>
                                    <Sparkles className="w-5 h-5 text-emerald-400" />
                                    <span className="text-emerald-400">Better Halal Alternatives</span>
                                </>
                            ) : (
                                <>
                                    <Users className="w-5 h-5 text-primary-400" />
                                    <span className="text-primary-400">Top Industry Peers</span>
                                </>
                            )}
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {data.alternatives.map((alt, idx) => (
                                <div key={idx} className="glass-card hover:bg-dark-800 transition-colors p-4 group cursor-pointer">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-white group-hover:text-primary-400 transition-colors">{alt.company}</h4>
                                        <span className="text-xs bg-dark-900 border border-dark-700 px-1.5 py-0.5 rounded text-dark-400">{alt.ticker}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="text-2xl font-bold text-emerald-400">{alt.score}</div>
                                        <span className="text-xs text-dark-400">Maqasid Score</span>
                                    </div>
                                    <p className="text-xs text-dark-300 line-clamp-2">{alt.reason}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }

            {/* Sources / Citations Section */}
            {
                data.sources && data.sources.length > 0 && (
                    <div className="pt-6 border-t border-dark-800">
                        <h3 className="text-sm font-semibold text-dark-400 mb-3 flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            Sources & References
                        </h3>
                        <div className="space-y-2">
                            {data.sources.map((source, idx) => {
                                const getSourceIcon = (type) => {
                                    switch (type?.toLowerCase()) {
                                        case 'report': return FileText;
                                        case 'news': return Newspaper;
                                        case 'official': return Building2;
                                        default: return ExternalLink;
                                    }
                                };
                                const SourceIcon = getSourceIcon(source.type);
                                const searchQuery = encodeURIComponent(`${source.name} ${source.publisher || ''}`);
                                const googleSearchUrl = `https://www.google.com/search?q=${searchQuery}`;
                                return (
                                    <a
                                        key={idx}
                                        href={googleSearchUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-start gap-3 p-3 bg-dark-800/50 hover:bg-dark-800 border border-dark-700 hover:border-dark-600 rounded-lg text-dark-300 hover:text-white transition-all duration-200 group"
                                    >
                                        <SourceIcon className="w-4 h-4 mt-0.5 text-dark-500 group-hover:text-primary-400 transition-colors shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-dark-200 group-hover:text-white transition-colors">
                                                {source.name || source.title}
                                            </div>
                                            {source.publisher && (
                                                <div className="text-xs text-dark-500 mt-0.5">
                                                    {source.publisher}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-dark-500 group-hover:text-primary-400 transition-colors shrink-0">
                                            <span className="hidden sm:inline">Search</span>
                                            <ExternalLink className="w-3 h-3" />
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                        <p className="text-xs text-dark-500 mt-3">
                            Click to search for these references. Verify information independently.
                        </p>
                    </div>
                )
            }
        </div >
    );
}
