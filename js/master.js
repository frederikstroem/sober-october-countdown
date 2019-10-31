const softwareVersion = "v1.2.1";


/*

  Add extra functionality to date type.

*/
// Add new date function. Source: https://stackoverflow.com/a/11888430 (2019-10-06).
Date.prototype.stdTimezoneOffset = function () {
  var jan = new Date(this.getFullYear(), 0, 1);
  var jul = new Date(this.getFullYear(), 6, 1);
  return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
}
Date.prototype.isDstObserved = function () {
  return this.getTimezoneOffset() < this.stdTimezoneOffset();
}

/*

  Constants.

*/
const standardSettings = {
  "showCountdownInTitle": true,
  "showExactCountdown": false
};
const localStorageItemName = "settings";
const title = "Sober October Countdown";

/*

  Variables.

*/
var currentSettings = {};
var currentLocalDate = new Date();

/*

  DOM elements.

*/
var mainTextElement = document.getElementById("mainText");
var settingsContainerElements = document.getElementById("settingsContainer").querySelectorAll(".checkbox");
var settingsButtonElement = document.getElementById("settingsButton");
var settingsPanelElement = document.getElementById("settingsPanel");
var settingsApplyElement = document.getElementById("settingsApply");
var settingsCancelElement = document.getElementById("settingsCancel");
var settingsPersonalLinkElement = document.getElementById("settingsPersonalLink");
var titleElement = document.getElementsByTagName("title")[0];

/*

  Functions.

*/
/* Days between two dates function that works with daylight saving time.
 * Sources:
 * https://stackoverflow.com/a/2627482 (2019-10-06).
 * https://stackoverflow.com/a/4943116 (2019-10-06).
 */
function daysBetween (startDate, endDate) {
  /* Logic that will fix DST problems:
   1. If both dates are either DST or not, do nothing.
   2. If only start date is DST, add one hour to start date.
   3. If only end date is DST, subtract one hour to start date.
   */
  if (
    startDate.isDstObserved() && !endDate.isDstObserved()
  ) {
    startDate.setHours(startDate.getHours() + 1);
  } else if (
    !startDate.isDstObserved() && endDate.isDstObserved()
  ) {
    startDate.setHours(startDate.getHours() - 1);
  }

  // The number of milliseconds in one day
  const ONE_DAY = 1000 * 60 * 60 * 24;
  // Calculate the difference in milliseconds
  const differenceMs = Math.abs(startDate - endDate);
  // Convert back to days and return
  return Math.floor(differenceMs / ONE_DAY) + 1;
}

function getDayCountdown () {
  // Check weather it is october.
  if (currentLocalDate.getMonth() == 10 - 1) {  // getMonth() returns a value between 0-11.
    // It is october.
    // Time until 1st of november.
    var countdownTo = new Date(currentLocalDate.getFullYear(), 11 - 1, 1);

    return daysBetween(countdownTo, currentLocalDate);
  } else {
    // It is not october.
    // Time until 1st of october.
    var countdownToYear = currentLocalDate.getFullYear();
    if ((currentLocalDate.getMonth() + 1) > 10) {
      // After October.
      countdownToYear++;
    }
    var countdownTo = new Date(countdownToYear, 10 - 1, 1, 0, 0, 0);

    return daysBetween(countdownTo, currentLocalDate);
  }
}

function setDayCountdown () {
  // Set first header element in mainText.
  mainTextElement.querySelector(":nth-child(1)").innerHTML = "There is";

  // Check weather it is october.
  if (currentLocalDate.getMonth() == 10 - 1) {  // getMonth() returns a value between 0-11.
    // It is october.
    // Time until 1st of november.
    var daysLeft = getDayCountdown();

    mainTextElement.querySelector(":nth-child(2)").innerHTML = daysLeft;
    mainTextElement.querySelector(":nth-child(2)").innerHTML += " day";
    if (currentLocalDate.getDate() != 31) {
      mainTextElement.querySelector(":nth-child(2)").innerHTML += "s";
    }
    mainTextElement.querySelector(":nth-child(3)").innerHTML = "until Sober October ends.";
  } else {
    // It is not october.
    // Time until 1st of october.
    var daysLeft = getDayCountdown();

    mainTextElement.querySelector(":nth-child(2)").innerHTML = daysLeft;
    mainTextElement.querySelector(":nth-child(2)").innerHTML += " day";
    if (daysLeft != 1) {
      mainTextElement.querySelector(":nth-child(2)").innerHTML += "s";
    }
    mainTextElement.querySelector(":nth-child(3)").innerHTML = "until Sober October starts.";
  }
}

