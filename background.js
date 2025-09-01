const holder = {};
chrome.downloads.onCreated.addListener(function (downloadItem) {
  console.log("Download Intercepted");

  if (!(downloadItem.finalUrl in holder)){ //initialize count (should max be 1 but jic)
    holder[downloadItem.finalUrl]=1;
  }
  else{
    return; //already took care of this specific downlaod
  }

  chrome.downloads.cancel(downloadItem.id, () => {
    if (downloadItem.byExtensionId in holder){return}
    chrome.storage.local.get(["key"]).then((result) => { //need to work on proper condition to not trigger addListener infinitely
      if (result.key === "ON") {
        console.log("Download condition met");
        handleDownloads(downloadItem);
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

chrome.alarms.onAlarm.addListener((alarm) => { //if timer is done set everything off
  chrome.storage.local
    .set({ key: value })
    .then(() => {
      console.log("Session " + value + " saved");
    })
    .catch((error) => {
      console.error("Error with alarm:", error);
    });
});

function handleDownloads(downloadItem) {
  console.log("Handling download now");
  console.log("File URL: " + downloadItem.finalUrl);

  chrome.downloads.download({ //temp switch before to avoid infinite download loop
    url: downloadItem.finalUrl,
    filename: "temp/here" + downloadItem.filename,
  });
}