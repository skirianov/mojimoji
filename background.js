chrome.runtime.onInstalled.addListener(() => {
  
  chrome.tabs.onActivated.addListener(async (tabId) => {
    async function getCurrentTab() {
      let queryOptions = { active: true, currentWindow: true };
      let [tab] = await chrome.tabs.query(queryOptions);
      return tab;
    }

    let tab = await getCurrentTab();
    
    if (tab.url) {
      chrome.tabs.sendMessage(tab.id, {url: tab.url}, function(response) {
        console.log(response.ok);
      })
    }

  })
 

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
      chrome.tabs.sendMessage(tabId, {url: tab.url}, function(response) {
        console.log(response.farewell);
        console.log(tab.url);
      })
    }
  })
})