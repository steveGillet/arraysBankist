'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayTransactions = function (transactions, sort = false) {
  containerMovements.innerHTML = ``;
  // .textContent = 0

  const trans = sort
    ? transactions.slice().sort((a, b) => a - b)
    : transactions;
  trans.forEach(function (tran, i) {
    const typeTran = tran > 0 ? `deposit` : `withdrawal`;
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${typeTran}">${
      i + 1
    } ${typeTran}</div>
        <div class="movements__value">${tran < 0 ? `-` : ``}$${Math.abs(
      tran
    )}</div>
      </div>`;
    containerMovements.insertAdjacentHTML(`afterbegin`, html);
  });
};

// Calculate and Display Balance
const calcPrintBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `$${account.balance}`;
};

const calcPrintSummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumIn.textContent = `$${incomes}`;
  const expenditures = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = `$${Math.abs(expenditures)}`;
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interestRate) / 100)
    .filter((mov, i, arr) => {
      //console.log(arr);
      return mov >= 1;
    })
    .reduce((acc, curr) => acc + curr, 0);
  labelSumInterest.textContent = `$${Math.abs(interest)}`;
};

// Computing Usernames
const user = `Steven Thomas Williams`;
const makeUsername = function (accounts) {
  accounts.forEach(function (account) {
    account.username = account.owner
      .toLowerCase()
      .split(` `)
      .map(name => name[0])
      .join(``);
  });
};
makeUsername(accounts);

let currentAccount;

const updateUI = function (account) {
  displayTransactions(account.movements);
  calcPrintBalance(account);
  calcPrintSummary(account);
};

// Log In Event Handlers
btnLogin.addEventListener(`click`, function (event) {
  //prevent form from submitting
  event.preventDefault();
  console.log(`LOGIN`);
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  // optional chaining
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    console.log(`LOGIN`);
    // display ui and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(` `)[0]
    }`;
    containerApp.style.opacity = 100;
    inputLoginUsername.value = inputLoginPin.value = ``;
    inputLoginPin.blur();
    inputLoginUsername.blur();
    // display current account amounts
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener(`click`, function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
    // add positive movement
    currentAccount.movements.push(amount);
    // update ui
    updateUI(currentAccount);
  }
  inputLoanAmount.value = ``;
});

// transfer
btnTransfer.addEventListener(`click`, function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiver = accounts.find(
    curr => curr.username === inputTransferTo.value
  );
  // console.log(amount, receiver);
  inputTransferAmount.value = inputTransferTo.value = ``;
  if (
    receiver &&
    amount > 0 &&
    amount <= currentAccount.balance &&
    receiver.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiver.movements.push(amount);
    updateUI(currentAccount);
  }
});

// close account

btnClose.addEventListener(`click`, function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    // hide ui
    containerApp.style.opacity = 0;
    labelWelcome.textContent = `Log in to get started`;
  }
  inputCloseUsername.value = inputClosePin.value = ``;
});

let sorted = false;
btnSort.addEventListener(`click`, function (e) {
  e.preventDefault();
  displayTransactions(currentAccount.movements, !sorted);
  sorted = !sorted;
});

//console.log(containerMovements.innerHTML);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// Coding Challenge #4

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1
for (const dog of dogs) {
  dog.recommendedFood = Math.round(dog.weight ** 0.75 * 28);
}
// instructor's way
dogs.forEach(dog => (dog.recFood = Math.round(dog.weight ** 0.75 * 28)));

// 2
const sarahDog = dogs[dogs.findIndex(dog => dog.owners.includes(`Sarah`))];
console.log(sarahDog);
// instructor's
const dogSarah = dogs.find(dog => dog.owners.includes(`Sarah`));

const eatingAmount = function (dog) {
  if (dog.curFood > dog.recommendedFood * 1.1) return 1;
  else if (dog.curFood < dog.recommendedFood * 0.9) return -1;
  else if (dog.curFood === dog.recommendedFood) return 2;
  else return 0;
};

if (eatingAmount(sarahDog) === 1)
  console.log(`Sarah's dog is eating too much.`);
else if (eatingAmount(sarahDog) === -1)
  console.log(`Sarah's dog is eating too little.`);
else console.log(`Sarah's dog is eating the correct amount.`);

// 3
const ownersEatTooMuch = [];
const ownersEatTooLittle = [];
const ownersEatPerfect = [];
const ownersEatOkay = [];

dogs.forEach(curr => {
  if (eatingAmount(curr) === -1) ownersEatTooLittle.push(...curr.owners);
  else if (eatingAmount(curr) === 1) ownersEatTooMuch.push(...curr.owners);
  else if (eatingAmount(curr) === 2) ownersEatPerfect.push(...curr.owners);
  else ownersEatOkay.push(...curr.owners);
});

