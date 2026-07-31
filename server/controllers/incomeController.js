import Income from '../models/Income.js';

// @desc    Get all income entries for logged-in user
// @route   GET /api/income
// @access  Private
export const getIncomes = async (req, res, next) => {
  try {
    const { search, category, startDate, endDate, sortBy = 'date', order = 'desc', page = 1, limit = 10 } = req.query;

    const query = { user: req.user._id };
    if (search) query.source = { $regex: search, $options: 'i' };
    if (category) query.category = category;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
    const skip = (pageNum - 1) * limitNum;
    const sortOrder = order === 'asc' ? 1 : -1;

    const [incomes, total] = await Promise.all([
      Income.find(query).sort({ [sortBy]: sortOrder }).skip(skip).limit(limitNum),
      Income.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: incomes.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      incomes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create income entry
// @route   POST /api/income
// @access  Private
export const createIncome = async (req, res, next) => {
  try {
    const { source, amount, category, date, notes } = req.body;

    if (!source || !amount || !category || !date) {
      return res.status(400).json({ success: false, message: 'Source, amount, category and date are required' });
    }

    const income = await Income.create({ user: req.user._id, source, amount, category, date, notes });
    res.status(201).json({ success: true, income });
  } catch (error) {
    next(error);
  }
};

// @desc    Update income entry
// @route   PUT /api/income/:id
// @access  Private
export const updateIncome = async (req, res, next) => {
  try {
    const income = await Income.findOne({ _id: req.params.id, user: req.user._id });
    if (!income) {
      return res.status(404).json({ success: false, message: 'Income entry not found' });
    }

    const fields = ['source', 'amount', 'category', 'date', 'notes'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) income[field] = req.body[field];
    });

    await income.save();
    res.status(200).json({ success: true, income });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete income entry
// @route   DELETE /api/income/:id
// @access  Private
export const deleteIncome = async (req, res, next) => {
  try {
    const income = await Income.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!income) {
      return res.status(404).json({ success: false, message: 'Income entry not found' });
    }
    res.status(200).json({ success: true, message: 'Income entry deleted successfully' });
  } catch (error) {
    next(error);
  }
};
