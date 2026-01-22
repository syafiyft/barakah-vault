# Zakat Section Enhancement Plan

## Current State Summary

### What Exists
- **Zakat Calculator**: Client-side only, manual input for gold/savings/stocks/crypto
- **Portfolio System**: Full CRUD with MongoDB storage (stocks, crypto, savings)
- **Price APIs**: Live prices for gold, BTC, ETH from CoinGecko
- **Dashboard Widget**: Hardcoded values ("RM 2,500", "March 15, 2026")

### Key Gaps
1. No Zakat history/records stored in database
2. Zakat calculator doesn't pull from portfolio
3. Dashboard shows hardcoded Zakat values
4. No Zakat payment tracking
5. No Haul (Islamic year) tracking

---

## Enhancement Plan

### Phase 1: Database & API Foundation

#### 1.1 Create Zakat Model (`models/Zakat.js`)
```javascript
{
  userEmail: String,

  // Zakat Configuration
  haulStartDate: Date,           // When user's Haul year starts
  nisabPreference: String,       // 'gold' or 'silver'

  // Zakat Records (historical)
  records: [{
    calculatedAt: Date,
    haulYear: String,            // e.g., "1446 AH" or "2025"

    // Asset breakdown at calculation time
    assets: {
      gold: { grams: Number, purity: String, value: Number },
      savings: Number,
      stocks: { value: Number, holdings: [{symbol, qty, value}] },
      crypto: { value: Number, holdings: [{symbol, qty, value}] }
    },

    totalAssets: Number,
    nisabThreshold: Number,
    zakatDue: Number,

    // Payment tracking
    status: String,              // 'calculated' | 'partial' | 'paid'
    paidAmount: Number,
    paidDate: Date,
    paymentMethod: String,       // 'cash' | 'online' | 'organization'
    notes: String
  }],

  // Quick access to current calculation
  currentZakat: {
    calculatedAt: Date,
    totalAssets: Number,
    zakatDue: Number,
    status: String
  }
}
```

#### 1.2 Create Zakat API Endpoints (`api/zakat/route.js`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/zakat` | Get user's Zakat config & current calculation |
| POST | `/api/zakat/calculate` | Calculate Zakat from portfolio + manual inputs |
| POST | `/api/zakat/record` | Save a Zakat calculation record |
| PUT | `/api/zakat/pay` | Mark Zakat as paid (full/partial) |
| GET | `/api/zakat/history` | Get all Zakat records for user |
| PUT | `/api/zakat/config` | Update Haul date, preferences |

---

### Phase 2: Portfolio Integration

#### 2.1 Auto-Import from Portfolio
The Zakat calculator should:
1. **Pre-fill from Portfolio**: Auto-load stocks, crypto, savings values
2. **Allow Manual Override**: User can adjust or add items not in portfolio
3. **Add Gold Separately**: Gold isn't in portfolio, remains manual input

#### 2.2 Enhanced Calculator Flow
```
1. User opens Zakat Calculator
2. System fetches:
   - /api/portfolio (user holdings)
   - /api/prices (gold, BTC, ETH prices)
   - /api/stocks?symbols=... (stock prices)
3. Pre-populate form with:
   - Savings total from portfolio
   - Stock holdings with current values
   - Crypto holdings with current values
4. User adds:
   - Gold holdings (manual - not in portfolio)
   - Any additional savings/assets
5. Calculate Zakat
6. Option to save calculation as record
```

#### 2.3 New Component: `ZakatAssetImport`
- Shows portfolio breakdown
- Checkbox to include/exclude each asset
- Toggle between "Use Portfolio" and "Manual Entry"

---

### Phase 3: Dashboard Integration

#### 3.1 Dynamic Zakat Widget
Replace hardcoded values with:

```javascript
// Fetch from /api/zakat
{
  zakatDue: calculated from current portfolio,
  haulEndDate: user's configured date,
  daysRemaining: calculated,
  status: 'pending' | 'partial' | 'paid',
  lastCalculated: timestamp
}
```

#### 3.2 Dashboard Zakat Card Features
- **Zakat Due Amount**: Calculated from portfolio (real-time)
- **Days Until Haul**: Countdown to user's Haul end date
- **Quick Recalculate**: Button to refresh calculation
- **Payment Status**: Visual indicator (pending/partial/paid)
- **Link to Full Calculator**: "Calculate Now" button

#### 3.3 Stats Card Update
Change "Zakat Paid (2025)" to show actual paid amount from records.

---

### Phase 4: Enhanced Zakat Calculator Page

#### 4.1 New Features
1. **Portfolio Import Toggle**: Switch between manual and auto-import
2. **Haul Configuration**: Set/edit Haul start date
3. **Save Calculation**: Store calculation with timestamp
4. **Payment Recording**: Mark as paid with details
5. **History View**: See past calculations and payments
6. **Export/Print**: Generate Zakat statement PDF

