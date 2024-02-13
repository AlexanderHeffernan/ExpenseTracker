import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";
import { v4 as uuidv4 } from'uuid';

function App() {
  // Preparing date related variables
  const currentDay = new Date().getDay();
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // Month names for prints to screen based on currentMonth
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Returns the month index of a date stored as a string
  const getMonthFromDate = (date) => {
    return parseInt(date.split('-')[1]) - 1;
  }

  // Dictionary look up, each year contains an array, with each element being an array of expenses for each month
  // Expense: id, name, amount, date, category
  const [expenses, setExpenses] = useState({
    2024:
    [
      [
        { id: 0, name: "Food", amount: 100.00, date: "2024-01-13" }
      ],
      [
        { id: 1, name: "Food", amount: 100.00, date: "2024-02-13" }
      ]
    ]
  });

  // Dictionary look up, each year contains array with budget for each month
  const [budget, setBudget] = useState({
    2024: [100, 200],
  })

  // Calculates total expenses for current month
  const calculateTotalExpenses = () => {
    return expenses[currentYear][currentMonth].reduce((total, expense) => {
      return total + (getMonthFromDate(expense.date) === currentMonth ? expense.amount : 0);
    }, 0);
  }

  // Is user adding an expense
  const [addingExpense, setAddingExpense] = useState(false);

  // Toggle whether or not a user is adding an expense
  const handleAddExpensePress = () => {
    setAddingExpense(!addingExpense);
  }

  // Variables for users input of new expenses
  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  // Adds inputed expense to array
  const handleAddExpense = () => {
    // Validate input
    if (expenseName.trim() === '' || isNaN(expenseAmount)) {
      alert('Please enter a valid expense name and amount.');
      return;
    }
    
    // Create a new expense object
    const newExpense = {
      id: uuidv4(),
      name: expenseName,
      amount: parseFloat(expenseAmount),
      date: new Date().toISOString().split('T')[0]
    };

    // Update the expenses array for the current year and month
    setExpenses(prevExpenses => {
      const updatedExpenses = { ...prevExpenses };
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();

      if (!updatedExpenses[currentYear]) {
        updatedExpenses[currentYear] = {};
      }

      if (!updatedExpenses[currentYear][currentMonth]) {
        updatedExpenses[currentYear][currentMonth] = [];
      }

      // Add the new expense to the existing array
      updatedExpenses[currentYear][currentMonth].push(newExpense);

      return updatedExpenses;
    });

    // Clear input fields
    setExpenseName('');
    setExpenseAmount('');

    handleAddExpensePress();
  };

  return (
    <div className="App">
      {/* Top section of the app containing current months budget */}
      <header>
        <button className={`${budget[currentYear][currentMonth-1] ? '' : 'hidden'}`}><i className="fa-solid fa-chevron-left" /></button>
        <div className="CurrentMonth">
          <p>{monthNames[currentMonth]} Budget</p>
          <h1 className={`${budget[currentYear][currentMonth] - calculateTotalExpenses() < 0 ? 'negative' : 'positive'}`}>${(budget[currentYear][currentMonth] - calculateTotalExpenses()).toFixed(2)}</h1>
        </div>
        <button className={`${budget[currentYear][currentMonth+1] ? '' : 'hidden'}`}><i className="fa-solid fa-chevron-right" /></button>
      </header>

      {/* Expense list card */}
      <div className={`ExpenseList ${addingExpense ? 'unfocus' : ''}`}>
        <div className="ExpenseHeading">
          <h2>{monthNames[currentMonth]} {new Date().getFullYear()}</h2>
          <p className="negative">{calculateTotalExpenses()}</p>
        </div>

        {/* Loop through each expense for the current year and month, and display */}
        {expenses[currentYear][currentMonth].map(expense => (
          <div key={expense.id} className="Expense">
            <p className="Name">{expense.name}</p>
            <p className="Amount negative">{expense.amount}</p>
          </div>
        ))}
        
        <button onClick={handleAddExpensePress} className="AddExpenseBtn">+</button>
      </div>

      {/* Overlay card, allowing user to input new expenses */}
      <div className={`AddExpense ${addingExpense ? 'active' : ''}`}>
        <div className="ExpenseForm">
          <div className="FormHeader">
            <button onClick={handleAddExpensePress} className="Close">x</button>
            <h3>Add Expense</h3>
          </div>
          {/* Input fields for new expense */}
          <div className="InputGroup">
            <p className="dollar-sign">$</p>
            <input type="text" inputMode="numeric" pattern="\d+(\.\d{2})?" placeholder="0.00" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} />
          </div>
          <input type="text" placeholder="Expense name" value={expenseName} onChange={(e) => setExpenseName(e.target.value)} /><br />

          <button onClick={handleAddExpense} className="Submit">Add</button>
        </div>
      </div>
    </div>
  );
}

export default App;
