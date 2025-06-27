import React, { useState, useEffect } from 'react';
import { Transaction, Category, Budget } from './types';
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
import { Line, Doughnut } from 'react-chartjs-2';
import TransactionModal from './TransactionModal';
import BudgetModal from './BudgetModal';

interface DashboardProps {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  onEditTransaction: (transaction: Transaction) => Promise<void>;
  onDeleteTransaction: (id: number) => Promise<void>;
  onEditBudget: (budget: Budget) => Promise<void>;
}

const Dashboard: React.FC<DashboardProps> = ({
  transactions,
  categories,
  budgets,
  onAddTransaction,
  onEditTransaction,
  onDeleteTransaction,
  onEditBudget,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);

  // Calculate total income and expenses
  const totalIncome = transactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  // Calculate budget progress
  const calculateBudgetProgress = (budget: Budget) => {
    const categoryExpenses = transactions
      .filter(t => t.category_id === budget.category_id && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return (categoryExpenses / budget.amount) * 100;
  };

  // Prepare chart data
  const processTransactionData = () => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const currentDate = new Date();
    const lastYear = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
    
    const monthlyData = Array(12).fill(0).map(() => ({
      income: 0,
      expenses: 0
    }));

    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      if (transactionDate >= lastYear) {
        const monthIndex = transactionDate.getMonth();
        if (transaction.amount > 0) {
          monthlyData[monthIndex].income += transaction.amount;
        } else {
          monthlyData[monthIndex].expenses += Math.abs(transaction.amount);
        }
      }
    });

    return {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: monthlyData.map(data => data.income),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
        },
        {
          label: 'Expenses',
          data: monthlyData.map(data => data.expenses),
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.1)',
          tension: 0.4,
        },
      ],
    };
  };

  const chartData = processTransactionData();

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#e5e7eb',
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#e5e7eb',
          callback: function(this: any, tickValue: number | string) {
            const value = typeof tickValue === 'string' ? parseFloat(tickValue) : tickValue;
            return `$${value.toFixed(2)}`;
          },
        },
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#e5e7eb',
        },
      },
    },
  } as const;

  return (
    <>
      <div className="main-header">
        <h1 className="main-title">Financial Dashboard</h1>
        <p className="main-subtitle">Track your spending and savings</p>
      </div>

      <div className="dashboard-grid">
        {/* Balance Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <div className="card-icon" style={{ background: 'rgba(99, 102, 241, 0.2)' }}>
                <i className="fas fa-wallet"></i>
              </div>
              <span>Current Balance</span>
            </div>
          </div>
          <div className="card-content">
            <h2 className="balance-amount">${balance.toFixed(2)}</h2>
            <div className="quick-actions">
              <button className="action-btn" onClick={() => setShowAddModal(true)}>
                <i className="fas fa-plus"></i>
                <span>Add Transaction</span>
              </button>
              <button className="action-btn secondary" onClick={() => setShowBudgetModal(true)}>
                <i className="fas fa-chart-pie"></i>
                <span>Manage Budget</span>
              </button>
            </div>
          </div>
        </div>

        {/* Income Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <div className="card-icon" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
                <i className="fas fa-arrow-up"></i>
              </div>
              <span>Total Income</span>
            </div>
          </div>
          <div className="card-content">
            <h2 className="income-amount">${totalIncome.toFixed(2)}</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">+12%</div>
                <div className="stat-label">vs last month</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">85%</div>
                <div className="stat-label">goal progress</div>
              </div>
            </div>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <div className="card-icon" style={{ background: 'rgba(239, 68, 68, 0.2)' }}>
                <i className="fas fa-arrow-down"></i>
              </div>
              <span>Total Expenses</span>
            </div>
          </div>
          <div className="card-content">
            <h2 className="expense-amount">${totalExpenses.toFixed(2)}</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">-8%</div>
                <div className="stat-label">vs last month</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">65%</div>
                <div className="stat-label">of budget</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <div className="card-icon" style={{ background: 'rgba(99, 102, 241, 0.2)' }}>
                <i className="fas fa-exchange-alt"></i>
              </div>
              <span>Recent Transactions</span>
            </div>
          </div>
          <div className="card-content">
            <div className="expense-list">
              {transactions.slice(0, 5).map(transaction => (
                <div key={transaction.id} className="expense-item">
                  <div className="expense-info">
                    <div className="expense-category">
                      {categories.find(c => c.id === transaction.category_id)?.name || 'Uncategorized'}
                    </div>
                    <div className="expense-details">
                      <div className="expense-title">{transaction.description}</div>
                      <div className="expense-date">{new Date(transaction.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className={`expense-amount ${transaction.amount > 0 ? 'positive' : ''}`}>
                    {transaction.amount > 0 ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Spending Chart */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <div className="card-icon" style={{ background: 'rgba(99, 102, 241, 0.2)' }}>
                <i className="fas fa-chart-line"></i>
              </div>
              <span>Spending Overview</span>
            </div>
          </div>
          <div className="card-content">
            <div className="chart-container">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">
              <div className="card-icon" style={{ background: 'rgba(99, 102, 241, 0.2)' }}>
                <i className="fas fa-chart-pie"></i>
              </div>
              <span>Budget Overview</span>
            </div>
          </div>
          <div className="card-content">
            <div className="chart-container">
              <Doughnut
                data={{
                  labels: budgets.map(b => categories.find(c => c.id === b.category_id)?.name || 'Uncategorized'),
                  datasets: [{
                    data: budgets.map(b => b.amount),
                    backgroundColor: [
                      'rgba(99, 102, 241, 0.8)',
                      'rgba(16, 185, 129, 0.8)',
                      'rgba(239, 68, 68, 0.8)',
                      'rgba(245, 158, 11, 0.8)',
                    ],
                    borderWidth: 0,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'bottom' as const,
                      labels: {
                        color: '#e5e7eb',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Modals */}
      {showAddModal && (
        <TransactionModal
          isOpen={showAddModal}
          mode="add"
          categories={categories}
          onClose={() => setShowAddModal(false)}
          onSubmit={async (transaction) => {
            await onAddTransaction(transaction as Omit<Transaction, 'id'>);
            setShowAddModal(false);
          }}
        />
      )}

      {showEditModal && selectedTransaction && (
        <TransactionModal
          isOpen={showEditModal}
          mode="edit"
          categories={categories}
          transaction={selectedTransaction}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTransaction(null);
          }}
          onSubmit={async (transaction) => {
            await onEditTransaction(transaction as Transaction);
            setShowEditModal(false);
            setSelectedTransaction(null);
          }}
        />
      )}

      {/* Budget Modal */}
      {showBudgetModal && (
        <BudgetModal
          isOpen={showBudgetModal}
          categories={categories}
          budget={selectedBudget || undefined}
          onClose={() => {
            setShowBudgetModal(false);
            setSelectedBudget(null);
          }}
          onSubmit={async (budget: Budget) => {
            await onEditBudget(budget);
            setShowBudgetModal(false);
            setSelectedBudget(null);
          }}
        />
      )}
    </>
  );
};

export default Dashboard; 