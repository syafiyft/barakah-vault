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

- **Smart Contracts:** Solidity
- **Network:** Polygon Testnet

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### First Time Setup

```bash
# Clone the repository (if you haven't already)
git clone <repository-url>

# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install
```

### Configuration

Create a `.env.local` file in the `frontend` directory with the following variables:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
# Add other necessary env vars here
```

### How to Run

Start the development server:

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
