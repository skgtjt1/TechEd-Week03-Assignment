console.log("test");

//The all important kitty count variable

let kittyCount = 0;

// cookies per second could start at 0 and be initialised on first click? stretch goal
//This variable will track the passive kitty generation
let cps = 1;

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
  kittyCount += cps; //this function will change based on upgrades... may not be a pure function because of that
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
