import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";

function App() {

  const [expenses, setExpenses] = useState([
    // {
    //   id: 0,
    //   name: "Dairy",
    //   amount: 24.00,
    //   date: "2024-02-12",
    //   category: "Food"
    // }
  ]);
  const [budget, setBudget] = useState(100);

  const calculateTotalExpenses = () => {
    let totalExpenses = 0;
    expenses.map(expense => (
      totalExpenses += expense.amount
    ));
    return (totalExpenses);
  }

  const currentMonth = new Date().getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [addingExpense, setAddingExpense] = useState(false);

  const handleAddExpensePress = () => {
    setAddingExpense(!addingExpense);
  }

  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  const handleAddExpense = () => {
    // Validate input
    if (expenseName.trim() === '' || isNaN(expenseAmount)) {
      alert('Please enter a valid expense name and amount.');
      return;
    }

    // Convert amount to a number
    const amount = parseFloat(expenseAmount);

    // Create a new expense object
    const newExpense = {
      name: expenseName,
      amount: amount
    };

    // Clear input fields
    setExpenseName('');
    setExpenseAmount('');

    // Pass the new expense to the parent component
    setExpenses([...expenses, newExpense]);
    handleAddExpensePress();
  };

  return (
    <div className="App">
      <div className="Budget">
        <p>{monthNames[currentMonth]} Budget</p>
        <h2 className={`${budget - calculateTotalExpenses() < 0 ? 'negative' : ''}`}>${(budget - calculateTotalExpenses()).toFixed(2)}</h2>
      </div>
      <div  className={`ExpenseList ${addingExpense ? 'unfocus' : ''}`}>
        <div className="ExpenseHeading">
          <h3>{monthNames[currentMonth]} {new Date().getFullYear()}</h3>
          <p>{calculateTotalExpenses()}</p>
        </div>
        {expenses.map(expense => (
          <div className="Expense">
            <p className="Name">{expense.name}</p>
            <p className="Amount">{expense.amount}</p>
          </div>
        ))}
        <button onClick={handleAddExpensePress} className="AddExpenseBtn">+</button>
      </div>
      <div className={`AddExpense ${addingExpense ? 'active' : ''}`}>
          <button onClick={handleAddExpensePress} className="Close">x</button>
          <input
            type="text"
            placeholder="Expense name"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Expense amount"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
          />
          <button onClick={handleAddExpense} className="Close">+</button>
      </div>
    </div>
  );
}

export default App;
