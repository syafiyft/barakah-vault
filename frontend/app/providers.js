'use client'

import { SessionProvider } from "next-auth/react"
import { Web3Provider } from "@/context/Web3Context"

export function Providers({ children }) {
    return (
        <SessionProvider>
            <Web3Provider>
                {children}
            </Web3Provider>
        </SessionProvider>
    )
}
