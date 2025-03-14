import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FriendService from "../services/FriendService";
import ExpenseService from "../services/ExpenseService";
import CalculationService from "../services/CalculationService";
import "./ExpenseSummary.css";

const ExpenseSummary = () => {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [friendSummaries, setFriendSummaries] = useState([]);
  const [settlements, setSettlements] = useState([]);

  useEffect(() => {
    loadSummaryData();
  }, []);

  const loadSummaryData = () => {
    const total = CalculationService.calculateTotalExpenses();
    const summaries = CalculationService.getFriendSummaries();
    const settlementData = CalculationService.calculateSettlements();

    setTotalExpenses(total);
    setFriendSummaries(summaries);
    setSettlements(settlementData);
  };

  return (
    <div className="expense-summary-container">
      <div className="expense-summary-header">
        <h2>Expense Summary</h2>
        <Link to="/dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>

      <div className="card">
        <h3>Total Expenses</h3>
        <div className="total-expenses">
          <span className="amount">{totalExpenses.toFixed(2)}</span>
        </div>
      </div>

      <div className="card">
        <h3>Friend Balances</h3>
        {friendSummaries.length === 0 ? (
          <p>No friends or expenses added yet.</p>
        ) : (
          <div className="balances-container">
            {friendSummaries.map((summary) => (
              <div
                key={summary.id}
                className={`balance-card ${
                  summary.balance > 0
                    ? "positive"
                    : summary.balance < 0
                    ? "negative"
                    : "neutral"
                }`}
              >
                <div className="balance-name">{summary.name}</div>
                <div className="balance-amount">
                  {Math.abs(summary.balance).toFixed(2)}
                </div>
                <div className="balance-status">
                  {summary.balance > 0 ? (
                    <span className="to-receive">To Receive</span>
                  ) : summary.balance < 0 ? (
                    <span className="to-pay">To Pay</span>
                  ) : (
                    <span className="settled">Settled</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <h3>Settlements</h3>
        {settlements.length === 0 ? (
          <p>All balances are settled or no expenses added yet.</p>
        ) : (
          <div className="settlements-container">
            <ul className="settlements-list">
              {settlements.map((settlement, index) => (
                <li key={index} className="settlement-item">
                  <span className="settlement-from">{settlement.fromName}</span>
                  <span className="settlement-arrow">→</span>
                  <span className="settlement-to">{settlement.toName}</span>
                  <span className="settlement-amount">
                    {settlement.amount.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseSummary;
