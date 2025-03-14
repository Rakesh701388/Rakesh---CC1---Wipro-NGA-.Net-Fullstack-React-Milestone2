// src/services/CalculationService.js
import FriendService from "./FriendService";
import ExpenseService from "./ExpenseService";

// Calculate the total of all expenses
const calculateTotalExpenses = () => {
  const expenses = ExpenseService.getAllExpenses();
  return expenses.reduce((total, expense) => total + expense.amount, 0);
};

// Calculate how much each friend owes or is owed
const calculateBalances = () => {
  const expenses = ExpenseService.getAllExpenses();
  const friends = FriendService.getAllFriends();
  const balances = {};

  // Initialize balances for all friends
  friends.forEach((friend) => {
    balances[friend.id] = 0;
  });

  // Calculate balances based on expenses
  expenses.forEach((expense) => {
    const payer = expense.payerId;
    const participants = expense.participantIds;
    const amountPerPerson = expense.amount / participants.length;

    // Add the full amount to the payer (positive value means they are owed money)
    balances[payer] = (balances[payer] || 0) + expense.amount;

    // Subtract the share for each participant (negative value means they owe money)
    participants.forEach((participantId) => {
      balances[participantId] =
        (balances[participantId] || 0) - amountPerPerson;
    });
  });

  return balances;
};

// Calculate who owes whom and how much
const calculateSettlements = () => {
  const balances = calculateBalances();
  const friends = FriendService.getAllFriends();
  const settlements = [];

  // Convert balances object to array of {id, balance} objects
  const balanceArray = Object.entries(balances).map(([id, balance]) => ({
    id,
    balance: parseFloat(balance.toFixed(2)),
  }));

  // Sort by balance (ascending: negative values first, positive values last)
  balanceArray.sort((a, b) => a.balance - b.balance);

  let i = 0; // index for people who owe money (negative balance)
  let j = balanceArray.length - 1; // index for people who are owed money (positive balance)

  // Calculate settlements
  while (i < j) {
    const debtor = balanceArray[i];
    const creditor = balanceArray[j];

    // Skip if balance is zero or very close to zero
    if (Math.abs(debtor.balance) < 0.01) {
      i++;
      continue;
    }
    if (Math.abs(creditor.balance) < 0.01) {
      j--;
      continue;
    }

    // Amount to settle is the minimum of what one owes and what the other is owed
    const amount = Math.min(
      Math.abs(debtor.balance),
      Math.abs(creditor.balance)
    );

    if (amount > 0) {
      // Add settlement record
      settlements.push({
        from: debtor.id,
        to: creditor.id,
        amount: parseFloat(amount.toFixed(2)),
      });

      // Update balances
      debtor.balance += amount;
      creditor.balance -= amount;
    }

    // Move indices if balances are settled
    if (Math.abs(debtor.balance) < 0.01) {
      i++;
    }
    if (Math.abs(creditor.balance) < 0.01) {
      j--;
    }
  }

  // Map friend IDs to names in settlements
  return settlements.map((settlement) => {
    const fromFriend = friends.find((friend) => friend.id === settlement.from);
    const toFriend = friends.find((friend) => friend.id === settlement.to);

    return {
      ...settlement,
      fromName: fromFriend ? fromFriend.name : "Unknown",
      toName: toFriend ? toFriend.name : "Unknown",
    };
  });
};

// Get summary of expenses for each friend
const getFriendSummaries = () => {
  const friends = FriendService.getAllFriends();
  const balances = calculateBalances();

  return friends.map((friend) => {
    const balance = balances[friend.id] || 0;
    return {
      id: friend.id,
      name: friend.name,
      balance: parseFloat(balance.toFixed(2)),
      status: balance > 0 ? "to receive" : balance < 0 ? "to pay" : "settled",
    };
  });
};

const CalculationService = {
  calculateTotalExpenses,
  calculateBalances,
  calculateSettlements,
  getFriendSummaries,
};

export default CalculationService;