const ownersEatTooMuch2 = dogs
  .filter(dog => eatingAmount(dog) === 1)
  .flatMap(dog => dog.owners);
const ownersEatTooLittle2 = dogs
  .filter(dog => eatingAmount(dog) === -1)
  .flatMap(dog => dog.owners);
const ownersEatPerfect2 = dogs
  .filter(dog => eatingAmount(dog) === 2)
  .flatMap(dog => dog.owners);
const ownersEatOkay2 = dogs
  .filter(dog => eatingAmount(dog) === 0)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooMuch2);

// 4
console.log(`${ownersEatTooLittle.join(` and `)}'s dogs eat too little.`);
console.log(`${ownersEatTooMuch.join(` and `)}'s dogs eat too much.`);

// 5
console.log(
  ownersEatPerfect.length !== 0
    ? `There is a dog eating the perfect amount`
    : `There is not a dog eating the perfect amount`
);
// instructor's
console.log(dogs.some(dog => eatingAmount(dog) === 2));

//6
console.log(
  ownersEatOkay.length !== 0
    ? `There is a dog eating an okay amount`
    : `There is not a dog eating an okay amount`
);
//instructor's
console.log(dogs.some(dog => eatingAmount(dog) === 0));

// 7
console.log(dogs.filter(dog => dog.owners.includes(`${ownersEatOkay}`)));
// instructor
const dogsOkay = dogs.filter(curr => eatingAmount(curr) === 0);
console.log(dogsOkay);

// 8
const recFoodArray = dogs
  .slice()
  .sort((curr, next) => curr.recommendedFood - next.recommendedFood);
console.log(dogs);
console.log(recFoodArray);

// // Array Methods Practice

// // summing deposits
// const depositSum = accounts
//   .flatMap(curr => curr.movements)
//   .filter(tran => tran > 0)
//   .reduce((acc, curr) => acc + curr);
// console.log(depositSum);

// // deposits over 1000
// const deposits100 = accounts
//   .flatMap(curr => curr.movements)
//   .filter(tran => tran > 1000).length;
// console.log(deposits100);

// const deposits100two = accounts
//   .flatMap(curr => curr.movements)
//   // can't use count++ because it returns the value, then increments it
//   .reduce((count, curr) => (curr >= 1000 ? ++count : count), 0);
// console.log(deposits100two);

// let a = 3;
// console.log(a++);
// console.log(a);
// console.log(++a);
// console.log(a);

// const sums = accounts
//   .flatMap(curr => curr.movements)
//   .reduce(
//     (sum, curr) => {
//       curr > 0 ? (sum.deposits += curr) : (sum.withdrawals += curr);
//       return sum;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(sums);

// const { deposits, withdrawals } = accounts
//   .flatMap(curr => curr.movements)
//   .reduce(
//     (sum, curr) => {
//       sum[curr > 0 ? `deposits` : `withdrawals`] += curr;
//       return sum;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );
// console.log(deposits, withdrawals);

// const { ds, ws } = accounts.reduce(
//   (sum, curr) => {
//     for (const cur of curr.movements) {
//       cur > 0 ? (sum.ds += cur) : (sum.ws += cur);
//     }
//     return sum;
//   },
//   { ds: 0, ws: 0 }
// );
// console.log(ds, ws);

// // convert string to title case function
// // Title Case Is a Cool Time
// const titleCaseCon = function (title) {
//   const capFirst = str => str[0].toUpperCase() + str.slice(1);
//   const exceptions = [`a`, `an`, `and`, `the`, `but`, `or`, `on`, `in`, `with`];
//   const titleCase = title
//     .toLowerCase()
//     .split(` `)
//     .map(word => (!exceptions.includes(word) ? capFirst(word) : word)).join` `;
//   return capFirst(titleCase);
// };
// console.log(titleCaseCon(`eat a big melon you meloneateR`));
// console.log(titleCaseCon(`Banana Bread is a good bread`));
// console.log(titleCaseCon(`an apple a day keeps the doctor gray`));

// // Creating and Filling Arrays

// console.log([1, 42, 12, 4, 2, 3]);
// console.log(new Array(2, 4, 77, 4, 3, 235));
// // array with only argument creates array of that size with empty elements
// const emptyArr1 = new Array(7);
// console.log(emptyArr1);
// // doesn't work
// emptyArr1.map(() => 5);

// emptyArr1.fill(0);
// console.log(emptyArr1);

