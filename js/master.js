// Constansts.
const currentLocalDate = new Date();

// DOM elements.
var mainText = document.getElementById("mainText");

// Set first header element in mainText.
mainText.querySelector(":nth-child(1)").innerHTML = "There is";

// Check weather it is october.
if (currentLocalDate.getMonth() == 10 - 1) {  // getMonth() returns a value between 0-11.
  // It is october.
  // Time to 31th of october.
  var countdownTo = new Date(currentLocalDate.getFullYear(), 10 - 1, 31);
  mainText.querySelector(":nth-child(2)").innerHTML = Math.floor(
    (countdownTo.getTime() - currentLocalDate.getTime()) / (1000 * 60 * 60 * 24) + 1
  );
  mainText.querySelector(":nth-child(2)").innerHTML += " day";
  if (currentLocalDate.getDate() != 30) {
    mainText.querySelector(":nth-child(2)").innerHTML += "s";
  }
  mainText.querySelector(":nth-child(3)").innerHTML = "to the last day of October.";
} else {
  // It is not october.
  // Time to 1st of october.
  var countdownToYear = currentLocalDate.getFullYear();
  if ((currentLocalDate.getMonth() + 1) > 10) {
    // After October.
    countdownToYear++;
  }
  var countdownTo = new Date(countdownToYear, 10 - 1, 1, 0, 0, 0);

  var daysLeft = Math.floor((countdownTo.getTime() - currentLocalDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  mainText.querySelector(":nth-child(2)").innerHTML = daysLeft;
  mainText.querySelector(":nth-child(2)").innerHTML += " day";
  if (daysLeft != 1) {
    mainText.querySelector(":nth-child(2)").innerHTML += "s";
  }
  mainText.querySelector(":nth-child(3)").innerHTML = "to the first day of October.";
}
