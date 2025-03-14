// src/services/FriendService.js

// Get all friends from local storage
const getAllFriends = () => {
  return JSON.parse(localStorage.getItem("friends")) || [];
};

// Save friends to local storage
const saveFriends = (friends) => {
  localStorage.setItem("friends", JSON.stringify(friends));
};

// Add a new friend
const addFriend = (name) => {
  if (!name.trim()) {
    throw new Error("Friend name cannot be empty");
  }

  const friends = getAllFriends();

  // Check if friend with same name already exists
  if (
    friends.some((friend) => friend.name.toLowerCase() === name.toLowerCase())
  ) {
    throw new Error("A friend with this name already exists");
  }

  const newFriend = {
    id: Date.now().toString(),
    name: name.trim(),
  };

  friends.push(newFriend);
  saveFriends(friends);
  return newFriend;
};

// Get friend by ID
const getFriendById = (id) => {
  const friends = getAllFriends();
  return friends.find((friend) => friend.id === id);
};

// Update friend
const updateFriend = (id, name) => {
  if (!name.trim()) {
    throw new Error("Friend name cannot be empty");
  }

  const friends = getAllFriends();

  // Check if another friend with the same name exists
  if (
    friends.some(
      (friend) =>
        friend.id !== id && friend.name.toLowerCase() === name.toLowerCase()
    )
  ) {
    throw new Error("Another friend with this name already exists");
  }

  const friendIndex = friends.findIndex((friend) => friend.id === id);
  if (friendIndex === -1) {
    throw new Error("Friend not found");
  }

  friends[friendIndex].name = name.trim();
  saveFriends(friends);
  return friends[friendIndex];
};

// Delete friend
const deleteFriend = (id) => {
  const friends = getAllFriends();
  const initialLength = friends.length;
  const updatedFriends = friends.filter((friend) => friend.id !== id);

  if (initialLength === updatedFriends.length) {
    throw new Error("Friend not found");
  }

  saveFriends(updatedFriends);
  return id;
};

const FriendService = {
  getAllFriends,
  addFriend,
  getFriendById,
  updateFriend,
  deleteFriend,
};

export default FriendService;
