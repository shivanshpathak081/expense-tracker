import Expense from '../models/Expense.js';
import Budget from '../models/Budget.js';
import { validateExpenseInput } from '../utils/validators.js';

// @desc    Get all expenses for logged-in user (search, filter, sort, paginate)
// @route   GET /api/expenses
// @access  Private
export const getExpenses = async (req, res, next) => {
  try {
    const { search, category, startDate, endDate, sortBy = 'date', order = 'desc', page = 1, limit = 10 } = req.query;

    const query = { user: req.user._id };

    if (search) {
      query.$text = { $search: search };
    }
    if (category) {
      query.category = category;
    }
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
    const skip = (pageNum - 1) * limitNum;

    const sortOrder = order === 'asc' ? 1 : -1;

    const [expenses, total] = await Promise.all([
      Expense.find(query).sort({ [sortBy]: sortOrder }).skip(skip).limit(limitNum),
      Expense.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: expenses.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      expenses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
export const getExpenseById = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    res.status(200).json({ success: true, expense });
  } catch (error) {
    next(error);
  }
};

// @desc    Create expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, date, paymentMethod, notes } = req.body;

    const errors = validateExpenseInput({ title, amount, category, date });
    if (errors.length) {
      return res.status(400).json({ success: false, message: errors.join(', ') });
    }

    const expense = await Expense.create({
      user: req.user._id,
      title,
      amount,
      category,
      date,
      paymentMethod,
      notes,
      receipt: req.file ? { url: req.file.path, publicId: req.file.filename } : undefined,
    });

    // Check whether this pushes the user over their budget for the category/month.
    const expDate = new Date(date);
    const budget = await Budget.findOne({
      user: req.user._id,
      category,
      month: expDate.getMonth() + 1,
      year: expDate.getFullYear(),
    });

    let budgetAlert = null;
    if (budget) {
      const spentAgg = await Expense.aggregate([
        {
          $match: {
            user: req.user._id,
            category,
            date: {
              $gte: new Date(expDate.getFullYear(), expDate.getMonth(), 1),
              $lt: new Date(expDate.getFullYear(), expDate.getMonth() + 1, 1),
            },
          },
        },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]);
      const spent = spentAgg[0]?.total || 0;
      const percentUsed = (spent / budget.limit) * 100;
      if (percentUsed >= budget.alertThreshold) {
        budgetAlert = {
          category,
          spent,
          limit: budget.limit,
          percentUsed: Math.round(percentUsed),
          exceeded: spent > budget.limit,
        };
      }
    }

    res.status(201).json({ success: true, expense, budgetAlert });
  } catch (error) {
    next(error);
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }

    const fields = ['title', 'amount', 'category', 'date', 'paymentMethod', 'notes'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) expense[field] = req.body[field];
    });

    if (req.file) {
      expense.receipt = { url: req.file.path, publicId: req.file.filename };
    }

    await expense.save();
    res.status(200).json({ success: true, expense });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!expense) {
      return res.status(404).json({ success: false, message: 'Expense not found' });
    }
    res.status(200).json({ success: true, message: 'Expense deleted successfully' });
  } catch (error) {
    next(error);
  }
};
