console.log("test");

//The all important kitty count variable

let kittyCount = 0;

// cookies per second could start at 0 and be initialised on first click? stretch goal
//This variable will track the passive kitty generation
let kps = 1;

//From Manny's template: make an array variable ready to accept an array of objects from the API
let shopItems = [];

const kittyButton = document.getElementById("cookie-button");

kittyButton.addEventListener("click", function () {
  //   console.log("I pet the kitty");
  catIncrement();
  //   console.log(kittyCount);
  updateCounter();
});

function catIncrement() {
  kittyCount += kps; //this function will change based on upgrades... may not be a pure function because of that
}

function updateCounter() {
  const kittyCounter = document.getElementById("cookie-counter");
  kittyCounter.textContent = kittyCount;
}

//setting the passive kitty generation to update every second by the amount in
let myInterval = setInterval(function () {
  //   console.log("I repeat myself every second");
  catIncrement();
  updateCounter();
  storeScore();
}, 1000);

const upgradeContainer = document.querySelector("#upgrade-container");

//fecthing the upgrades from API, basing this a lot on Manny's demo

async function getShopAPI() {
  const receivedData = await fetch(
    "https://cookie-upgrade-api.vercel.app/api/upgrades"
  );
  console.log(receivedData);
  const data = await receivedData.json();
  console.log(data);
  const wrangledData = data["0"];
  console.log(wrangledData);
  return wrangledData;
}

let testAPI = getShopAPI();
console.log(testAPI);

//don't forget a "not enough cookies notice"

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

//not sure if I need to do some sort of if statement to check whether localstorage has been read, or if this will automatically just run once.
function restoreScore() {
  let retrievedCountString = localStorage.getItem("savedcount");
  let retrievedKpsString = localStorage.getItem("savedkps");
  // Convert the string back to a number
  let retrievedCount = Number(retrievedCountString);
  let retrievedKps = Number(retrievedCountString);
  //now to save the kitty per second
  //used .toString since can't save non-strings to the locastorage and this isn't a form.
  kittyCount = retrievedCount;
  kps = retrievedKps;
}

restoreScore();
