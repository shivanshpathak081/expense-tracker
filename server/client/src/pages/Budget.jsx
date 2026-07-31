import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchBudgets, addBudget, removeBudget } from '../redux/slices/budgetSlice.js';
import Modal from '../components/Common/Modal.jsx';
import Button from '../components/Common/Button.jsx';
import Loader from '../components/Common/Loader.jsx';
import { EXPENSE_CATEGORIES, MONTH_NAMES } from '../utils/constants.js';
import { formatCurrency } from '../utils/helpers.js';

// Budget module: create per-category monthly budgets and track live progress bars.
const Budget = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.budgets);
  const { user } = useSelector((state) => state.auth);
  const [modalOpen, setModalOpen] = useState(false);

  const now = new Date();
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { month: now.getMonth() + 1, year: now.getFullYear(), alertThreshold: 80 },
  });

  useEffect(() => {
    dispatch(fetchBudgets({ month: now.getMonth() + 1, year: now.getFullYear() }));
  }, [dispatch]);

  const onSubmit = async (payload) => {
    const result = await dispatch(addBudget(payload));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Budget created');
      setModalOpen(false);
      reset();
    } else {
      toast.error(result.payload || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return;
    const result = await dispatch(removeBudget(id));
    if (result.meta.requestStatus === 'fulfilled') toast.success('Budget deleted');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Budget - {MONTH_NAMES[now.getMonth()]} {now.getFullYear()}</h1>
        <Button onClick={() => setModalOpen(true)}>
          <Plus size={16} /> Add Budget
        </Button>
      </div>

      {loading ? (
        <Loader />
      ) : items.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-500 dark:text-gray-400">No budgets set for this month yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((b) => (
            <div key={b._id} className="rounded-xl bg-white p-5 shadow-sm dark:bg-gray-800">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 dark:text-white">{b.category}</h3>
                <button onClick={() => handleDelete(b._id)} className="text-gray-400 hover:text-red-600" aria-label="Delete budget">
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatCurrency(b.spent, user?.currency)} of {formatCurrency(b.limit, user?.currency)}
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={`h-full rounded-full ${b.exceeded ? 'bg-red-500' : b.percentUsed >= b.alertThreshold ? 'bg-amber-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(b.percentUsed, 100)}%` }}
                />
              </div>
              {b.percentUsed >= b.alertThreshold && (
                <p className="mt-2 flex items-center gap-1 text-xs font-medium text-amber-600">
                  <AlertTriangle size={14} /> {b.exceeded ? 'Budget exceeded!' : `${b.percentUsed}% used`}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Add Budget">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select {...register('category', { required: true })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white">
              {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Monthly Limit</label>
            <input type="number" step="0.01" {...register('limit', { required: 'Required', min: { value: 0.01, message: 'Must be positive' } })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            {errors.limit && <p className="mt-1 text-xs text-red-500">{errors.limit.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input type="hidden" {...register('month')} />
            <input type="hidden" {...register('year')} />
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Alert Threshold (%)</label>
              <input type="number" {...register('alertThreshold')} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            </div>
          </div>
          <Button type="submit" className="w-full">Add Budget</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Budget;
