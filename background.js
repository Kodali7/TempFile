chrome.downloads.onCreated.addListener(function (downloadItem) {
  console.log("Download Intercepted");
  const holder = {};

  if (downloadItem.id in holder){ //initialize count (should max be 1 but jic)
    holder[downloadItem.id]+=1;
  }
  else{
    holder[downloadItem.id]=0;
  }

  chrome.downloads.cancel(downloadItem.id, () => {
    chrome.storage.local.get(["key"]).then((result) => { //need to work on proper condition to not trigger addListener infinitely
      if (result.key === "ON") {
        console.log("Download condition met");
        
        if (!(downloadItem.filename.includes("temp/here"))){
          handleDownloads(downloadItem);
        }
      }
      else if (result.key === "DOWNLOAD"){
        console.log("Downloading...");
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
    body: String(downloadItem.id)
  });
}