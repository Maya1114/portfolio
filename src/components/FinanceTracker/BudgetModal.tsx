import React, { useState, useEffect } from 'react';
import { Budget, Category } from './types';

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (budget: Budget) => Promise<void>;
  categories: Category[];
  budget?: Budget;
  selectedCategoryId?: number;
}

const BudgetModal: React.FC<BudgetModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  budget,
  selectedCategoryId
}) => {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (budget) {
      setAmount(budget.amount.toString());
      setCategoryId(budget.category_id.toString());
    } else if (selectedCategoryId) {
      setAmount('');
      setCategoryId(selectedCategoryId.toString());
    } else {
      setAmount('');
      setCategoryId(categories[0]?.id.toString() || '');
    }
  }, [budget, selectedCategoryId, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const budgetData: Budget = {
        id: budget?.id || 0,
        amount: parseFloat(amount),
        category_id: parseInt(categoryId)
      };

      await onSubmit(budgetData);
      onClose();
    } catch (error) {
      setError('Failed to save budget. Please try again.');
      console.error('Budget save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Edit Budget</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
              disabled={!!selectedCategoryId}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="amount">Monthly Budget Amount</label>
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

export default BudgetModal; 