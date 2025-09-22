import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  // Users
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');

  // Categories
  const [categories, setCategories] = useState([]);

  // Expenses
  const [expenses, setExpenses] = useState([]);

  // New expense form
  const [newExpense, setNewExpense] = useState({
    category: '',
    expenditure_amount: '',
    expenditure_date: ''
  });

  // Fetch users
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/users/')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch categories
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/categories/')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);

  // Fetch expenses when selectedUser changes
  useEffect(() => {
    if (!selectedUser) return;

    axios.get(`http://127.0.0.1:8000/api/expenses/?user_id=${selectedUser}`)
      .then(res => setExpenses(res.data))
      .catch(err => console.error(err));
  }, [selectedUser]);

  // Handle form change
  const handleChange = (e) => {
    setNewExpense({...newExpense, [e.target.name]: e.target.value});
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser) return alert("Select a user first");

    axios.post('http://127.0.0.1:8000/api/expenses/', {
      ...newExpense,
      user: selectedUser
    })
    .then(res => {
      setExpenses([res.data, ...expenses]); // Add new expense to list
      setNewExpense({ category: '', expenditure_amount: '', expenditure_date: '' }); // Reset form
    })
    .catch(err => console.error(err));
  };

  return (
    <div>
      <h1>Smart Expense Tracker</h1>

      {/* User selector */}
      <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
        <option value="">Select User</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>{user.full_name}</option>
        ))}
      </select>

      {/* New Expense Form */}
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        <select name="category" value={newExpense.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <input
          type="number"
          name="expenditure_amount"
          value={newExpense.expenditure_amount}
          placeholder="Amount"
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="expenditure_date"
          value={newExpense.expenditure_date}
          onChange={handleChange}
          required
        />
        <button type="submit">Add Expense</button>
      </form>

      {/* Expenses List */}
      <h2>Expenses</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map(exp => (
            <tr key={exp.id}>
              <td>{categories.find(c => c.id === exp.category)?.name || exp.category}</td>
              <td>{exp.expenditure_amount}</td>
              <td>{exp.expenditure_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
