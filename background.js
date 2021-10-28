let urls = [];
let currentTab;

import emoji from './emoji.js';

chrome.runtime.onInstalled.addListener(() => {
  init();
})

chrome.runtime.onStartup.addListener(() => {
  init();
})



function init() {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    let url = tab.url.substring(tab.url.indexOf('h'), tab.url.indexOf('/', 'https://'.length));
    urls = urls.filter(each => each !== url);
    getTabAndInject(tab);
    currentTab = tab;
  });

  chrome.tabs.onActivated.addListener(() => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => { 
      getTabAndInject(tabs[0]);
      currentTab = tabs[0];
    });
    
  })

  chrome.tabs.onRemoved.addListener(() => {
        let url = currentTab.url.substring(currentTab.url.indexOf('h'), currentTab.url.indexOf('/', 'https://'.length));
        urls = urls.filter(each => each !== url);
        console.log
  })
}

function getTabAndInject(tab) {
  let url = tab.url.substring(tab.url.indexOf('h'), tab.url.indexOf('/', 'https://'.length));
    console.log(url);

    chrome.storage.local.set({ urls: urls });

    if (tab.status == 'complete' && tab.url != undefined) {

      chrome.storage.local.get(['urls'], (gotURLs) => {

        if (gotURLs.urls.includes(url)) {
          return;
        } else {
          urls.push(url);
          injectScript(tab);
        }
      })
    } 
}


function sendMessage(tab, message) {
  chrome.tabs.sendMessage(tab.id, { message: message })
}
async function injectScript(tab) {  
  if (tab.url.includes('twitter') && tab.status === 'complete') {
    chrome.scripting.executeScript(
      {
        target: {tabId: tab.id},
        files: ['twitter.js']
      },
      () => {console.log('script injected')}
    );

    chrome.scripting.insertCSS(
      {
        target: {
          tabId: tab.id,
        },
        files: ['buttons.css']
      }
    )

    sendMessage(tab, emoji);
  }
}