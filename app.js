console.log("test");

//The all important kitty count variable

let kittyCount = 0;

// cookies per second could start at 0 and be initialised on first click? stretch goal
//This variable will track the passive kitty generation
let kps = 1;

//From Manny's template: make an array variable ready to accept an array of objects from the API

let myInterval;
let intervalStarted = false;

const kittyButton = document.getElementById("cookie-button");

function catIncrement() {
  kittyCount += kps; //this function will change based on upgrades... may not be a pure function because of that
}

function updateCounter() {
  const kittyCounter = document.getElementById("cookie-counter");
  kittyCounter.textContent = kittyCount;
  const kpsCounter = document.getElementById("kps-meter");
  kpsCounter.textContent = kps;
}

//setting the passive kitty generation to update every second by the amount in

// let myInterval = setInterval(function () {
//   //   console.log("I repeat myself every second");

//   catIncrement();
//   updateCounter();
//   storeScore(); // does this maybe need to go first?
// }, 1000);

function startInterval() {
  if (!intervalStarted) {
    // this basically
    intervalStarted = true;
    myInterval = setInterval(function () {
      catIncrement();
      updateCounter();
      storeScore(); // Does this maybe need to go first?
    }, 1000);
  }
}

//need to make localstorage function - this can go in the iteration function to update every second
//need to make reset button - might not need to update localstorage here

//locastorage test
// Example number variable

// Store the numbers as a string in local storage under keys = savedcount and
function storeScore() {
  localStorage.setItem("savedcount", kittyCount.toString());
  localStorage.setItem("savedkps", kps.toString());
  // To retrieve the number later

  //   console.log(retrievedCount);
}

function restoreScore() {
  let retrievedCountString = localStorage.getItem("savedcount");
  let retrievedKpsString = localStorage.getItem("savedkps");

  if (retrievedCountString !== null) {
    //only tries to load the localstorage values if they exist. otherwise sets the variable to starting values. Needed to add this otherwise game wouldn't start without the reset function being called for some reason...
    kittyCount = Number(retrievedCountString);
  } else {
    kittyCount = 0;
  }

  if (retrievedKpsString !== null) {
    kps = Number(retrievedKpsString);
  } else {
    kps = 1;
  }
}

//now to save the kitty per second
//used .toString since can't save non-strings to the locastorage and this isn't a form.
//   kittyCount = retrievedCount;
//   kps = retrievedKps;

const stopResetButton = document.getElementById("reset-button");

kittyButton.addEventListener("click", function () {
  //   console.log("I pet the kitty");
  startInterval();
  catIncrement();
  //   console.log(kittyCount);
  updateCounter();
});

stopResetButton.addEventListener("click", function () {
  clearInterval(myInterval);
  kittyCount = 0;
  kps = 1;
  localStorage.setItem("savedcount", kittyCount);
  localStorage.setItem("savedkps", kps); //should work since I just reset those variables
  //   console.log("The reset button has been pressed");
  updateCounter();
  intervalStarted = false; // resets resets the flag for the startInterval function
  //   startInterval(); // Restart the interval function
});

//found on stack exchange, makes the function only run on page load
window.onload = function () {
  restoreScore();
  updateCounter();
};

//need to make a stop and reset button

// const upgradeContainer = document.querySelector("#upgrade-container");

//fecthing the upgrades from API, basing this a lot on Manny's demo

// async function getShopAPI() {
//honestly not sure about async but it was in the workshop
//   const receivedData = await fetch(
//     "https://cookie-upgrade-api.vercel.app/api/upgrades"
//   );
//   console.log(receivedData);
//   const data = await receivedData.json();
//   console.log(data);
//   const wrangledData = data["0"];
//   console.log(wrangledData);
//   return wrangledData;
// }

// let testAPI = getShopAPI();
// console.log(testAPI);

//don't forget a "not enough kitties notice"

// const upgradeContainer = document.getElementById(".upgrade-container");

// const shopContainer = document.getElementById("upgrade-container");

// let upgradeItems = []; // may need to declare this further up
// async function getShopAPI() {
//   const response = await fetch(
//     "https://cookie-upgrade-api.vercel.app/api/upgrades"
//   );
//   const json = await response.json();
//   upgradeItems.push(json);
//   // upgradeItems = upgradeItems[0];
//   console.log(upgradeItems);
// }

// // getShopAPI();

// function displayShop() {
//   upgradeItems.forEach((shopItem) => {
//     const item = document.createElement("p");
//     const cost = document.createElement("p");
//     const increase = document.createElement("p");
//     item.classList.add("p-start");
//     cost.classList.add("p-middle");
//     increase.classList.add("p-end");
//     const button = document.createElement("button");
//     const div = document.createElement("div");
//     button.classList.add("purchase");
//     item.textContent = shopItem.name;
//     cost.textContent = shopItem.cost;
//     increase.textContent = shopItem.increase;
//     div.appendChild(item);
//     div.appendChild(cost);
//     div.appendChild(increase);
//     button.appendChild(div);
//     shopContainer.appendChild(button);
//   });
// }

const shopContainer = document.getElementById("upgrade-container");

let upgradeItems = []; // may need to declare this further up
async function getShopAPI() {
  const response = await fetch(
    "https://cookie-upgrade-api.vercel.app/api/upgrades"
  );
  const json = await response.json();
  upgradeItems = json; // assuming json is the array of upgrade items
  displayShop(); // Call displayShop after fetching the items
}

function displayShop() {
  upgradeItems.forEach((shopItem) => {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("upgrade-item");

    const itemName = document.createElement("p");
    itemName.textContent = `${shopItem.name}`;

    const itemCost = document.createElement("p");
    itemCost.textContent = `Cost: ${shopItem.cost}`;

    const itemIncrease = document.createElement("p");
    itemIncrease.textContent = `Increase: ${shopItem.increase}`;

    const button = document.createElement("button");
    button.classList.add("purchase");
    button.textContent = "Purchase";
    button.addEventListener("click", () => purchaseUpgrade(shopItem));

    itemDiv.appendChild(itemName);
    itemDiv.appendChild(itemCost);
    itemDiv.appendChild(itemIncrease);
    itemDiv.appendChild(button);

    shopContainer.appendChild(itemDiv);
  });
}

function purchaseUpgrade(shopItem) {
  if (kittyCount >= shopItem.cost) {
    kittyCount -= shopItem.cost;
    kps += shopItem.increase;
    updateCounter();
    storeScore();
  } else {
    alert("Not enough kitties!");
  }
}

// Fetch and display the upgrades when the page loads
window.onload = function () {
  restoreScore();
  updateCounter();
  getShopAPI(); // fetch and display shop items
};
