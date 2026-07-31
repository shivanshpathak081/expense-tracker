import express from 'express';
import {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getExpenses)
  .post(upload.single('receipt'), createExpense);

router.route('/:id')
  .get(getExpenseById)
  .put(upload.single('receipt'), updateExpense)
  .delete(deleteExpense);

export default router;
