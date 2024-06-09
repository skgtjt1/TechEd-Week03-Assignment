// console.log("test");

//The all important kitty count variable

let kittyCount = 0;
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
    // this basically allows for the main button to start the game, using a flag that is set as false above, and switching it to true in this function
    intervalStarted = true;
    myInterval = setInterval(function () {
      catIncrement();
      updateCounter();
      storeScore(); // Does this maybe need to go first?
    }, 1000);
  }
}

// Store the numbers as a string in local storage under keys = savedcount and savedKps
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
    //I'm glad I came across this technique of checking for presense of data
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

const stopResetButton = document.getElementById("reset-button");

kittyButton.addEventListener("click", function () {
  //   console.log("I pet the kitty");
  startInterval(); //this function should only fully run the first time since it has an if statement that will fail after the intervalStarted variable becomes true. Solution to having the same button start the game and also generate the clicks.
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

const shopContainer = document.getElementById("upgrade-container");

//From Manny's template: make an array variable ready to accept an array of objects from the API

let upgradeItems = []; // may need to declare this further up
async function getShopAPI() {
  const response = await fetch(
    "https://cookie-upgrade-api.vercel.app/api/upgrades"
  );
  const json = await response.json();
  upgradeItems = json; // sort of cobbled this together
  displayShop(); // Call displayShop after fetching the items
}

function displayShop() {
  upgradeItems.forEach((shopItem) => {
    //take the array of objects I made from the API and loop through basically extracting the values from each key
    const itemDiv = document.createElement("div"); //make divs for each upgrade item
    itemDiv.classList.add("upgrade-item"); //add class to the div

    const itemName = document.createElement("p");
    itemName.textContent = `${shopItem.name}`; //found this on stackexchange, reminded me that template literals exist, looks much nicer and keeps number of p tags down

    const itemCost = document.createElement("p");
    itemCost.textContent = `Cost: ${shopItem.cost}`;

    const itemIncrease = document.createElement("p");
    itemIncrease.textContent = `Increase: ${shopItem.increase}`;

    const button = document.createElement("button");
    button.classList.add("purchase");
    button.textContent = "Purchase";
    button.addEventListener("click", () => purchaseUpgrade(shopItem)); //shopItem can be accessed by another function, still need to learn more about scope restrictions..
    //during debugging GPT suggested putting the eventlistener button within this function, only way it seems to work.

    itemDiv.appendChild(itemName); //have to append all these first to the container, need to remember this for future projects
    itemDiv.appendChild(itemCost);
    itemDiv.appendChild(itemIncrease);
    itemDiv.appendChild(button);

    shopContainer.appendChild(itemDiv); //finally append the upgrade div to the upgrade container, CSS grid means they will populate dynamically.
  });
}

function purchaseUpgrade(shopItem) {
  if (kittyCount >= shopItem.cost) {
    kittyCount -= shopItem.cost;
    kps += shopItem.increase;
    updateCounter();
    storeScore();
  } else {
    alert("Not enough kitties!"); //not really necessary, just fun. Although if I had time I would have used something other than an alert, perhaps just unhiding and rehiding an element using a timer
  }
}
//found on stack exchange, makes the function only run on page load
//these only get called once when the page loads
window.onload = function () {
  restoreScore();
  updateCounter();
  getShopAPI(); // fetch and display shop items
};
