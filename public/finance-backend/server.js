const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
const dbPath = path.join(__dirname, 'finance.db');
const db = new sqlite3.Database(dbPath);

// JWT Secret (in production, use environment variable)
const JWT_SECRET = 'your-secret-key-change-in-production';

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Authentication routes
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username], (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = bcrypt.compareSync(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        avatar_initials: user.avatar_initials
      }
    });
  });
});

app.post('/api/auth/register', (req, res) => {
  const { username, email, password, full_name } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 10);
  const avatar_initials = full_name.split(' ').map(n => n[0]).join('').toUpperCase();

  db.run(
    'INSERT INTO users (username, email, password_hash, full_name, avatar_initials) VALUES (?, ?, ?, ?, ?)',
    [username, email, hashedPassword, full_name, avatar_initials],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'Username or email already exists' });
        }
        return res.status(500).json({ error: 'Database error' });
      }

      const token = jwt.sign({ id: this.lastID, username }, JWT_SECRET, { expiresIn: '24h' });
      
      res.status(201).json({
        token,
        user: {
          id: this.lastID,
          username,
          email,
          full_name,
          avatar_initials
        }
      });
    }
  );
});

// Dashboard routes
app.get('/api/dashboard/stats', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const currentDate = new Date();
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
  const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));

  const queries = {
    totalBalance: `
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as balance
      FROM transactions 
      WHERE user_id = ?
    `,
    monthlyIncome: `
      SELECT COALESCE(SUM(amount), 0) as income
      FROM transactions 
      WHERE user_id = ? AND type = 'income' AND date >= ?
    `,
    monthlyExpenses: `
      SELECT COALESCE(SUM(amount), 0) as expenses
      FROM transactions 
      WHERE user_id = ? AND type = 'expense' AND date >= ?
    `,
    weeklyExpenses: `
      SELECT COALESCE(SUM(amount), 0) as expenses
      FROM transactions 
      WHERE user_id = ? AND type = 'expense' AND date >= ?
    `,
    dailyExpenses: `
      SELECT COALESCE(SUM(amount), 0) as expenses
      FROM transactions 
      WHERE user_id = ? AND type = 'expense' AND date >= ?
    `
  };

  Promise.all([
    new Promise((resolve, reject) => {
      db.get(queries.totalBalance, [userId], (err, result) => {
        if (err) reject(err);
        else resolve(result.balance);
      });
    }),
    new Promise((resolve, reject) => {
      db.get(queries.monthlyIncome, [userId, startOfMonth.toISOString()], (err, result) => {
        if (err) reject(err);
        else resolve(result.income);
      });
    }),
    new Promise((resolve, reject) => {
      db.get(queries.monthlyExpenses, [userId, startOfMonth.toISOString()], (err, result) => {
        if (err) reject(err);
        else resolve(result.expenses);
      });
    }),
    new Promise((resolve, reject) => {
      db.get(queries.weeklyExpenses, [userId, startOfWeek.toISOString()], (err, result) => {
        if (err) reject(err);
        else resolve(result.expenses);
      });
    }),
    new Promise((resolve, reject) => {
      db.get(queries.dailyExpenses, [userId, startOfDay.toISOString()], (err, result) => {
        if (err) reject(err);
        else resolve(result.expenses);
      });
    })
  ]).then(([totalBalance, monthlyIncome, monthlyExpenses, weeklyExpenses, dailyExpenses]) => {
    res.json({
      totalBalance: parseFloat(totalBalance).toFixed(2),
      monthlyIncome: parseFloat(monthlyIncome).toFixed(2),
      monthlyExpenses: parseFloat(monthlyExpenses).toFixed(2),
      weeklyExpenses: parseFloat(weeklyExpenses).toFixed(2),
      dailyExpenses: parseFloat(dailyExpenses).toFixed(2)
    });
  }).catch(err => {
    res.status(500).json({ error: 'Database error' });
  });
});

// Transactions routes
app.get('/api/transactions', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const limit = req.query.limit || 10;
  const offset = req.query.offset || 0;

  const query = `
    SELECT t.*, c.name as category_name, c.color as category_color
    FROM transactions t
    LEFT JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ?
    ORDER BY t.date DESC
    LIMIT ? OFFSET ?
  `;

  db.all(query, [userId, limit, offset], (err, transactions) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(transactions);
  });
});

