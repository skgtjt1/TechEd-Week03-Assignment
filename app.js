console.log("test");

//The all important cookie count variable

let kittyCount = 0;

// cookies per second could start at 0 and be initialised on first click? stretch goal
let cps = 1;

const kittyButton = document.getElementById("cookie-button");

kittyButton.addEventListener("click", function () {
  //   console.log("I pet the kitty");
  catIncrement();
  //   console.log(kittyCount);
  updateCounter();
});

function catIncrement() {
  kittyCount++; //this function will change based on upgrades... may not be a pure function because of that
}

function updateCounter() {
  const kittyCounter = document.getElementById("cookie-counter");
  kittyCounter.textContent = kittyCount;
}

updateCounter();