#### 4.2 Updated UI Sections
```
┌─────────────────────────────────────────────────────┐
│  ZAKAT CALCULATOR                                   │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐          │
│  │ Your Haul       │  │ Nisab Today     │          │
│  │ Ends: Mar 15    │  │ RM 32,725       │          │
│  │ 57 days left    │  │ (85g gold)      │          │
│  └─────────────────┘  └─────────────────┘          │
├─────────────────────────────────────────────────────┤
│  ASSETS                    [Import from Portfolio]  │
├─────────────────────────────────────────────────────┤
│  Gold Holdings                                      │
│  ├─ 999 Karat: ___ grams  = RM ___                 │
│  └─ 916 Karat: ___ grams  = RM ___                 │
│                                                     │
│  Savings (from Portfolio)              RM 15,000   │
│  ├─ Emergency Fund         RM 10,000   [✓]         │
│  └─ Maybank Savings        RM 5,000    [✓]         │
│                                                     │
│  Stocks (from Portfolio)               RM 25,000   │
│  ├─ MSFT (10 shares)       RM 20,000   [✓]         │
│  └─ AAPL (5 shares)        RM 5,000    [✓]         │
│                                                     │
│  Crypto (from Portfolio)               RM 8,000    │
│  ├─ BTC (0.01)             RM 5,000    [✓]         │
│  └─ ETH (0.5)              RM 3,000    [✓]         │
│                                                     │
│  + Add Other Assets                                 │
├─────────────────────────────────────────────────────┤
│  CALCULATION                                        │
│  ─────────────────────────────────────────────────  │
│  Total Zakatable Assets           RM 48,000        │
│  Nisab Threshold                  RM 32,725        │
│  Status                           ✓ Above Nisab    │
│  ─────────────────────────────────────────────────  │
│  ZAKAT DUE (2.5%)                 RM 1,200         │
├─────────────────────────────────────────────────────┤
│  [Save Calculation]  [Mark as Paid]  [Print]       │
└─────────────────────────────────────────────────────┘
```

#### 4.3 History Tab
```
┌─────────────────────────────────────────────────────┐
│  ZAKAT HISTORY                                      │
├─────────────────────────────────────────────────────┤
│  2025 (1446 AH)                                    │
│  ├─ Calculated: Jan 15, 2025                       │
│  ├─ Total Assets: RM 48,000                        │
│  ├─ Zakat Due: RM 1,200                            │
│  └─ Status: ✓ PAID (Jan 20, 2025)                  │
│                                                     │
│  2024 (1445 AH)                                    │
│  ├─ Calculated: Jan 10, 2024                       │
│  ├─ Total Assets: RM 35,000                        │
│  ├─ Zakat Due: RM 875                              │
│  └─ Status: ✓ PAID (Jan 15, 2024)                  │
└─────────────────────────────────────────────────────┘
```

---

### Phase 5: Additional Enhancements

#### 5.1 Zakat Reminders
- Email/notification when Haul is approaching
- Reminder if Zakat is calculated but unpaid

#### 5.2 Zakat Recipients Tracker (Optional)
- Track where Zakat was distributed
- Categories: Fakir, Miskin, Amil, etc. (8 Asnaf)

#### 5.3 Multi-Year Comparison
- Chart showing Zakat trend over years
- Asset growth vs Zakat obligations

---

## Implementation Order

### Step 1: Backend Foundation
1. Create Zakat model
2. Create Zakat API endpoints
3. Test with Postman/curl

### Step 2: Calculator Enhancement
1. Add portfolio import to calculator
2. Add save calculation feature
3. Add Haul date configuration

### Step 3: Dashboard Integration
1. Replace hardcoded values with API calls
2. Add real-time Zakat calculation
3. Add countdown to Haul

### Step 4: History & Payments
1. Add history tab to calculator
2. Add payment recording
3. Add history view

### Step 5: Polish
1. Add loading states
2. Add error handling
3. Add export/print feature

---

## Files to Create/Modify

### New Files
- `frontend/models/Zakat.js` - Database model
- `frontend/app/api/zakat/route.js` - Main API
- `frontend/app/api/zakat/calculate/route.js` - Calculation endpoint
- `frontend/app/api/zakat/history/route.js` - History endpoint
- `frontend/components/ZakatAssetImport.js` - Portfolio import component
- `frontend/components/ZakatHistory.js` - History display component

### Modified Files
- `frontend/app/(dashboard)/zakat/page.js` - Enhanced calculator
- `frontend/app/(dashboard)/page.js` - Dynamic dashboard widget

---

## API Response Examples

### GET /api/zakat
```json
{
  "config": {
    "haulStartDate": "2024-03-15",
    "haulEndDate": "2025-03-15",
    "nisabPreference": "gold"
  },
  "current": {
    "calculatedAt": "2025-01-20T10:00:00Z",
    "totalAssets": 48000,
    "nisabThreshold": 32725,
    "zakatDue": 1200,
    "status": "pending"
  },
  "summary": {
    "totalPaidThisYear": 0,
    "totalPaidAllTime": 2075,
    "recordsCount": 3
  }
}
```

### POST /api/zakat/calculate
```json
// Request
{
  "includePortfolio": true,
  "manualAssets": {
    "gold999": 10,
    "gold916": 5,
    "additionalSavings": 0
  },
  "excludeHoldings": ["savings_id_123"]  // Optional exclusions
}

// Response
{
  "calculation": {
    "assets": {
      "gold": { "grams": 15, "value": 5775 },
      "savings": 15000,
      "stocks": 25000,
      "crypto": 8000
    },
    "totalAssets": 53775,
    "nisabThreshold": 32725,
    "aboveNisab": true,
    "zakatDue": 1344.38
  },
  "prices": {
    "gold999": 385,
    "gold916": 352,
    "btc": 440000,
    "eth": 15000
  }
}
```

---

## Notes

- **Nisab**: Always calculated from live gold price (85g × gold price)
- **Haul**: Islamic lunar year (~354 days), user configures start date
- **Currency**: All values in MYR for now
- **Zakat Rate**: Fixed at 2.5% (1/40th)
