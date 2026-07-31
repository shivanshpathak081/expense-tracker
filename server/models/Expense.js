import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: [true, 'Title is required'], trim: true },
    amount: { type: Number, required: [true, 'Amount is required'], min: [0, 'Amount cannot be negative'] },
    category: {
      type: String,
      required: true,
      enum: [
        'Food', 'Transport', 'Housing', 'Utilities', 'Entertainment',
        'Health', 'Shopping', 'Education', 'Travel', 'Other',
      ],
    },
    date: { type: Date, required: true, default: Date.now },
    paymentMethod: { type: String, enum: ['Cash', 'Card', 'UPI', 'BankTransfer', 'Other'], default: 'Cash' },
    notes: { type: String, trim: true, default: '' },
    receipt: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

expenseSchema.index({ user: 1, date: -1 });
expenseSchema.index({ title: 'text', notes: 'text' });

export default mongoose.model('Expense', expenseSchema);
