# Smart Expense Tracker

A simple expense tracking application built with Django REST Framework and React allowing users to track expenses, categorize them, and view monthly summary reports.

Features

Tier 1: Core Functionality
- User Management: list users.
- Category Management: list categories clike food, rent.
- Expense Management: lists and adds expenses per user.
- Monthly Summary Report: View total expenses and breakdown by category for a selected month and year.

Tier 2: Reporting (Monthly Summary)

Backend:
* Created an endpoint that accepts year, month, and user_id as query parameters.
* Returns a JSON response containing the total expenses for the user in that month and a breakdown of expenses by category.

Frontend:
* Added a Monthly Report section in React.
* Users can select the year and month and click “Get Report”.
* Fetches data from the backend using the currently selected user’s ID.
* Displays total monthly expenses and expenses broken down by category.
* Ensures that each user only sees their own data.

Tier 3: Polishing and Scaling 
Backend Validation:
* Updated Django Serializers to enforce validation rules.
* ExpenseSerializer now validates that:
    * expenditure_amount is positive.
    * expenditure_date is not in the future.
* Ensures that even if frontend validation is bypassed, the backend rejects invalid data.
thunderclient was used for all api manual testing


Setup Instructions

Backend (Django)
1. Clone the repository:
   ```bash
   git clone https://github.com/KuriGohanandKamehameha/smart-expense-tracker
   cd the_smart_expense_tracker

python -m venv .venv
source .venv/bin/activate    macOS/Linux
.\.venv\Scripts\activate     Windows
 
2. Install dependencies

pip install -r requirements.txt

3. Run database migrations

python manage.py migrate

4. Start the Django server

python manage.py runserver

5. Install frontend dependencies

cd smart-expense-frontend
npm install
npm run dev

Open the app in a browser. After both backend and front end servers are running check the frontend URL to see the app in action.

Design Choices
1. Database Schema
    * User Table: Stores user information (id, full_name). Each expense is linked to a user via a foreign key.
    * Category Table: Stores expense categories (id, name). 
    * Expense Table: Stores individual expenses with a foreign key to User and Category, along with expenditure_amount (DECIMAL for accuracy) and expenditure_date.
2. Data Types
    * expenditure_amount is DECIMAL instead of FLOAT to prevent rounding errors in financial calculations.
    * Dates are stored as DateField 
3. API Design
    * Separate endpoints for users, categories, and expenses.
    * user_id passed as a query parameter ensures expenses and reports are user-specific.
    * Monthly summary report is implemented in a single SQL query to reduce backend computation and improve performance.
4. Frontend
    * Built with React using Vite for fast development and HMR.
    * Components: User Selector, Expense Form, Expense List, Monthly Report.
    * State is managed via React hooks (useState, useEffect).
    * Axios handles API calls, and dropdowns dynamically update based on backend data.
    * 
Assumptions
1. Each expense belongs to exactly one category.
2. Users are identified uniquely by user_id in requests; no authentication is implemented.
3. Expenses are not recurring; each is a one-time entry.
4. Monthly reports are generated per user; users cannot see others’ data.
5. The backend and frontend are running locally on standard ports (8000 for Django, 5173 for React).

Low Complexity
1: Why did you choose a DECIMAL or NUMERIC type for the amount column instead of FLOAT? 
I chose DECIMAL because it stores exact numeric values which is critical for financial calculations. FLOAT is an approximate type which can introduce rounding errors .DECIMAL(max_digits=10, decimal_places=2) ensures amounts like 1234.56 are stored  accurately.
 
2: What is the purpose of a foreign key constraint?

A foreign key ensures reference between tables. each Expense references a User and a Category. it prevents an expense from pointing to a non-existent user or category

Medium Complexity
3: The current design requires passing a user_id with each request. What are the security drawbacks of this method, and what would be a more robust authentication system to implement? 
Passing user_id directly in requests is insecure because a malicious user could change the ID to access another user's data. A more secure system would implement authentication and authorization for example using JWT tokens or session authentication, where the backend identifies the user automatically 

Q4: What are the benefits of handling the report aggregation in the database (with SQL) versus in the backend (with Python)?

adv:* SQL is optimized for working with large datasets.
    * Reduces memory and CPU load on the backend.
    

 disadv * Fetching all expenses and aggregating in Python is slower for large datasets.
        * Increases server memory usage.
        * Harder to scale.

High Complexity Q5: If the expenses table grew to millions of records, what steps would you take to ensure the monthly summary report remains fast for all users? 
Optimize SQL queries (avoid SELECT *, only fetch necessary columns)

How would you design a "budgeting" feature where a user can set a monthly spending limit for a specific category (e.g., "$500 for Groceries")? Describe the necessary database changes and API endpoints. 

Add a new table:    class Budget(models.Model):
                      user = models.ForeignKey(User, on_delete=models.CASCADE)
                      category = models.ForeignKey(Category, on_delete=models.CASCADE)
   monthly_limit = models.DecimalField(max_digits=10, decimal_places=2)
    year = models.IntegerField()
       month = models.IntegerField()
      
    * POST /api/budgets/ → Create a new budget for a user/category/month.
    * GET /api/budgets/?user_id=7&year=2025&month=08 → Fetch current budget and usage.
    * Backend can calculate total spent per category for the month and compare against monthly limit to provide warnings.