app.post('/api/transactions', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { title, amount, type, category_id, description, date } = req.body;

  db.run(
    'INSERT INTO transactions (user_id, category_id, title, amount, type, description, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [userId, category_id, title, amount, type, description, date || new Date().toISOString()],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      // Get the created transaction with category info
      db.get(
        'SELECT t.*, c.name as category_name, c.color as category_color FROM transactions t LEFT JOIN categories c ON t.category_id = c.id WHERE t.id = ?',
        [this.lastID],
        (err, transaction) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }
          res.status(201).json(transaction);
        }
      );
    }
  );
});

app.put('/api/transactions/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const transactionId = req.params.id;
  const { title, amount, type, category_id, description, date } = req.body;

  db.run(
    'UPDATE transactions SET title = ?, amount = ?, type = ?, category_id = ?, description = ?, date = ? WHERE id = ? AND user_id = ?',
    [title, amount, type, category_id, description, date, transactionId, userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Transaction not found' });
      }
      res.json({ message: 'Transaction updated successfully' });
    }
  );
});

app.delete('/api/transactions/:id', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const transactionId = req.params.id;

  db.run('DELETE FROM transactions WHERE id = ? AND user_id = ?', [transactionId, userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted successfully' });
  });
});

// Categories routes
app.get('/api/categories', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.all('SELECT * FROM categories WHERE user_id IS NULL OR user_id = ? ORDER BY name', [userId], (err, categories) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(categories);
  });
});

app.post('/api/categories', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { name, color, icon } = req.body;

  db.run(
    'INSERT INTO categories (name, color, icon, user_id) VALUES (?, ?, ?, ?)',
    [name, color, icon, userId],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ id: this.lastID, name, color, icon, user_id: userId });
    }
  );
});

// Budget routes
app.get('/api/budgets', authenticateToken, (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT b.*, c.name as category_name, c.color as category_color
    FROM budgets b
    LEFT JOIN categories c ON b.category_id = c.id
    WHERE b.user_id = ?
    ORDER BY b.start_date DESC
  `;

  db.all(query, [userId], (err, budgets) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(budgets);
  });
});

app.post('/api/budgets', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { category_id, amount, period, start_date, end_date } = req.body;

  db.run(
    'INSERT INTO budgets (user_id, category_id, amount, period, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?)',
    [userId, category_id, amount, period, start_date, end_date],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(201).json({ id: this.lastID, user_id: userId, category_id, amount, period, start_date, end_date });
    }
  );
});

// Analytics routes
app.get('/api/analytics/spending-by-category', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { start_date, end_date } = req.query;

  let dateFilter = '';
  let params = [userId];

  if (start_date && end_date) {
    dateFilter = 'AND t.date BETWEEN ? AND ?';
    params.push(start_date, end_date);
  }

  const query = `
    SELECT c.name, c.color, SUM(t.amount) as total
    FROM transactions t
    JOIN categories c ON t.category_id = c.id
    WHERE t.user_id = ? AND t.type = 'expense' ${dateFilter}
    GROUP BY c.id, c.name, c.color
    ORDER BY total DESC
  `;

  db.all(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

app.get('/api/analytics/monthly-spending', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { year } = req.query;

  const query = `
    SELECT 
      strftime('%m', t.date) as month,
      SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END) as income,
      SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END) as expenses
    FROM transactions t
    WHERE t.user_id = ? AND strftime('%Y', t.date) = ?
    GROUP BY strftime('%m', t.date)
    ORDER BY month
  `;

  db.all(query, [userId, year || new Date().getFullYear()], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(results);
  });
});

// Settings routes
app.get('/api/settings', authenticateToken, (req, res) => {
  const userId = req.user.id;

  db.get('SELECT * FROM settings WHERE user_id = ?', [userId], (err, settings) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(settings || { currency: 'USD', theme: 'dark', notifications_enabled: true });
  });
});

app.put('/api/settings', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const { currency, theme, notifications_enabled } = req.body;

  db.run(
    'INSERT OR REPLACE INTO settings (user_id, currency, theme, notifications_enabled, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)',
    [userId, currency, theme, notifications_enabled],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json({ message: 'Settings updated successfully' });
    }
  );
});

// Receipt upload route
app.post('/api/upload-receipt', authenticateToken, upload.single('receipt'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // In a real application, you would process the receipt image here
  // For now, we'll just return the file info
  res.json({
    message: 'Receipt uploaded successfully',
    filename: req.file.filename,
    originalname: req.file.originalname,
    size: req.file.size
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Finance Tracker Backend running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
}); 