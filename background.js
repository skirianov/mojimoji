chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
      chrome.tabs.sendMessage(tabId, {url: tab.url}, function(response) {
        console.log(response.farewell);
        console.log(tab.url);
      })
    }
  })
})