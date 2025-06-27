import React, { useState, useEffect } from 'react';
import { Transaction, Category } from './types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: Omit<Transaction, 'id'> | Transaction) => Promise<void>;
  categories: Category[];
  transaction?: Transaction;
  mode: 'add' | 'edit';
}

const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  transaction,
  mode
}) => {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (transaction && mode === 'edit') {
      setAmount(transaction.amount.toString());
      setDescription(transaction.description);
      setCategoryId(transaction.category_id.toString());
      setDate(transaction.date);
      setType(transaction.type);
    } else {
      // Set default values for new transaction
      setAmount('');
      setDescription('');
      setCategoryId(categories[0]?.id.toString() || '');
      setDate(new Date().toISOString().split('T')[0]);
      setType('expense');
    }
  }, [transaction, mode, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const transactionData = {
        amount: parseFloat(amount),
        description,
        category_id: parseInt(categoryId),
        date,
        type,
        ...(mode === 'edit' && transaction ? { id: transaction.id } : {})
      };

      await onSubmit(transactionData as any);
      onClose();
    } catch (error) {
      setError('Failed to save transaction. Please try again.');
      console.error('Transaction save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{mode === 'add' ? 'Add Transaction' : 'Edit Transaction'}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value as 'income' | 'expense')}
              required
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0"
              required
              placeholder="0.00"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Enter description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Cancel</button>
            <button 
              type="submit" 
              className="primary"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal; 