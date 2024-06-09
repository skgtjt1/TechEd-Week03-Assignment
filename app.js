console.log("test");

//The all important kitty count variable

let kittyCount = 0;

// cookies per second could start at 0 and be initialised on first click? stretch goal
//This variable will track the passive kitty generation
let kps = 1;

let myInterval;
let intervalStarted = false;

const kittyButton = document.getElementById("cookie-button");

function catIncrement() {
  kittyCount += kps;
}

function updateCounter() {
  const kittyCounter = document.getElementById("cookie-counter");
  kittyCounter.textContent = kittyCount;
  const kpsCounter = document.getElementById("kps-meter");
  kpsCounter.textContent = kps;
}

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
  intervalStarted = false; // resets the flag for the startInterval function
});

//found on stack exchange, makes the function only run on page load

const shopContainer = document.getElementById("upgrade-container");

//From Manny's template: make an array variable ready to accept an array of objects from the API

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
    //reminded of template literals.

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

//these only get called once when the page loads
window.onload = function () {
  restoreScore();
  updateCounter();
  getShopAPI(); // fetch and display shop items
};
