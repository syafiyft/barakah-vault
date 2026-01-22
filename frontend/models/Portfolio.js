import mongoose from 'mongoose';

const StockHoldingSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        uppercase: true,
    },
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    averageCost: {
        type: Number,
        required: true,
        min: 0,
    },
}, { _id: true });

const CryptoHoldingSchema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        uppercase: true,
    },
    name: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
    },
    averageCost: {
        type: Number,
        required: true,
        min: 0,
    },
}, { _id: true });

const SavingsAccountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
        min: 0,
    },
    currency: {
        type: String,
        default: 'MYR',
    },
}, { _id: true });

const PortfolioHistorySchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    totalValue: {
        type: Number,
        required: true,
    },
    stocksValue: {
        type: Number,
        default: 0,
    },
    cryptoValue: {
        type: Number,
        default: 0,
    },
    savingsValue: {
        type: Number,
        default: 0,
    },
}, { _id: false });

const PortfolioSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: [true, 'User email is required'],
        unique: true,
    },
    stocks: [StockHoldingSchema],
    crypto: [CryptoHoldingSchema],
    savings: [SavingsAccountSchema],
    history: [PortfolioHistorySchema],
}, { timestamps: true });

export default mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);
