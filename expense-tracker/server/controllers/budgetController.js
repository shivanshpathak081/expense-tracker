import Budget from '../models/Budget.js';
import Expense from '../models/Expense.js';

// @desc    Get all budgets for logged-in user (optionally filtered by month/year)
// @route   GET /api/budget
// @access  Private
export const getBudgets = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const query = { user: req.user._id };
    if (month) query.month = Number(month);
    if (year) query.year = Number(year);

    const budgets = await Budget.find(query).sort({ category: 1 });

    // Attach live spend & progress for each budget.
    const enriched = await Promise.all(
      budgets.map(async (b) => {
        const spentAgg = await Expense.aggregate([
          {
            $match: {
              user: req.user._id,
              category: b.category,
              date: {
                $gte: new Date(b.year, b.month - 1, 1),
                $lt: new Date(b.year, b.month, 1),
              },
            },
          },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]);
        const spent = spentAgg[0]?.total || 0;
        return {
          ...b.toObject(),
          spent,
          remaining: Math.max(b.limit - spent, 0),
          percentUsed: b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0,
          exceeded: spent > b.limit,
        };
      })
    );

    res.status(200).json({ success: true, count: enriched.length, budgets: enriched });
  } catch (error) {
    next(error);
  }
};

// @desc    Create budget
// @route   POST /api/budget
// @access  Private
export const createBudget = async (req, res, next) => {
  try {
    const { category, limit, month, year, alertThreshold } = req.body;

    if (!category || limit === undefined || !month || !year) {
      return res.status(400).json({ success: false, message: 'Category, limit, month and year are required' });
    }

    const existing = await Budget.findOne({ user: req.user._id, category, month, year });
    if (existing) {
      return res.status(400).json({ success: false, message: 'A budget for this category and month already exists' });
    }

    const budget = await Budget.create({
      user: req.user._id,
      category,
      limit,
      month,
      year,
      alertThreshold: alertThreshold ?? 80,
    });

    res.status(201).json({ success: true, budget });
  } catch (error) {
    next(error);
  }
};

// @desc    Update budget
// @route   PUT /api/budget/:id
// @access  Private
export const updateBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, user: req.user._id });
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    const fields = ['limit', 'alertThreshold'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) budget[field] = req.body[field];
    });

    await budget.save();
    res.status(200).json({ success: true, budget });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete budget
// @route   DELETE /api/budget/:id
// @access  Private
export const deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }
    res.status(200).json({ success: true, message: 'Budget deleted successfully' });
  } catch (error) {
    next(error);
  }
};
