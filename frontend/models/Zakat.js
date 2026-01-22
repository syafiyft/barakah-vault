import mongoose from 'mongoose';

// Asset breakdown at calculation time
const ZakatAssetsSchema = new mongoose.Schema({
    gold: {
        grams999: { type: Number, default: 0 },
        grams916: { type: Number, default: 0 },
        totalValue: { type: Number, default: 0 },
    },
    savings: { type: Number, default: 0 },
    stocks: {
        totalValue: { type: Number, default: 0 },
        holdings: [{
            symbol: String,
            name: String,
            quantity: Number,
            value: Number,
        }],
    },
    crypto: {
        totalValue: { type: Number, default: 0 },
        holdings: [{
            symbol: String,
            name: String,
            quantity: Number,
            value: Number,
        }],
    },
    otherAssets: { type: Number, default: 0 },
}, { _id: false });

// Individual Zakat calculation record
const ZakatRecordSchema = new mongoose.Schema({
    calculatedAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    haulYear: {
        type: String, // e.g., "2025" or "1446 AH"
        required: true,
    },
    assets: ZakatAssetsSchema,
    totalAssets: {
        type: Number,
        required: true,
    },
    nisabThreshold: {
        type: Number,
        required: true,
    },
    nisabGoldPrice: {
        type: Number, // Gold price per gram at calculation time
        required: true,
    },
    zakatDue: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'partial', 'paid'],
        default: 'pending',
    },
    paidAmount: {
        type: Number,
        default: 0,
    },
    paidDate: Date,
    paymentMethod: {
        type: String,
        enum: ['cash', 'bank_transfer', 'organization', 'other'],
    },
    paymentNotes: String,
}, { _id: true, timestamps: true });

// Main Zakat document per user
const ZakatSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        required: [true, 'User email is required'],
        unique: true,
    },
    // Haul configuration
    haulStartDate: {
        type: Date,
        default: () => new Date(), // Default to today
    },
    nisabPreference: {
        type: String,
        enum: ['gold', 'silver'],
        default: 'gold',
    },
    // All Zakat records
    records: [ZakatRecordSchema],
    // Quick reference to latest calculation
    currentCalculation: {
        calculatedAt: Date,
        totalAssets: Number,
        zakatDue: Number,
        status: {
            type: String,
            enum: ['pending', 'partial', 'paid'],
        },
    },
}, { timestamps: true });

// Helper method to get days until Haul ends
ZakatSchema.methods.getDaysUntilHaul = function() {
    if (!this.haulStartDate) return null;

    const haulStart = new Date(this.haulStartDate);
    const haulEnd = new Date(haulStart);
    haulEnd.setFullYear(haulEnd.getFullYear() + 1); // Add 1 year

    const today = new Date();
    const diffTime = haulEnd - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays > 0 ? diffDays : 0;
};

// Helper method to get current year's record
ZakatSchema.methods.getCurrentYearRecord = function() {
    const currentYear = new Date().getFullYear().toString();
    return this.records.find(r => r.haulYear === currentYear);
};

export default mongoose.models.Zakat || mongoose.model('Zakat', ZakatSchema);
