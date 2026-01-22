'use client'

import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Legend,
    Tooltip,
    ResponsiveContainer
} from 'recharts'

const dimensionLabels = {
    faith: 'Faith',
    life: 'Life',
    intellect: 'Intellect',
    lineage: 'Lineage',
    wealth: 'Wealth'
}

const companyColors = [
    { stroke: '#a855f7', fill: 'rgba(168, 85, 247, 0.2)' },  // purple
    { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.2)' },  // emerald
    { stroke: '#eab308', fill: 'rgba(234, 179, 8, 0.2)' },   // gold
]

export default function ComparisonRadarChart({ companies }) {
    if (!companies || companies.length < 2) return null

    // Transform data for radar chart
    const chartData = Object.keys(dimensionLabels).map(key => {
        const dataPoint = { dimension: dimensionLabels[key] }
        companies.forEach((company, index) => {
            dataPoint[company.company] = company.breakdown[key]?.score || 0
        })
        return dataPoint
    })

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-dark-900 border border-dark-700 rounded-lg p-3 shadow-xl">
                    <p className="text-white font-semibold mb-2">{label}</p>
                    {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span className="text-dark-300">{entry.dataKey}:</span>
                            <span className="text-white font-medium">{entry.value}</span>
                        </div>
                    ))}
                </div>
            )
        }
        return null
    }

    return (
        <div className="glass-card">
            <h3 className="text-lg font-semibold text-white mb-4">Maqasid Comparison</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
                        <PolarGrid stroke="#374151" />
                        <PolarAngleAxis
                            dataKey="dimension"
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                        />
                        <PolarRadiusAxis
                            angle={90}
                            domain={[0, 100]}
                            tick={{ fill: '#6b7280', fontSize: 10 }}
                            tickCount={5}
                        />
                        {companies.map((company, index) => (
                            <Radar
                                key={company.company}
                                name={company.company}
                                dataKey={company.company}
                                stroke={companyColors[index].stroke}
                                fill={companyColors[index].fill}
                                strokeWidth={2}
                            />
                        ))}
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            wrapperStyle={{ paddingTop: '20px' }}
                            formatter={(value) => (
                                <span className="text-dark-300 text-sm">{value}</span>
                            )}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