function setExactCountdown () {

  var countdownTo;

  // Set first header element in mainText.
  mainTextElement.querySelector(":nth-child(1)").innerHTML = "There is";

  // Check weather it is october.
  if (currentLocalDate.getMonth() == 10 - 1) {  // getMonth() returns a value between 0-11.
    // It is october.
    // Time until 1st of november.
    countdownTo = new Date(currentLocalDate.getFullYear(), 11 - 1, 1);
    mainTextElement.querySelector(":nth-child(3)").innerHTML = "until Sober October ends.";
  } else {
    // It is not october.
    // Time until 1st of october.
    var countdownToYear = currentLocalDate.getFullYear();
    if ((currentLocalDate.getMonth() + 1) > 10) {
      // After October.
      countdownToYear++;
    }
    countdownTo = new Date(countdownToYear, 10 - 1, 1, 0, 0, 0);
    mainTextElement.querySelector(":nth-child(3)").innerHTML = "until Sober October starts.";
  }

  const differenceSeconds = Math.ceil(Math.abs(currentLocalDate - countdownTo) / 1000);

  const daysLeft = Math.floor(differenceSeconds / 60 / 60 / 24);
  const hoursLeft = Math.floor((differenceSeconds / 60 / 60) % 24);
  const minutesLeft = Math.floor((differenceSeconds / 60) % 60);
  const secondsLeft = Math.floor(differenceSeconds % 60);

  // Source: https://stackoverflow.com/a/610415 (2019-10-11).
  const exactCountdownString = `${daysLeft} d. ${hoursLeft} h. ${minutesLeft} m. ${secondsLeft} s.`;
  mainTextElement.querySelector(":nth-child(2)").innerHTML = exactCountdownString;

}

function getSetting (settingName) {
  return currentSettings[settingName];
}

function setSetting (settingName, newValue) {
  // If value is a string, convert to boolean
  if (newValue == "true") {
    newValue = true;
  } else if (newValue == "false") {
    newValue = false;
  }

  currentSettings[settingName] = newValue;

  let localStorageSettings = JSON.parse(localStorage.getItem(localStorageItemName));
  localStorageSettings[settingName] = newValue;
  localStorage.setItem(localStorageItemName, JSON.stringify(localStorageSettings));
}

function showPersonalLink () {
  // Makes a popup for the user to copy the current settings.
  let rootUrl = window.location.origin;
  let getString = "?";
  for (var i = 0; i < settingsContainerElements.length; i++) {

    let currentInputElement = settingsContainerElements[i].querySelector("input");

    getString += currentInputElement.name;
    getString += "=";
    if (currentInputElement.checked) {
      getString += "true";
    } else {
      getString += "false";
    }

    if (i != settingsContainerElements.length - 1) {
      getString += "&";
    }

  }

  window.prompt("Copy to clipboard", rootUrl + getString);
}

function updateLoop () {

  currentLocalDate = new Date();

  if (getSetting("showCountdownInTitle")) {
    titleElement.innerHTML = "(" + getDayCountdown() + ") "+ title;
  } else if (titleElement.innerHTML != title) {
    titleElement.innerHTML = title;
  }

  if (getSetting("showExactCountdown")) {
    setExactCountdown();
  } else {
    setDayCountdown();
  }

}

/*

  Init run.

*/
// Set software version.
document.getElementById("softwareVersion").innerHTML = softwareVersion;

// Fetch GET values. Source: https://stackoverflow.com/a/21210643 (2019-10-07).
var queryDict = {};
location.search.substr(1).split("&").forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]});

// Local storage init run.
if (!localStorage.getItem(localStorageItemName)) {
  currentSettings = standardSettings;
  localStorage.setItem(localStorageItemName, JSON.stringify(standardSettings));
} else if (localStorage.getItem(localStorageItemName)) {
  currentSettings = JSON.parse(localStorage.getItem(localStorageItemName));
}

// Check if get values overides any settings. Source: https://stackoverflow.com/a/29044820 (2019-10-08).
for (let key in standardSettings) {
    if (key in queryDict) {
      if (queryDict[key].toString() != currentSettings[key].toString()) {
        setSetting(key, queryDict[key]);
      }
    }
}

// Apply settings to settings panel elements.
for (var i = 0; i < settingsContainerElements.length; i++) {
  let currentInputElement = settingsContainerElements[i].querySelector("input");
  if (currentSettings[currentInputElement.name] == true) {
    currentInputElement.checked = true;
  } else {
    currentInputElement.checked = false;
  }
}

// Event listeners.
settingsButtonElement.addEventListener("click", function () {
  settingsPanelElement.style.display = "block";
});
settingsApplyElement.addEventListener("click", function () {
  for (var i = 0; i < settingsContainerElements.length; i++) {
    let currentInputElement = settingsContainerElements[i].querySelector("input");
    if (currentInputElement.checked == true) {
      setSetting(currentInputElement.name, true);
    } else {
      setSetting(currentInputElement.name, false);
    }
  }

  settingsPanelElement.style.display = "none";
});
settingsCancelElement.addEventListener("click", function () {
  settingsPanelElement.style.display = "none";
});
settingsPersonalLinkElement.addEventListener("click", function () {
  showPersonalLink();
});

document.onkeydown = function(evt) {  // Source: https://jsfiddle.net/m9w8m/ (2019-10-10).
  evt = evt || window.event;
  if (evt.keyCode == 27) {  // Escape key.
    if (settingsPanelElement.style.display == "none") {
      settingsPanelElement.style.display = "block";
    } else {
      settingsPanelElement.style.display = "none";
    }

  }
};

/*

  Update loop. Will update every second infinitely.

*/
updateLoop(); // Run once to avoid one second delay on load.
window.setInterval(function(){
  updateLoop();
}, 1000);
