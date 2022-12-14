"use strict";

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-07-26T17:01:17.194Z",
    "2020-07-28T23:36:17.929Z",
    "2020-08-01T10:51:36.790Z",
  ],
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
};

const accounts = [account1, account2];

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
const displayMovements = (movements, sorted = false) => {
  containerMovements.innerHTML = "";

  const moves = sorted ? movements.slice().sort((a, b) => a - b) : movements;
  btnSort.textContent = sorted ? `\u2191 SORT` : ` \u2193 SORT`;

  moves.forEach((movement, i) => {
    const type = movement > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
        <div class="movement__type movement__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movement__date">3 days ago</div>
        <div class="movement__value">${movement.toFixed(2)} €</div>
    </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

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
  labelBalance.textContent = `${account.balance.toFixed(2)}€`;
};

/*
 * Function to calculate the transaction amount summary for an account
 */
const calcDisplaySummary = (account) => {
  const totalDeposit = account.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${totalDeposit.toFixed(2)}€`;

  const totalWithdrawal = account.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc - mov, 0);

  labelSumOut.textContent = `${totalWithdrawal.toFixed(2)}€`;

  const totalInterest = account.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * account.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${totalInterest.toFixed(2)}€`;
};

let currentAccount;
let sorted = false;

const updateUI = (account) => {
  displayMovements(account.movements);

  calcDisplayBalance(account);

  calcDisplaySummary(account);
};

/*
 * LOGIN
 */
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  const user = inputLoginUsername.value;
  const pin = inputLoginPin.value;

  if (!user || !pin) {
    return false;
  }

  currentAccount = accounts.find(
    (account) => account.username === user && account.pin === +pin
  );

  // Incase of successful login
  if (currentAccount) {
    // Display the main section
    containerApp.style.opacity = 1;
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    //Clear the input fields
    inputLoginUsername.value = inputLoginPin.value = "";

    //Update UI
    updateUI(currentAccount);
  }
});

/*
 * AMOUNT TRANSFER
 */
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const transferAmt = +inputTransferAmount.value;
  const transferTo = inputTransferTo.value;

  const receiverAcc = accounts.find(
    (account) => account.username === transferTo
  );
  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    receiverAcc &&
    receiverAcc?.username !== currentAccount.username &&
    transferAmt > 0 &&
    currentAccount.balance >= transferAmt
  ) {
    //Transfer the amount
    currentAccount.movements.push(-transferAmt);
    receiverAcc.movements.push(transferAmt);

    updateUI(currentAccount);
  }
});

/*
 * ACCOUNT CLOSE
 */
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  const user = inputCloseUsername.value;
  const pin = +inputClosePin.value;

  if (user === currentAccount.username || pin === currentAccount.pin) {
    const accountIdx = accounts.findIndex(
      (account) => account.username === user && account.pin === pin
    );

    if (accountIdx >= 0) {
      //Delete Account
      accounts.splice(accountIdx, 1);

      //Hide UI
      containerApp.style.opacity = 0;

      //Revert the welcome label
      labelWelcome.textContent = "Log in to get started";
    }
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

/*
 * LOAN
 */
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const loanAmount = Math.floor(inputLoanAmount.value);

  if (
    loanAmount > 0 &&
    currentAccount.movements.some(
      (movement) => movement > (loanAmount * 10) / 100
    )
  ) {
    currentAccount.movements.push(loanAmount);

    updateUI(currentAccount);
  }

  inputLoanAmount.value = "";
});

/*
 * TRANSACTION SORT
 */
btnSort.addEventListener("click", function (e) {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
