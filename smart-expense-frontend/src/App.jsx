import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');


  const [categories, setCategories] = useState([]);


  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    category: '',
    expenditure_amount: '',
    expenditure_date: ''
  });

  const [reportYear, setReportYear] = useState('');
  const [reportMonth, setReportMonth] = useState('');
  const [monthlyReport, setMonthlyReport] = useState(null);




  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/users/')
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/categories/')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  }, []);


  useEffect(() => {
    if (!selectedUser) return;

    axios.get(`http://127.0.0.1:8000/api/expenses/?user_id=${selectedUser}`)
      .then(res => setExpenses(res.data))
      .catch(err => console.error(err));
  }, [selectedUser]);

  const handleChange = (e) => {
    setNewExpense({...newExpense, [e.target.name]: e.target.value});
  };

  const fetchMonthlyReport = () => {
  if (!selectedUser || !reportYear || !reportMonth) return;

  axios.get(`http://127.0.0.1:8000/api/reports/monthly_summary/?user_id=${selectedUser}&year=${reportYear}&month=${reportMonth}`)
    .then(res => setMonthlyReport(res.data))
    .catch(err => console.error(err));
};


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser) return alert("Select a user first");

    axios.post('http://127.0.0.1:8000/api/expenses/', {
      ...newExpense,
      user: selectedUser
    })
    .then(res => {
      setExpenses([res.data, ...expenses]);
      setNewExpense({ category: '', expenditure_amount: '', expenditure_date: '' });
    })
    .catch(err => console.error(err));
  };

  return (
    <div>
      <h1>Smart Expense Tracker</h1>


      <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
        <option value="">Select User</option>
        {users.map(user => (
          <option key={user.id} value={user.id}>{user.full_name}</option>
        ))}
      </select>


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


      <h2>Expenses</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Category</th>
            <th>Amount</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody> {expenses.map(exp => ( <tr key={exp.id}>
            <td>{categories.find(c => c.id === exp.category)?.name || exp.category}</td>
        <td>{exp.expenditure_amount}</td>
        <td>{exp.expenditure_date}</td>
        </tr> ))}
        </tbody>
      </table>

      <h2>Monthly Report</h2>
<input type="number" placeholder="Year" value={reportYear} onChange={e => setReportYear(e.target.value)} />
<input type="number" placeholder="Month" value={reportMonth} onChange={e => setReportMonth(e.target.value)} />
<button onClick={fetchMonthlyReport}>Get Report</button>

{monthlyReport && (
  <div>
    <p>Total Expenses: {monthlyReport.total_expenses}</p>
    <ul>
      {monthlyReport.expenses_by_category.map((e, idx) => (
        <li key={idx}>{e.category_name}: {e.total_amount}</li>
      ))}
    </ul>
  </div>
)}
    </div>
  );
}

export default App;
