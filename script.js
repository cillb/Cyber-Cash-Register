let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

const totalDue = document.getElementById("total");
const cash = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const cashDrawer = document.getElementById("cash-in-drawer");
const changeDue = document.getElementById("change-due");

totalDue.innerText += ` $${price}`;

const updateCashDrawerUI = (arr) => {
    const changeNameMap = {
        PENNY: "Pennies",
        NICKEL: "Nickels",
        DIME: "Dimes",
        QUARTER: "Quarters",
        ONE: "Ones",
        FIVE: "Fives",
        TEN: "Tens",
        TWENTY: "Twenties",
        'ONE HUNDRED': "Hundreds"
    }

    cashDrawer.innerHTML = "";
    cashDrawer.innerHTML += `<p><strong>Cash in drawer:</strong></p>`;
    arr.forEach(el => cashDrawer.innerHTML += `<p>${changeNameMap[el[0]]}: $${el[1]}</p>`);
}

const cashCheck = () => {
    if (Math.round(Number(cash.value) * 100) === price * 100) {
        changeDue.innerHTML = `<p>No change due - customer paid with exact cash</p>`;
        return false;
    } else if (Math.round(Number(cash.value) * 100) < price * 100) {
        return alert("Customer does not have enough money to purchase the item");
    }
    return true;
}

const processChange = (arrChange, arrDrawer, status) => {
    updateCashDrawerUI(arrDrawer);
    changeDue.innerHTML += `<p>Status: ${status}</p>`;
    arrChange.forEach(el => changeDue.innerHTML += `<p>${el[0]}: $${el[1]}</p>`);
}


const calcChange = () => {
    let requiredChange = Math.round(Number(cash.value) * 100) - Math.round(price * 100);
    let cidReverse = [...cid].reverse().map(([name, amount]) => [name, Math.round(amount * 100)]);
    const singleValues = [
        ['ONE HUNDRED', 10000],
        ['TWENTY', 2000],
        ['TEN', 1000],
        ['FIVE', 500],
        ['ONE', 100],
        ['QUARTER', 25],
        ['DIME', 10],
        ['NICKEL', 5],
        ['PENNY', 1]
    ];
    let changeBack = [];

    for (let i = 0; i < singleValues.length; i++) {
        let coinName = singleValues[i][0];
        let coinValue = singleValues[i][1];
        let drawerCoin = cidReverse.find(el => el[0] === coinName)[1];
        let coinChange = 0;
        
        while ( requiredChange >= coinValue && drawerCoin >= coinValue) {
            requiredChange -= coinValue;
            drawerCoin -= coinValue;
            coinChange += coinValue;
        }

        cidReverse.find(el => el[0] === coinName)[1] = drawerCoin;
        if (coinChange > 0) {
            changeBack.push([coinName, coinChange / 100]);
        }
    }

    if (requiredChange > 0) {
        changeDue.innerHTML = `<p>Status: INSUFFICIENT_FUNDS</p>`;
    } else {
        cid = cidReverse.reverse().map(([coin, amount]) => [coin, amount / 100]);
        processChange(changeBack, cid, "OPEN");
    }
}

const fundsCheck = () => {
    changeDue.innerHTML = "";
    const totalChange = Math.round(Number(cash.value) * 100) - Math.round(price * 100);
    const totalDrawerFunds = cid.reduce((total, value) => total += value[1], 0) * 100;
    if (totalChange === totalDrawerFunds) {
        let restOfChange = [];
        cid.forEach(el => {
            if (el[1] > 0) {
                restOfChange.unshift(el);
            }
        })
        cid = cid.map(([coin, amount]) => [coin, amount > 0 ? 0 : amount]);
        processChange(restOfChange, cid, "CLOSED");
    } else if (totalChange > totalDrawerFunds) {
        changeDue.innerHTML = `<p>Status: INSUFFICIENT_FUNDS</p>`;
    } else {
        calcChange();
    }
}

purchaseBtn.addEventListener("click", () => {
    if (!cashCheck()) {
        return;
    }
    fundsCheck();
    cash.value = "";
});

cash.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        if(!cashCheck()) {
            return;
        }
        fundsCheck();
        cash.value = "";
    }
});

updateCashDrawerUI(cid);