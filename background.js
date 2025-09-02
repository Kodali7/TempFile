var holder = {};
(async () => {
  holder = await getHolder();
})();

chrome.downloads.onCreated.addListener(function (downloadItem) {
  var condition;
  chrome.storage.local.get(["key"]).then((result) => {
    condition = result.key;
    if (condition == "OFF") {
      return;
    }
  });
  if (downloadItem.byExtensionId === chrome.runtime.id) {
    return;
  }

  console.log("Download Intercepted");

  if (!(downloadItem.finalUrl in holder)) {

    holder[downloadItem.finalUrl]=1;
    chrome.storage.local.set({ holder: holder });
  } else {
    console.log("Already handled");
    holder[downloadItem.finalUrl]+=1;
    return; //already took care of this specific downlaod
  }
  console.log("Cancelling...");
  chrome.downloads.cancel(downloadItem.id, () => {
    console.log("HOLDER:");
    console.log(holder);
    if (holder[downloadItem.finalUrl]>1) {
      return;
    }
    console.log("Logic executing...");
    chrome.storage.local.get(["key"]).then((result) => {
      //need to work on proper condition to not trigger addListener infinitely
      if (result.key === "ON") {
        console.log("Download condition met");
        handleDownloads(downloadItem);
      } 
      else {
        return;
      }
    });
  }); //cancel the original download
});

chrome.downloads.onChanged.addListener(function (downloadDelta) {
  var condition;
  chrome.storage.local.get(["key"]).then((result) => {
    condition = result.key;
  });

  if (
    downloadDelta.state &&
    downloadDelta.state.current === "complete" &&
    condition === "ON"
  ) {
    console.log("Download completed");
  }
});

chrome.alarms.onAlarm.addListener((alarm) => {
  //if timer is done set everything off
  chrome.storage.local
    .set({ key: value })
    .then(() => {
      console.log("Session " + value + " saved");
      holder = {}; //reset the holder
    })
    .catch((error) => {
      console.error("Error with alarm:", error);
    });
});

async function handleDownloads(downloadItem) {
  console.log("Handling download now");
  console.log("File URL: " + downloadItem.finalUrl);
  console.log("File name: " + downloadItem.filename);
  if (!downloadItem.filename){
    var filename = Date.now().toString(36) + Math.random().toString(36).slice(2, 8) + ".bin";
  };
  
  chrome.downloads.download({
    //temp switch before to avoid infinite download loop
    url: downloadItem.finalUrl,
    filename: "temp/here/" + filename,
    conflictAction: "uniquify"
  });
}

function getHolder() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["holder"], (result) => {
      const holderArray = result.holder || {};
      resolve(holderArray);
    });
  });
}