// emptyArr1.fill(1, 4);
// console.log(emptyArr1);

// emptyArr1.fill(2, 2, 4);
// console.log(emptyArr1);

// // from method
// // array constructor
// // arrow function returns 1s
// const filledArr1 = Array.from({ length: 7 }, () => 1);
// console.log(filledArr1);

// const filledArr2 = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(filledArr2);

// const hundRandDice = Array.from({ length: 100 }, () =>
//   Math.trunc(Math.random() * 6 + 1)
// );
// console.log(hundRandDice);

// labelBalance.addEventListener(`click`, function () {
//   const transUI = Array.from(
//     document.querySelectorAll(`.movements__value`),
//     ele => Number(ele.textContent.replace(`$`, ``))
//   );
//   console.log(transUI);
//   // does the same thing
//   const transUI2 = [...document.querySelectorAll(`.movements__value`)];
// });

// // Sorting Arrays

// // letters
// const owners = [`Tom`, `John`, `Lon`, `Ronny Ripp`];
// console.log(owners.sort());
// // mutates array
// console.log(owners);

// // numbers
// console.log(movements);
// console.log(movements.sort());
// // return less than 0 `a` will be before `b`
// // a is the current element and b is the next
// // ascending

// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (b > a) return -1;
// });
// console.log(movements);

// // descending
// movements.sort((a, b) => {
//   if (a > b) return -1;
//   if (b > a) return 1;
// });
// console.log(movements);

// // ascending simplified if a is greater than b then a-b will be positive
// movements.sort((a, b) => a - b);
// console.log(movements);
// //descending
// movements.sort((a, b) => b - a);
// console.log(movements);

// // Flat and FlatMap
// // flat
// const arr3 = [[1, 2, 3], [6, 3, 4], 65, 87, 9];
// console.log(arr3.flat());

// const arrDeep = [[[11, 2], 3], [4, [3, 2]], 6, 3];
// console.log(arrDeep.flat(1));
// console.log(arrDeep.flat(2));

// const accountMovs = accounts.map(acc => acc.movements);
// console.log(accountMovs);
// const allMovs = accountMovs.flat();
// console.log(allMovs);
// const overallBalance = allMovs.reduce((acc, curr) => acc + curr, 0);
// console.log(overallBalance);

// const oBalanceChained = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, curr) => acc + curr, 0);
// console.log(oBalanceChained);

// // flatMap
// const oBalanceFmap = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, curr) => acc + curr, 0);
// console.log(oBalanceFmap);

// // Some and Every
// // some
// console.log(movements);
// console.log(movements.includes(-130));
// // same with some method
// console.log(movements.some(mov => mov === -130));

// const depositsCheck = movements.some(mov => mov > 0);
// console.log(depositsCheck);

// // every
// // all elements satisfy condition
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// const deposit = move => move > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// // Find Method

// // finds the first element that meets the callback function
// console.log(movements.find(mov => mov < 0));

// console.log(accounts);
// const account = accounts.find(curr => curr.owner === `Jessica Davis`);
// console.log(account);

// let accountFor = {};
// for (const account of accounts) {
//   if (account.owner === `Jessica Davis`) accountFor = account;
// }
// console.log(accountFor);

// // TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
// // TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, curr, i, arr) => acc + curr / arr.length, 0);
// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

// // Chaining

// const euroToUSD = 1.13;
// console.log(movements);
// // pipeline
// const totalDepositsUSD = movements
//   .filter(mov => mov > 0)
//   .map((mov, i, arr) => {
//     // console.log(arr);
//     return mov * euroToUSD;
//   })
//   // .map(mov => mov * euroToUSD)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDepositsUSD);

// // Coding Challenge #2

// // TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// // TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   console.log(humanAges);
//   const oldHumanAges = humanAges.filter(age => age >= 18);
//   console.log(oldHumanAges);
//   // const aveOldHumanAge =
//   //   oldHumanAges.reduce(function (acc, curr, i, arr) {
//   //     return acc + curr;
//   //   }, 0) / oldHumanAges.length;
//   const aveOldHumanAge = oldHumanAges.reduce(
//     (acc, curr, i, arr) => acc + curr / arr.length,
//     0
//   );
//   console.log(aveOldHumanAge);
// };

// calcAverageHumanAge([3, 5, 2, 12, 7].concat([4, 1, 15, 8, 3]));
// calcAverageHumanAge([9, 16, 6, 8, 3].concat([10, 5, 6, 1, 4]));

// // Map, Filter, Reduce

// // Reduce Method

// console.log(movements);

