"use strict";

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Selecting Elements
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const labelWelcome = document.querySelector(".welcome");
const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const btnLogin = document.querySelector(".login__btn");

const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");

const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const btnSort = document.querySelector(".btn--sort");

const inputTransferAmount = document.querySelector(".form__input--amount");
const inputTransferTo = document.querySelector(".form__input--to");
const btnTransfer = document.querySelector(".form__btn--transfer");

const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const btnLoan = document.querySelector(".form__btn--loan");

const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
const btnClose = document.querySelector(".form__btn--close");

const labelTimer = document.querySelector(".timer");

// Functions

/*
 * Function to list all the transactions for a user
 */
const displayMovements = (movements) => {
  containerMovements.innerHTML = "";

  movements.forEach((movement, i) => {
    const type = movement > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
        <div class="movement__type movement__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movement__date">3 days ago</div>
        <div class="movement__value">${movement} €</div>
    </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

displayMovements(account1.movements);

/*
 * Function to create username for each accounts
 */
const createUsernames = (accounts) => {
  accounts.forEach((account) => {
    account.username = account.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
  console.log(accounts);
};

createUsernames(accounts);

/*
 * Function to calculate the total balance for an account
 */
const calcDisplayBalance = (account) => {
  account.balance = account.movements.reduce(
    (acc, movement) => acc + movement,
    0
  );
  labelBalance.textContent = `${account.balance}€`;
  console.log(account);
};

calcDisplayBalance(account1);

/*
 * Function to calculate the transaction amount summary for an account
 */
const calcDisplaySummary = (account) => {
  const totalDeposit = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${totalDeposit}€`;

  const totalWithdrawal = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc - mov, 0);

  labelSumOut.textContent = `${totalWithdrawal}€`;

  const totalInterest = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${totalInterest}€`;
};

calcDisplaySummary(account1);
