import Expense from '../models/Expense.js';
import Income from '../models/Income.js';

// @desc    Get dashboard summary: balance, totals, monthly summary, recent transactions, insights
// @route   GET /api/dashboard
// @access  Private
export const getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [totalIncomeAgg, totalExpenseAgg, monthIncomeAgg, monthExpenseAgg, lastMonthExpenseAgg, byCategory, recentExpenses, recentIncomes, monthlyTrend] =
      await Promise.all([
        Income.aggregate([{ $match: { user: userId } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
        Expense.aggregate([{ $match: { user: userId } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
        Income.aggregate([
          { $match: { user: userId, date: { $gte: startOfMonth, $lt: startOfNextMonth } } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        Expense.aggregate([
          { $match: { user: userId, date: { $gte: startOfMonth, $lt: startOfNextMonth } } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        Expense.aggregate([
          { $match: { user: userId, date: { $gte: startOfLastMonth, $lt: startOfMonth } } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        Expense.aggregate([
          { $match: { user: userId, date: { $gte: startOfMonth, $lt: startOfNextMonth } } },
          { $group: { _id: '$category', total: { $sum: '$amount' } } },
          { $sort: { total: -1 } },
        ]),
        Expense.find({ user: userId }).sort({ date: -1 }).limit(5),
        Income.find({ user: userId }).sort({ date: -1 }).limit(5),
        Expense.aggregate([
          { $match: { user: userId, date: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) } } },
          {
            $group: {
              _id: { month: { $month: '$date' }, year: { $year: '$date' } },
              total: { $sum: '$amount' },
            },
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } },
        ]),
      ]);

    const totalIncome = totalIncomeAgg[0]?.total || 0;
    const totalExpense = totalExpenseAgg[0]?.total || 0;
    const monthIncome = monthIncomeAgg[0]?.total || 0;
    const monthExpense = monthExpenseAgg[0]?.total || 0;
    const lastMonthExpense = lastMonthExpenseAgg[0]?.total || 0;

    // --- AI-style insights (rule-based heuristics, computed from real aggregated data) ---
    const insights = [];
    const topCategory = byCategory[0];
    if (topCategory) {
      insights.push(`Your highest spending category this month is ${topCategory._id} at ${topCategory.total.toFixed(2)}.`);
    }
    if (lastMonthExpense > 0) {
      const change = ((monthExpense - lastMonthExpense) / lastMonthExpense) * 100;
      if (Math.abs(change) >= 1) {
        insights.push(
          `You have spent ${Math.abs(change).toFixed(1)}% ${change >= 0 ? 'more' : 'less'} this month compared to last month.`
        );
      }
    }
    const savingsRate = monthIncome > 0 ? ((monthIncome - monthExpense) / monthIncome) * 100 : 0;
    if (monthIncome > 0) {
      insights.push(
        savingsRate >= 20
          ? `Great job! You're saving ${savingsRate.toFixed(1)}% of your income this month.`
          : `You're saving ${savingsRate.toFixed(1)}% of your income this month. Consider reviewing discretionary categories to boost savings.`
      );
    }
    const projectedMonthEnd = (monthExpense / now.getDate()) * new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    insights.push(`At your current pace, projected total spending for this month is approximately ${projectedMonthEnd.toFixed(2)}.`);

    res.status(200).json({
      success: true,
      balance: totalIncome - totalExpense,
      totalIncome,
      totalExpense,
      monthlySummary: { income: monthIncome, expense: monthExpense, savings: monthIncome - monthExpense },
      expenseByCategory: byCategory.map((c) => ({ category: c._id, total: c.total })),
      recentTransactions: {
        expenses: recentExpenses,
        incomes: recentIncomes,
      },
      monthlyTrend: monthlyTrend.map((m) => ({ month: m._id.month, year: m._id.year, total: m.total })),
      insights,
    });
  } catch (error) {
    next(error);
  }
};
