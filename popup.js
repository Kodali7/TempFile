const toggleButton = document.getElementById("slider");

toggleButton.addEventListener("change", function() {
  var value;
  if (toggleButton.checked) { //check if slider is activated
      console.log("Switch is ON");
      value = "ON";
      createTimer(); //call the timer for 10 minutes on start 
      console.log("Timer created");

  } else { //return to downloading normally
      console.log("Switch is OFF");
      value = "OFF";
      chrome.storage.local.set({holder: {}})
  }
  chrome.storage.local
    .set({ key: value })
    .then(() => {
      console.log("Session " + value +  " saved");
    })
    .catch((error) => {
      console.error("Error setting storage:", error);
    });
});

document.addEventListener("DOMContentLoaded", function() {
  chrome.storage.local.get(["key"]).then((result) => {
    console.log("Got value " + result.key);
    if (result.key === "ON") {
      toggleButton.checked = true;
    } 
    else if (result.key === "OFF") {
      toggleButton.checked = false;
    }
  })
});

async function createTimer(){
  await chrome.alarms.create("Timer", {
    delayInMinutes: 10,
  });
  console.log("Timer function completed");
}