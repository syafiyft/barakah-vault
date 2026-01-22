'use client'

import { Quote } from 'lucide-react'

const islamicQuotes = [
    {
        text: "The upper hand is better than the lower hand. The upper hand is the one that gives, and the lower hand is the one that receives.",
        source: "Prophet Muhammad (PBUH)",
        reference: "Sahih al-Bukhari"
    },
    {
        text: "Wealth is not in having many possessions, but rather true wealth is the richness of the soul.",
        source: "Prophet Muhammad (PBUH)",
        reference: "Sahih al-Bukhari"
    },
    {
        text: "Give charity without delay, for it stands in the way of calamity.",
        source: "Prophet Muhammad (PBUH)",
        reference: "Tirmidhi"
    },
    {
        text: "The believer's shade on the Day of Resurrection will be his charity.",
        source: "Prophet Muhammad (PBUH)",
        reference: "Tirmidhi"
    },
    {
        text: "And spend in the way of Allah and do not throw yourselves into destruction. And do good; indeed, Allah loves the doers of good.",
        source: "Al-Quran",
        reference: "Surah Al-Baqarah 2:195"
    },
    {
        text: "Those who spend their wealth in the way of Allah and then do not follow up what they have spent with reminders or injury will have their reward with their Lord.",
        source: "Al-Quran",
        reference: "Surah Al-Baqarah 2:262"
    },
    {
        text: "O you who believe! Do not consume one another's wealth unjustly but only in lawful business by mutual consent.",
        source: "Al-Quran",
        reference: "Surah An-Nisa 4:29"
    },
    {
        text: "And whatever you spend in good, it will be repaid to you in full, and you shall not be wronged.",
        source: "Al-Quran",
        reference: "Surah Al-Baqarah 2:272"
    },
    {
        text: "Take from their wealth a charity by which you purify them and cause them increase.",
        source: "Al-Quran",
        reference: "Surah At-Tawbah 9:103"
    },
    {
        text: "The example of those who spend their wealth in the way of Allah is like a seed which grows seven spikes; in each spike is a hundred grains.",
        source: "Al-Quran",
        reference: "Surah Al-Baqarah 2:261"
    },
    {
        text: "He who eats and drinks whilst his brother goes hungry is not one of us.",
        source: "Prophet Muhammad (PBUH)",
        reference: "Al-Hakim"
    },
    {
        text: "The honest and trustworthy merchant will be with the prophets, the truthful, and the martyrs.",
        source: "Prophet Muhammad (PBUH)",
        reference: "Tirmidhi"
    },
    {
        text: "Allah does not look at your appearance or your wealth, but He looks at your hearts and your deeds.",
        source: "Prophet Muhammad (PBUH)",
        reference: "Sahih Muslim"
    },
    {
        text: "Whoever relieves a believer's distress of the distressful aspects of this world, Allah will rescue him from a difficulty of the difficulties of the Hereafter.",
        source: "Prophet Muhammad (PBUH)",
        reference: "Sahih Muslim"
    },
    {
        text: "And establish prayer and give Zakat, and whatever good you put forward for yourselves, you will find it with Allah.",
        source: "Al-Quran",
        reference: "Surah Al-Baqarah 2:110"
    },
    {
        text: "Never will you attain righteousness until you spend from that which you love.",
        source: "Al-Quran",
        reference: "Surah Al-Imran 3:92"
    },
    {
        text: "And those who hoard gold and silver and spend it not in the way of Allah - give them tidings of a painful punishment.",
        source: "Al-Quran",
        reference: "Surah At-Tawbah 9:34"
    },
    {
        text: "The best of people are those who are most beneficial to others.",
        source: "Prophet Muhammad (PBUH)",
        reference: "Daraqutni"
    },
    {
        text: "Charity does not decrease wealth.",
        source: "Prophet Muhammad (PBUH)",
        reference: "Sahih Muslim"
    },
    {
        text: "Protect yourself from the Hellfire even if it is with half a date in charity.",
        source: "Prophet Muhammad (PBUH)",
        reference: "Sahih al-Bukhari"
    },
    {
        text: "When a person dies, all their deeds end except three: ongoing charity, beneficial knowledge, or a righteous child who prays for them.",
        source: "Prophet Muhammad (PBUH)",
        reference: "Sahih Muslim"
    },
    {
        text: "And do not consume one another's wealth unjustly or send it to the rulers in order that they might aid you to consume a portion of the wealth of the people in sin.",
        source: "Al-Quran",
        reference: "Surah Al-Baqarah 2:188"
    },
    {
        text: "Be in this world as if you were a stranger or a traveler along a path.",
        source: "Prophet Muhammad (PBUH)",
        reference: "Sahih al-Bukhari"
    },
    {
        text: "The two feet of the son of Adam will not move on the Day of Judgement until he is asked about his wealth - how he earned it and how he spent it.",
        source: "Prophet Muhammad (PBUH)",
        reference: "Tirmidhi"
    },
    {
        text: "Allah has made Zakat obligatory simply to purify your remaining wealth.",
        source: "Prophet Muhammad (PBUH)",
        reference: "Abu Dawud"
    },
    {
        text: "Whoever guides someone to goodness will have a reward like the one who did it.",
        source: "Prophet Muhammad (PBUH)",
        reference: "Sahih Muslim"
    },
    {
        text: "The strong believer is better and more beloved to Allah than the weak believer, while there is good in both.",
        source: "Prophet Muhammad (PBUH)",
        reference: "Sahih Muslim"
    },
    {
        text: "Richness is not having many belongings, but richness is being content with oneself.",
        source: "Prophet Muhammad (PBUH)",
        reference: "Sahih al-Bukhari"
    },
    {
        text: "And whatever thing you spend, He will replace it; and He is the best of providers.",
        source: "Al-Quran",
        reference: "Surah Saba 34:39"
    },
    {
        text: "Blessed is the wealth of a Muslim from which he gives to the poor, the orphan, and the traveler.",
        source: "Prophet Muhammad (PBUH)",
        reference: "Sahih al-Bukhari"
    }
]

export function getDailyQuote() {
    // Use day of year to get a consistent quote for each day
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now - start
    const oneDay = 1000 * 60 * 60 * 24
    const dayOfYear = Math.floor(diff / oneDay)

    return islamicQuotes[dayOfYear % islamicQuotes.length]
}

export default function DailyQuote() {
    const quote = getDailyQuote()

    return (
        <div className="glass-card bg-gradient-to-br from-primary-500/10 to-gold-500/10 border-primary-500/20">
            <div className="flex gap-4">
                <div className="shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                        <Quote className="w-5 h-5 text-primary-400" />
                    </div>
                </div>
                <div className="flex-1">
                    <p className="text-white leading-relaxed italic">
                        "{quote.text}"
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                        <p className="text-sm text-primary-400 font-medium">
                            — {quote.source}
                        </p>
                        <p className="text-xs text-dark-400">
                            {quote.reference}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
