import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Plus } from 'lucide-react';
import { toast } from 'react-toastify';
import { fetchIncomes, addIncome, editIncome, removeIncome } from '../redux/slices/incomeSlice.js';
import IncomeTable from '../components/IncomeTable.jsx';
import SearchBar from '../components/Common/SearchBar.jsx';
import Pagination from '../components/Common/Pagination.jsx';
import Modal from '../components/Common/Modal.jsx';
import Button from '../components/Common/Button.jsx';
import { INCOME_CATEGORIES } from '../utils/constants.js';

// Income management page: list, search, paginate, add/edit/delete income entries.
const Income = () => {
  const dispatch = useDispatch();
  const { items, page, pages, loading } = useSelector((state) => state.incomes);
  const { user } = useSelector((state) => state.auth);

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const load = useCallback(() => {
    dispatch(fetchIncomes({ search, page: currentPage, limit: 10 }));
  }, [dispatch, search, currentPage]);

  useEffect(() => {
    load();
  }, [load]);

  const openAddModal = () => {
    setEditingIncome(null);
    reset({ source: '', amount: '', category: 'Salary', date: new Date().toISOString().slice(0, 10), notes: '' });
    setModalOpen(true);
  };

  const openEditModal = (income) => {
    setEditingIncome(income);
    reset({ source: income.source, amount: income.amount, category: income.category, date: income.date?.slice(0, 10), notes: income.notes });
    setModalOpen(true);
  };

  const onSubmit = async (payload) => {
    const action = editingIncome ? editIncome({ id: editingIncome._id, payload }) : addIncome(payload);
    const result = await dispatch(action);
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(editingIncome ? 'Income updated' : 'Income added');
      setModalOpen(false);
      load();
    } else {
      toast.error(result.payload || 'Something went wrong');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this income entry?')) return;
    const result = await dispatch(removeIncome(id));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Income entry deleted');
    } else {
      toast.error(result.payload || 'Delete failed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Income</h1>
        <Button onClick={openAddModal}>
          <Plus size={16} /> Add Income
        </Button>
      </div>

      <SearchBar onSearch={(v) => { setSearch(v); setCurrentPage(1); }} placeholder="Search income..." />

      <IncomeTable incomes={items} currency={user?.currency} onEdit={openEditModal} onDelete={handleDelete} loading={loading} />
      <Pagination page={page} pages={pages} onPageChange={setCurrentPage} />

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingIncome ? 'Edit Income' : 'Add Income'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Source</label>
            <input {...register('source', { required: 'Source is required' })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
            {errors.source && <p className="mt-1 text-xs text-red-500">{errors.source.message}</p>}
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
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select {...register('category', { required: true })} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white">
              {INCOME_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
            <textarea {...register('notes')} rows={2} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white" />
          </div>
          <Button type="submit" className="w-full">{editingIncome ? 'Update Income' : 'Add Income'}</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Income;
