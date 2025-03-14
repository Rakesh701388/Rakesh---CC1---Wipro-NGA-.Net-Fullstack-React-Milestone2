
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FriendService from "../services/FriendService";
import ExpenseService from "../services/ExpenseService";
import CalculationService from "../services/CalculationService";
import "./Dashboard.css";

const Dashboard = () => {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [friendCount, setFriendCount] = useState(0);
  const [expenseCount, setExpenseCount] = useState(0);
  const [unsettledCount, setUnsettledCount] = useState(0);

  useEffect(() => {
    // Load dashboard data
    const loadDashboardData = () => {
      const friends = FriendService.getAllFriends();
      const expenses = ExpenseService.getAllExpenses();
      const total = CalculationService.calculateTotalExpenses();
      const settlements = CalculationService.calculateSettlements();

      setTotalExpenses(total);
      setFriendCount(friends.length);
      setExpenseCount(expenses.length);
      setUnsettledCount(settlements.length);
    };

    loadDashboardData();
  }, []);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Expense Splitter</h1>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">{totalExpenses.toFixed(2)}</div>
          <div className="stat-label">Total Expenses</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👫</div>
          <div className="stat-value">{friendCount}</div>
          <div className="stat-label">Friends</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-value">{expenseCount}</div>
          <div className="stat-label">Expenses</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚖️</div>
          <div className="stat-value">{unsettledCount}</div>
          <div className="stat-label">Unsettled Balances</div>
        </div>
      </div>

      <div className="navigation-container">
        <Link to="/friends" className="nav-card">
          <div className="nav-icon">👫</div>
          <div className="nav-title">Manage Friends</div>
          <div className="nav-description">Add, edit, or remove friends</div>
        </Link>

        <Link to="/expenses" className="nav-card">
          <div className="nav-icon">💰</div>
          <div className="nav-title">Manage Expenses</div>
          <div className="nav-description">Add, edit, or remove expenses</div>
        </Link>

        <Link to="/summary" className="nav-card">
          <div className="nav-icon">📊</div>
          <div className="nav-title">View Summary</div>
          <div className="nav-description">See balances and settlements</div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
