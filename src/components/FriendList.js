import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FriendService from "../services/FriendService";
import ExpenseService from "../services/ExpenseService";
import "./FriendList.css";

const FriendList = () => {
  const [friends, setFriends] = useState([]);
  const [newFriendName, setNewFriendName] = useState("");
  const [editingFriend, setEditingFriend] = useState(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadFriends();
  }, []);

  const loadFriends = () => {
    const friendsList = FriendService.getAllFriends();
    setFriends(friendsList);
  };

  const handleAddFriend = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      FriendService.addFriend(newFriendName);
      setNewFriendName("");
      loadFriends();
      setSuccess("Friend added successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateFriend = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!editingFriend) return;

    try {
      FriendService.updateFriend(editingFriend.id, editName);
      setEditingFriend(null);
      setEditName("");
      loadFriends();
      setSuccess("Friend updated successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteFriend = (id) => {
    setError("");
    setSuccess("");

    if (
      window.confirm(
        "Are you sure you want to delete this friend? This will also remove them from all expenses."
      )
    ) {
      try {
        FriendService.deleteFriend(id);
        ExpenseService.handleFriendDeletion(id);
        loadFriends();
        setSuccess("Friend deleted successfully!");
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const startEditing = (friend) => {
    setEditingFriend(friend);
    setEditName(friend.name);
    setError("");
    setSuccess("");
  };

  const cancelEditing = () => {
    setEditingFriend(null);
    setEditName("");
    setError("");
  };

  return (
    <div className="friend-list-container">
      <div className="friend-list-header">
        <h2>Manage Friends</h2>
        <Link to="/dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="card">
        <h3>Add New Friend</h3>
        <form onSubmit={handleAddFriend}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Friend's name"
              value={newFriendName}
              onChange={(e) => setNewFriendName(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Friend
          </button>
        </form>
      </div>

      <div className="card">
        <h3>Friends List</h3>
        {friends.length === 0 ? (
          <p>No friends added yet. Add your first friend above!</p>
        ) : (
          <ul className="friends-list">
            {friends.map((friend) => (
              <li key={friend.id} className="friend-item">
                {editingFriend && editingFriend.id === friend.id ? (
                  <form onSubmit={handleUpdateFriend} className="edit-form">
                    <input
                      type="text"
                      className="form-control"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                    />
                    <div className="edit-actions">
                      <button type="submit" className="btn btn-success">
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={cancelEditing}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <span className="friend-name">{friend.name}</span>
                    <div className="friend-actions">
                      <button
                        className="btn btn-secondary"
                        onClick={() => startEditing(friend)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteFriend(friend.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default FriendList;
