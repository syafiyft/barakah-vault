# 🌟 BarakahVault - Ethical Islamic Investment Platform

> **AI-Powered Maqasid Scoring + Shariah-Verified Crowdfunding + Smart Zakat Tools**

**Tagline:** *"Invest in companies that embody Islamic values. Give to verified halal projects. All in one platform."*

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Core Features](#-core-features)
- [How It Works](#-how-it-works)
- [Technical Architecture](#-technical-architecture)
- [Getting Started](#-getting-started)

---

## 🎯 Project Overview

**BarakahVault** is an ethical Islamic investment platform designed for the **AI Fiqh Hackathon in Islamic Finance 2026**. It helps Muslims:

1. **Invest wisely** using AI-powered Maqasid al-Shariah scoring.
2. **Calculate zakat** accurately for traditional and crypto assets.
3. **Give transparently** through Shariah-verified crowdfunding projects.

It addresses the lack of deep ethical screening in current Islamic finance apps and provides a trusted ecosystem for wealth management and charity.

---

## ⭐ Core Features

### **1. AI-Powered Maqasid al-Shariah Investment Scorer** 🎯

Scores companies on how well they promote the 5 objectives of Islamic law (Maqasid al-Shariah), going beyond simple halal/haram binary checks.

- **Faith (Deen):** Privacy protection, religious freedom.
- **Life (Nafs):** Worker safety, environmental impact.
- **Intellect (Aql):** Innovation, R&D, education.
- **Lineage (Nasl):** Family policies, work-life balance.
- **Wealth (Mal):** Fair wages, economic stability.

### **2. Dual Zakat Calculator System** 💰

A comprehensive tool for calculating Zakat on all asset types.

- **Traditional Calculator:** For cash, gold, stocks, and savings.
- **Crypto Calculator:** Offers 3 scholar-backed methods (Market Value, Trading Goods, Mining Rewards) to help users calculate crypto Zakat confidently despite differing fatwas.

### **3. Halal Crowdfunding with Shariah Board Verification** 🎪

A transparent charitable giving platform built on trust.

- **verified:** All projects reviewed by a 3-scholar Shariah Board.
- **Smart Contracts:** Funds released only upon milestone completion.
- **Blockchain Tracking:** Every donation tracked for total transparency.

---

## 🏗️ Technical Architecture

### **Frontend**

- **Framework:** Next.js 14
- **Styling:** Tailwind CSS (Glassmorphism design)
- **Icons:** Lucide React
- **Auth:** NextAuth.js / Google OAuth

### **Backend**

- **Runtime:** Node.js
- **Database:** MongoDB
- **AI:** OpenAI API (for Maqasid analysis)

### **Blockchain**

- **Framework:** Hardhat (Localhost for Dev)
- **Smart Contracts:** Solidity (OpenZeppelin)
- **Network:** Polygon Amoy (Planned for Production)

---

## 🚀 Getting Started

Follow these instructions to set up the full project (Blockchain + Frontend) locally.

### Prerequisites

- Node.js (v18 or higher)
- MetaMask Extension installed in your browser

### 1. Blockchain Setup ⛓️

We use a local Hardhat network to simulate the blockchain.

**Terminal 1:** Start the local node

```bash
cd blockchain
npx hardhat node
```

_Keep this terminal running! It gives you 20 test accounts with fake ETH.*

**Terminal 2:** Deploy Smart Contracts

```bash
cd blockchain
# Deploy contracts and seed initial data
npx hardhat run scripts/deploy.js --network localhost
```

_This will also automatically export the contract addresses to `frontend/utils/contracts.json`.*

### 2. Frontend Setup 💻

**Terminal 2 (or 3):** Start the web app

```bash
cd frontend

# Install dependencies (if first time)
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### 3. MetaMask Configuration (Crucial!) 🦊

To interact with the app, you must connect MetaMask to your local blockchain.

1. **Add Network:**
    - Open MetaMask -> Settings -> Networks -> Add Network -> Add a network manually.
    - **Network Name:** Hardhat Localhost
    - **RPC URL:** `http://127.0.0.1:8545/`
    - **Chain ID:** `31337`
    - **Currency Symbol:** `ETH`

2. **Import Test Account:**
    - Look at **Terminal 1** (`npx hardhat node` output).
    - Copy the **Private Key** of Account #0 or #1.
    - Metamask -> Accounts -> Import Account -> Paste Key.
    - You should see **10,000 ETH** balance.

3. **Connect & Play:**
    - Go to the **Crowdfunding** page.
    - Click **Connect Wallet**.
    - Contribute to a project! 🚀
