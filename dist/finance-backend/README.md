# Finance Tracker Backend

A Node.js/Express backend for the FinanceHub dashboard with SQLite database. This backend provides the functionality behind the finance tracker app *edited to be functional without AWS or any paid services (cus it's tough out here)

## Features

- **User Authentication** - JWT-based login/register system
- **Transaction Management** - CRUD operations for financial transactions
- **Category Management** - Custom expense/income categories
- **Budget Tracking** - Set and monitor budget goals
- **Analytics** - Spending analysis and reports
- **Settings** - User preferences and customization
- **Receipt Upload** - File upload functionality for receipts

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite** - Local database (no AWS required!)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **multer** - File uploads

## Setup Instructions

### 1. Install Dependencies

```bash
cd finance-backend
npm install
```

### 2. Initialize Database

```bash
npm run init-db
```

This will:
- Create the SQLite database file (`finance.db`)
- Set up all necessary tables
- Insert default categories
- Create a sample user (Jane Doe) with sample data

### 3. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics

### Transactions

- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create new transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction

### Categories

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category

### Budgets

- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create new budget

### Analytics

- `GET /api/analytics/spending-by-category` - Get spending by category
- `GET /api/analytics/monthly-spending` - Get monthly spending data

### Settings

- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update user settings

### File Upload

- `POST /api/upload-receipt` - Upload receipt image

## Sample User

The database initialization creates a sample user:

- **Username**: janedoe
- **Email**: jane.doe@email.com
- **Password**: password123

## Database Schema

### Users
- id, username, email, password_hash, full_name, avatar_initials, created_at, updated_at

### Categories
- id, name, color, icon, user_id, created_at

### Transactions
- id, user_id, category_id, title, amount, type, description, date, created_at

### Budgets
- id, user_id, category_id, amount, period, start_date, end_date, created_at

### Settings
- id, user_id, currency, theme, notifications_enabled, created_at, updated_at

## Frontend Integration

To connect your existing HTML frontend to this backend:

1. Update your HTML file to make API calls to `http://localhost:3001`
2. Add authentication headers to requests
3. Replace static data with dynamic API responses

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- SQL injection prevention
- CORS enabled for frontend integration

## File Structure

```
finance-backend/
├── package.json
├── server.js
├── init-database.js
├── README.md
├── finance.db (created after initialization)
└── uploads/ (created for file uploads)
```

## Environment Variables

For production, consider setting these environment variables:

- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

## Next Steps

1. **Frontend Integration**: Update your HTML to use these API endpoints
2. **Enhanced Features**: Add more analytics, export functionality
3. **Security**: Add rate limiting, input validation
4. **Deployment**: Deploy to a free service like Render or Railway

## Support

This backend provides all the functionality needed for a professional finance tracker without any AWS costs. The SQLite database is perfect for personal use and small applications. 