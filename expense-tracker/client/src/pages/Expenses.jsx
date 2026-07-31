import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  fetchExpenses, addExpense, editExpense, removeExpense, clearBudgetAlert,
} from '../redux/slices/expenseSlice.js';
import ExpenseTable from '../components/ExpenseTable.jsx';
import SearchBar from '../components/Common/SearchBar.jsx';
import Pagination from '../components/Common/Pagination.jsx';
import Modal from '../components/Common/Modal.jsx';
import Button from '../components/Common/Button.jsx';
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '../utils/constants.js';

// Expense management page: list, search, filter, paginate, add/edit/delete with receipt upload.
const Expenses = () => {
  const dispatch = useDispatch();
  const { items, page, pages, loading, lastBudgetAlert } = useSelector((state) => state.expenses);
  const { user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const load = useCallback(() => {
    dispatch(fetchExpenses({ search, category, page: currentPage, limit: 10 }));
  }, [dispatch, search, category, currentPage]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (lastBudgetAlert) {
      toast.warning(
        `Budget alert: ${lastBudgetAlert.category} is at ${lastBudgetAlert.percentUsed}% of its limit${
          lastBudgetAlert.exceeded ? ' (exceeded!)' : ''
        }`
      );
      dispatch(clearBudgetAlert());
    }
  }, [lastBudgetAlert, dispatch]);

  const openAddModal = () => {
    setEditingExpense(null);
    reset({ title: '', amount: '', category: 'Food', date: new Date().toISOString().slice(0, 10), paymentMethod: 'Cash', notes: '' });
    setModalOpen(true);
  };

  const openEditModal = (expense) => {
    setEditingExpense(expense);
    reset({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date?.slice(0, 10),
      paymentMethod: expense.paymentMethod,
      notes: expense.notes,
    });
    setModalOpen(true);
  };

  const onSubmit = async (formValues) => {
    const formData = new FormData();
    Object.entries(formValues).forEach(([key, value]) => {
      if (key === 'receipt' && value?.[0]) {
        formData.append('receipt', value[0]);
      } else if (key !== 'receipt') {
        formData.append(key, value);
      }
    });

    const action = editingExpense
      ? editExpense({ id: editingExpense._id, formData })
      : addExpense(formData);

    const result = await dispatch(action);
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(editingExpense ? 'Expense updated' : 'Expense added');
      setModalOpen(false);
      load();
    } else {
      toast.error(result.payload || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    const result = await dispatch(removeExpense(id));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Expense deleted');
    } else {
      toast.error(result.payload || 'Delete failed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Expenses</h1>
        <Button onClick={openAddModal}>
          <Plus size={16} /> Add Expense
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar onSearch={(v) => { setSearch(v); setCurrentPage(1); }} placeholder="Search expenses..." />
        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setCurrentPage(1); }}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          <option value="">All Categories</option>
          {EXPENSE_CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <ExpenseTable expenses={items} currency={user?.currency} onEdit={openEditModal} onDelete={handleDelete} loading={loading} />
      <Pagination page={page} pages={pages} onPageChange={setCurrentPage} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingExpense ? 'Edit Expense' : 'Add Expense'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input {...register('title', { required: 'Title is required' })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
              <input type="number" step="0.01" {...register('amount', { required: 'Required', min: { value: 0.01, message: 'Must be positive' } })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
              {errors.amount && <p className="mt-1 text-xs text-red-500">{errors.amount.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
              <input type="date" {...register('date', { required: 'Required' })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
              <select {...register('category', { required: true })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method</label>
              <select {...register('paymentMethod')} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white">
                {PAYMENT_METHODS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
            <textarea {...register('notes')} rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Receipt (optional)</label>
            <input type="file" accept="image/*,application/pdf" {...register('receipt')} className="w-full text-sm text-gray-600 dark:text-gray-300" />
          </div>
          <Button type="submit" className="w-full">{editingExpense ? 'Update Expense' : 'Add Expense'}</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Expenses;
