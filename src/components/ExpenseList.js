import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FriendService from "../services/FriendService";
import ExpenseService from "../services/ExpenseService";
import "./ExpenseList.css";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [friends, setFriends] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [payerId, setPayerId] = useState("");
  const [participantIds, setParticipantIds] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadExpenses();
    loadFriends();
  }, []);

  const loadExpenses = () => {
    const expenseList = ExpenseService.getAllExpenses();
    setExpenses(expenseList);
  };

  const loadFriends = () => {
    const friendsList = FriendService.getAllFriends();
    setFriends(friendsList);
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      ExpenseService.addExpense(
        description,
        amount,
        payerId,
        participantIds,
        date
      );
      setDescription("");
      setAmount("");
      setPayerId("");
      setParticipantIds([]);
      setDate(new Date().toISOString().split("T")[0]);
      loadExpenses();
      setSuccess("Expense added successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateExpense = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!editingExpense) return;

    try {
      ExpenseService.updateExpense(
        editingExpense.id,
        description,
        amount,
        payerId,
        participantIds,
        date
      );
      setEditingExpense(null);
      setDescription("");
      setAmount("");
      setPayerId("");
      setParticipantIds([]);
      setDate(new Date().toISOString().split("T")[0]);
      loadExpenses();
      setSuccess("Expense updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteExpense = (id) => {
    setError("");
    setSuccess("");

    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        ExpenseService.deleteExpense(id);
        loadExpenses();
        setSuccess("Expense deleted successfully!");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const startEditing = (expense) => {
    setEditingExpense(expense);
    setDescription(expense.description);
    setAmount(expense.amount);
    setPayerId(expense.payerId);
    setParticipantIds(expense.participantIds);
    setDate(expense.date);
    setError("");
    setSuccess("");
  };

  const cancelEditing = () => {
    setEditingExpense(null);
    setDescription("");
    setAmount("");
    setPayerId("");
    setParticipantIds([]);
    setDate(new Date().toISOString().split("T")[0]);
    setError("");
  };

  const handleParticipantToggle = (friendId) => {
    setParticipantIds((prev) => {
      if (prev.includes(friendId)) {
        return prev.filter((id) => id !== friendId);
      } else {
        return [...prev, friendId];
      }
    });
  };

  const getFriendName = (id) => {
    const friend = friends.find((f) => f.id === id);
    return friend ? friend.name : "Unknown";
  };

  const getParticipantNames = (participantIds) => {
    return participantIds.map((id) => getFriendName(id)).join(", ");
  };

  return (
    <div className="expense-list-container">
      <div className="expense-list-header">
        <h2>Manage Expenses</h2>
        <Link to="/dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="card">
        <h3>{editingExpense ? "Edit Expense" : "Add New Expense"}</h3>
        <form
          onSubmit={editingExpense ? handleUpdateExpense : handleAddExpense}
        >
          <div className="form-group">
            <label className="form-label">Description</label>
            <input
              type="text"
              className="form-control"
              placeholder="Expense description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Amount</label>
            <input
              type="number"
              className="form-control"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Paid By</label>
            <select
              className="form-control"
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
              required
            >
              <option value="">Select who paid</option>
              {friends.map((friend) => (
                <option key={friend.id} value={friend.id}>
                  {friend.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Participants</label>
            <div className="participants-container">
              {friends.length === 0 ? (
                <p>No friends added yet. Please add friends first.</p>
              ) : (
                friends.map((friend) => (
                  <div key={friend.id} className="participant-checkbox">
                    <input
                      type="checkbox"
                      id={`participant-{friend.id}`}
                      checked={participantIds.includes(friend.id)}
                      onChange={() => handleParticipantToggle(friend.id)}
                    />
                    <label htmlFor={`participant-{friend.id}`}>
                      {friend.name}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {editingExpense ? "Update Expense" : "Add Expense"}
            </button>
            {editingExpense && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={cancelEditing}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card">
        <h3>Expenses List</h3>
        {expenses.length === 0 ? (
          <p>No expenses added yet. Add your first expense above!</p>
        ) : (
          <div className="expense-table-container">
            <table className="expense-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Paid By</th>
                  <th>Participants</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.description}</td>
                    <td>{expense.amount.toFixed(2)}</td>
                    <td>{expense.date}</td>
                    <td>{getFriendName(expense.payerId)}</td>
                    <td>{getParticipantNames(expense.participantIds)}</td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        onClick={() => startEditing(expense)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteExpense(expense.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseList;
