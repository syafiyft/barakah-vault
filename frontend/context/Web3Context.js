'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import contractsInfo from '@/utils/contracts.json';

const Web3Context = createContext({
    account: null,
    connectWallet: async () => { },
    provider: null,
    signer: null,
    contracts: {
        receipt: null,
        crowdfunding: null
    },
    isConnected: false,
    error: null
});

export function Web3Provider({ children }) {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contracts, setContracts] = useState({ receipt: null, crowdfunding: null });
    const [error, setError] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    const initContracts = useCallback(async (currentSigner) => {
        if (!currentSigner) return;

        try {
            const receiptContract = new ethers.Contract(
                contractsInfo.receipt.address,
                contractsInfo.receipt.abi,
                currentSigner
            );

            const crowdfundingContract = new ethers.Contract(
                contractsInfo.crowdfunding.address,
                contractsInfo.crowdfunding.abi,
                currentSigner
            );

            setContracts({
                receipt: receiptContract,
                crowdfunding: crowdfundingContract
            });
        } catch (err) {
            console.error("Failed to load contracts:", err);
            // Don't set error here to avoid blocking UI, just log it
        }
    }, []);

    const connectWallet = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                setError(null);
                const browserProvider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await browserProvider.send("eth_requestAccounts", []);
                const currentSigner = await browserProvider.getSigner();

                setProvider(browserProvider);
                setSigner(currentSigner);
                setAccount(accounts[0]);
                setIsConnected(true);

                await initContracts(currentSigner);
            } catch (err) {
                console.error(err);
                setError("Failed to connect wallet: " + err.message);
            }
        } else {
            setError("Please install MetaMask to use this feature.");
            // For demo purposes, maybe fallback to readonly?
            // But for now, just show error.
        }
    };

    useEffect(() => {
        // Check if already connected
        const checkConnection = async () => {
            if (typeof window.ethereum !== 'undefined') {
                const browserProvider = new ethers.BrowserProvider(window.ethereum);
                const accounts = await browserProvider.listAccounts();
                if (accounts.length > 0) {
                    const currentSigner = await browserProvider.getSigner();
                    setProvider(browserProvider);
                    setSigner(currentSigner);
                    setAccount(accounts[0].address);
                    setIsConnected(true);
                    await initContracts(currentSigner);
                }
            }
        };
        checkConnection();

        if (typeof window.ethereum !== 'undefined') {
            window.ethereum.on('accountsChanged', (accounts) => {
                window.location.reload();
            });
            window.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }

        return () => {
            if (typeof window.ethereum !== 'undefined') {
                window.ethereum.removeAllListeners();
            }
        };
    }, [initContracts]);

    const disconnectWallet = () => {
        setAccount(null);
        setProvider(null);
        setSigner(null);
        setIsConnected(false);
        setContracts({ receipt: null, crowdfunding: null });
        // Optional: Remove listeners if manually disconnecting, though useEffect cleanup handles component unmount
    };

    return (
        <Web3Context.Provider value={{ account, connectWallet, disconnectWallet, provider, signer, contracts, isConnected, error }}>
            {children}
        </Web3Context.Provider>
    );
}

export function useWeb3() {
    return useContext(Web3Context);
}
