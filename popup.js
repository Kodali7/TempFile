chrome.downloads.onCreated.addListener(function(downloadItem) {
    console.log("Download Started")
    handleDownloads(downloadItem);
});

document.addEventListener("DOMContentLoaded", function() {
    const toggleButton = document.getElementById("slider")
    
    toggleButton.addEventListener("change", function() {
        if (toggleButton.checked) { //check if slider is activated
            console.log("Switch is ON");
        } else { //return to downloading normally
            console.log("Switch is OFF");
        }
    });
});

chrome.downloads.onChanged.addListener(function(downloadDelta) {
    if((downloadDelta.state && downloadDelta.state.current === "complete")) {
        console.log("Download completed");
    }
});

function handleDownloads(downloadItem) {
    var fileurl = downloadItem.fileUrl;
    chrome.downloads.download({url: fileurl, filename: "temp/" + downloadItem.filename});
}