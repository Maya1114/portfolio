import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';
import TransactionModal from './TransactionModal';
import BudgetModal from './BudgetModal';
import { Transaction, Category, Budget, User } from './types';
import './FinanceTracker.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const FinanceTracker: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Modal states
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | undefined>(undefined);
  const [selectedBudget, setSelectedBudget] = useState<Budget | undefined>(undefined);
  const [transactionMode, setTransactionMode] = useState<'add' | 'edit'>('add');

  // API base URL
  const API_BASE_URL = 'http://localhost:3001';

  // Authentication token handling
  const getToken = () => localStorage.getItem('token');
  const setToken = (token: string) => localStorage.setItem('token', token);
  const clearToken = () => localStorage.removeItem('token');

  // API call helper
  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = getToken();
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Call Error:', error);
      throw error;
    }
  };

  // Login function
  const handleLogin = async (username: string, password: string) => {
    try {
      const data = await apiCall('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      });
      setToken(data.token);
      setUser({ id: data.user.id, username: data.user.username });
      await fetchData();
    } catch (error) {
      setError('Login failed. Please check your credentials.');
      throw error;
    }
  };

  // Fetch all data
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [transactionsData, categoriesData, budgetsData] = await Promise.all([
        apiCall('/api/transactions'),
        apiCall('/api/categories'),
        apiCall('/api/budgets'),
      ]);

      setTransactions(transactionsData);
      setCategories(categoriesData);
      setBudgets(budgetsData);
      setError(null);
    } catch (error) {
      setError('Failed to load data. Please try again.');
      console.error('Data fetching error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Transaction handlers
  const handleAddTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      const newTransaction = await apiCall('/api/transactions', {
        method: 'POST',
        body: JSON.stringify(transaction),
      });
      setTransactions(prev => [...prev, newTransaction]);
    } catch (error) {
      throw error;
    }
  };

  const handleEditTransaction = async (transaction: Transaction) => {
    try {
      const updatedTransaction = await apiCall(`/api/transactions/${transaction.id}`, {
        method: 'PUT',
        body: JSON.stringify(transaction),
      });
      setTransactions(prev =>
        prev.map(t => t.id === transaction.id ? updatedTransaction : t)
      );
    } catch (error) {
      throw error;
    }
  };

  const handleTransactionSubmit = async (transaction: Omit<Transaction, 'id'> | Transaction) => {
    if ('id' in transaction) {
      await handleEditTransaction(transaction);
    } else {
      await handleAddTransaction(transaction);
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    try {
      await apiCall(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      throw error;
    }
  };

  // Budget handlers
  const handleEditBudget = async (budget: Budget) => {
    try {
      const updatedBudget = await apiCall(`/api/budgets/${budget.id}`, {
        method: budget.id ? 'PUT' : 'POST',
        body: JSON.stringify(budget),
      });
      setBudgets(prev =>
        budget.id
          ? prev.map(b => b.id === budget.id ? updatedBudget : b)
          : [...prev, updatedBudget]
      );
    } catch (error) {
      throw error;
    }
  };

  // Initial data fetch
  useEffect(() => {
    const token = getToken();
    if (token) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    if (!user) return;

    const intervalId = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(intervalId);
  }, [user]);

  if (!user) {
    return <LoginForm onLogin={handleLogin} error={error} />;
  }

  if (isLoading) {
    return (
      <div className="finance-tracker">
        <div className="main-content">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="finance-tracker">
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <i className="fas fa-wallet"></i>
            <span>FinanceHub</span>
          </div>
          <button className="toggle-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
            <i className={`fas fa-${sidebarCollapsed ? 'chevron-right' : 'chevron-left'}`}></i>
          </button>
        </div>

        <div className="profile-section">
          <div className="profile-avatar">
            {user.username[0].toUpperCase()}
          </div>
          <div className="profile-name">{user.username}</div>
          <div className="profile-email">user@example.com</div>
        </div>

        <ul className="nav-menu">
          <li className="nav-item">
            <a className="nav-link active">
              <i className="fas fa-chart-pie"></i>
              <span>Dashboard</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link">
              <i className="fas fa-exchange-alt"></i>
              <span>Transactions</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link">
              <i className="fas fa-wallet"></i>
              <span>Budgets</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link">
              <i className="fas fa-chart-line"></i>
              <span>Analytics</span>
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link">
              <i className="fas fa-cog"></i>
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <Dashboard
          transactions={transactions}
          categories={categories}
          budgets={budgets}
          onAddTransaction={handleAddTransaction}
          onEditTransaction={handleEditTransaction}
          onDeleteTransaction={handleDeleteTransaction}
          onEditBudget={handleEditBudget}
        />

        {showTransactionModal && (
          <TransactionModal
            isOpen={showTransactionModal}
            mode={transactionMode}
            transaction={selectedTransaction}
            categories={categories}
            onSubmit={handleTransactionSubmit}
            onClose={() => {
              setShowTransactionModal(false);
              setSelectedTransaction(undefined);
            }}
          />
        )}

        {showBudgetModal && (
          <BudgetModal
            isOpen={showBudgetModal}
            budget={selectedBudget}
            categories={categories}
            onSubmit={handleEditBudget}
            onClose={() => {
              setShowBudgetModal(false);
              setSelectedBudget(undefined);
            }}
          />
        )}
      </main>
    </div>
  );
};

export default FinanceTracker; 