// // accumulator
// const balance = movements.reduce(function (acc, curr, i, arr) {
//   console.log(`Iteration ${i}: ${acc}.`);
//   return acc + curr;
// }, 5);
// console.log(balance);

// const balanceArrow = movements.reduce((acc, curr, i, arr) => acc + curr, 250);
// console.log(balanceArrow);

// let balanceFor = 0;
// for (const mov of movements) {
//   balanceFor += mov;
// }
// console.log(balanceFor);

// // maximum value

// const maximum = movements.reduce(
//   (acc, curr) => (curr > acc ? curr : acc),
//   movements[0]
// );
// console.log(maximum);

// // Filter Method

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// console.log(deposits);

// const depositsFor = [];
// for (const mov of movements) {
//   if (mov > 0) depositsFor.push(mov);
// }
// console.log(depositsFor);

// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);

// // Map Method

// const euroToUSD = 1.13;

// // const movUSD = movements.map(function (mov){
// //   return mov* euroToUSD;
// // })
// const movUSD = movements.map(mov => mov * euroToUSD);
// console.log(movements);
// console.log(movUSD);

// const movUSDfor = [];
// for (const mov of movements) {
//   movUSDfor.push(mov * euroToUSD);
// }

// console.log(movements);
// console.log(movUSDfor);

// const movDescribe = movements.map((mov, i, arr) => {
//   return `Interaction ${i + 1}: ${
//     mov > 0 ? `Withdrew` : `Deposited`
//   } $${Math.abs(mov)}.`;
// });

// console.log(movDescribe);

// // Coding Challenge #1

// const checkDogs = function (dogsJulia, dogsKate) {
//   const copyJulia = dogsJulia.slice(1, -2);
//   const dogsAll = copyJulia.concat(dogsKate);
//   console.log(dogsAll);
//   dogsAll.forEach(function (age, i) {
//     const aOrP = age >= 3 ? `an adult` : `a puppy`;
//     console.log(`Dog number ${i + 1}, is ${aOrP} and is ${age} years old.`);
//   });
// };

// // const dogsJulia = [3, 5, 2, 12, 7];
// // const dogsKate = [4, 1, 15, 8, 3];
// const dogsJulia = [9, 16, 6, 8, 3];
// const dogsKate = [10, 5, 6, 1, 4];
// checkDogs(dogsJulia, dogsKate);

// TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

// // For Each Maps and Sets

// // current value, key, map
// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}.`);
// });

// const namesUnique = new Set([`tom`, `tom`, `tom`, `dick`, `matt`]);
// console.log(namesUnique);
// // first and second parameters are the same because sets dont have keys
// namesUnique.forEach(function (value, _, map) {
//   console.log(`${_}: ${value}.`);
// });

// // Loopings Arrays For Each

// for (const movement of movements) {
//   if (movement < 0) console.log(`Withdrew $${Math.abs(movement)}`);
//   else console.log(`Deposited $${Math.abs(movement)}`);
// }

// // index, current element
// for (const [index, movement] of movements.entries()) {
//   if (movement < 0)
//     console.log(`Interaction ${index + 1}. Withdrew $${Math.abs(movement)}`);
//   else
//     console.log(`Interaction ${index + 1}. Deposited $${Math.abs(movement)}`);
// }

// // current element, index, array
// movements.forEach(function (movement, index, entireArray) {
//   movement >= 0
//     ? console.log(`Interaction ${index + 1}: Deposited $${Math.abs(movement)}`)
//     : console.log(`Interaction ${index + 1}: Withdrew $${Math.abs(movement)}`);
// });
// // 0: function(200)
// // 1: function(450)
// // ...
// // continue and break do not work in forEach

// Simple Array Methods

// let arr1 = [`a`, `b`, `c`, `d`, `e`];

// // number is where you start extracting
// console.log(arr1.slice(2));
// // end not included
// console.log(arr1.slice(2, 4));
// console.log(arr1.slice(-2));
// console.log(arr1.slice(-1));
// console.log(arr1.slice(1, -1));
// // shallow copy
// console.log(arr1.slice());
// // spread method we used before
// // personal preference
// console.log(...arr1);

// // splice
// // changes orginal array
// // console.log(arr1.splice(2));
// arr1.splice(-1);
// console.log(arr1);
// // second number is really number of elements we want to delete
// arr1.splice(1, 2);
// console.log(arr1);

// //reverse
// const arr2 = [`z`, `y`, `x`, `w`];
// // mutates original array
// console.log(arr2.reverse());
// console.log(arr2);

// // concat
// const letters = arr1.concat(arr2);
// console.log(letters);
// console.log([...arr1, ...arr2]);

// // join
// console.log(letters.join(` ~ `));
