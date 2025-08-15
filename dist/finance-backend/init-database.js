const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create database file in the same directory
const dbPath = path.join(__dirname, 'finance.db');
const db = new sqlite3.Database(dbPath);

console.log('Initializing Finance Tracker Database...');

// Create tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT,
    avatar_initials TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Categories table
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#6366f1',
    icon TEXT DEFAULT 'fas fa-tag',
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Transactions table
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category_id INTEGER,
    title TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    type TEXT CHECK(type IN ('income', 'expense')) NOT NULL,
    description TEXT,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (category_id) REFERENCES categories (id)
  )`);

  // Budgets table
  db.run(`CREATE TABLE IF NOT EXISTS budgets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category_id INTEGER,
    amount DECIMAL(10,2) NOT NULL,
    period TEXT CHECK(period IN ('monthly', 'weekly', 'yearly')) DEFAULT 'monthly',
    start_date DATE NOT NULL,
    end_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (category_id) REFERENCES categories (id)
  )`);

  // Settings table
  db.run(`CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    currency TEXT DEFAULT 'USD',
    theme TEXT DEFAULT 'dark',
    notifications_enabled BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  console.log('Tables created successfully!');

  // Insert default categories
  const defaultCategories = [
    { name: 'Food & Dining', color: '#ef4444', icon: 'fas fa-utensils' },
    { name: 'Shopping', color: '#f59e0b', icon: 'fas fa-shopping-bag' },
    { name: 'Travel', color: '#06b6d4', icon: 'fas fa-plane' },
    { name: 'Health', color: '#10b981', icon: 'fas fa-heartbeat' },
    { name: 'Entertainment', color: '#8b5cf6', icon: 'fas fa-film' },
    { name: 'Transportation', color: '#6366f1', icon: 'fas fa-car' },
    { name: 'Utilities', color: '#f97316', icon: 'fas fa-bolt' },
    { name: 'Income', color: '#10b981', icon: 'fas fa-dollar-sign' }
  ];

  const insertCategory = db.prepare('INSERT OR IGNORE INTO categories (name, color, icon) VALUES (?, ?, ?)');
  
  defaultCategories.forEach(category => {
    insertCategory.run(category.name, category.color, category.icon);
  });
  
  insertCategory.finalize();
  console.log('Default categories inserted!');

  // Insert sample user (Jane Doe)
  const bcrypt = require('bcryptjs');
  const hashedPassword = bcrypt.hashSync('password123', 10);
  
  db.run(`INSERT OR IGNORE INTO users (username, email, password_hash, full_name, avatar_initials) 
          VALUES (?, ?, ?, ?, ?)`, 
          ['janedoe', 'jane.doe@email.com', hashedPassword, 'Jane Doe', 'JD']);

  // Insert sample transactions for Jane Doe
  const sampleTransactions = [
    { title: 'Starbucks Coffee', amount: 6.75, type: 'expense', category: 'Food & Dining', date: '2024-01-15 08:30:00' },
    { title: 'Amazon Purchase', amount: 45.20, type: 'expense', category: 'Shopping', date: '2024-01-14 15:20:00' },
    { title: 'Metro Train', amount: 12.50, type: 'expense', category: 'Transportation', date: '2024-01-14 09:15:00' },
    { title: 'Salary Deposit', amount: 3200.00, type: 'income', category: 'Income', date: '2024-01-01 00:00:00' },
    { title: 'Grocery Store', amount: 89.50, type: 'expense', category: 'Food & Dining', date: '2024-01-13 16:45:00' },
    { title: 'Gas Station', amount: 65.00, type: 'expense', category: 'Transportation', date: '2024-01-12 14:30:00' },
    { title: 'Netflix Subscription', amount: 15.99, type: 'expense', category: 'Entertainment', date: '2024-01-10 00:00:00' }
  ];

  // Get user ID and category IDs
  db.get('SELECT id FROM users WHERE username = ?', ['janedoe'], (err, user) => {
    if (user) {
      const userId = user.id;
      
      // Insert transactions with proper category mapping
      sampleTransactions.forEach(transaction => {
        db.get('SELECT id FROM categories WHERE name = ?', [transaction.category], (err, category) => {
          if (category) {
            db.run(`INSERT INTO transactions (user_id, category_id, title, amount, type, date) 
                    VALUES (?, ?, ?, ?, ?, ?)`,
                    [userId, category.id, transaction.title, transaction.amount, transaction.type, transaction.date]);
          }
        });
      });
    }
  });

  // Insert sample budget
  db.get('SELECT id FROM users WHERE username = ?', ['janedoe'], (err, user) => {
    if (user) {
      db.run(`INSERT OR IGNORE INTO budgets (user_id, amount, period, start_date, end_date) 
              VALUES (?, ?, ?, ?, ?)`,
              [user.id, 4000.00, 'monthly', '2024-01-01', '2024-01-31']);
    }
  });

  // Insert user settings
  db.get('SELECT id FROM users WHERE username = ?', ['janedoe'], (err, user) => {
    if (user) {
      db.run(`INSERT OR IGNORE INTO settings (user_id, currency, theme, notifications_enabled) 
              VALUES (?, ?, ?, ?)`,
              [user.id, 'USD', 'dark', 1]);
    }
  });

  console.log('Sample data inserted successfully!');
});

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database initialization completed successfully!');
    console.log('Database file created at:', dbPath);
  }
}); 