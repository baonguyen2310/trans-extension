chrome.runtime.onInstalled.addListener(() => {
    console.log("ChatGPT Automation Extension Installed");
  });
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "setChatGPTTab") {
      chrome.storage.local.set({ chatGPTTabUrl: request.url });
    } else if (request.action === "translateText") {
      chrome.storage.local.get("chatGPTTabUrl", (data) => {
        if (data.chatGPTTabUrl) {
          chrome.tabs.query({ url: data.chatGPTTabUrl }, (tabs) => {
            if (tabs.length > 0) {
              chrome.tabs.sendMessage(tabs[0].id, { action: "pasteAndSend", text: request.text });
            } else {
              alert("Không tìm thấy tab ChatGPT!");
            }
          });
        } else {
          alert("URL của tab ChatGPT chưa được lưu!");
        }
      });
    }
  });
  