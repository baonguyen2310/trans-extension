chrome.runtime.onInstalled.addListener(() => {
  console.log("ChatGPT Automation Extension Installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "setChatGPTTab") {
      chrome.storage.local.set({ chatGPTTabUrl: request.url });
  } else if (request.action === "translateText") {
      chrome.storage.local.get("chatGPTTabUrl", (data) => {
          if (data.chatGPTTabUrl) {
              // Lưu lại tab hiện tại (tab PDF)
              chrome.tabs.query({ active: true, currentWindow: true }, (activeTabs) => {
                  if (activeTabs.length > 0) {
                      const currentTabId = activeTabs[0].id;

                      // Chuyển sang tab ChatGPT
                      chrome.tabs.query({ url: data.chatGPTTabUrl }, (tabs) => {
                          if (tabs.length > 0) {
                              const chatGPTTabId = tabs[0].id;

                              // Chuyển tab ChatGPT lên
                              chrome.tabs.update(chatGPTTabId, { active: true }, () => {
                                  // Gửi thông điệp đến tab ChatGPT
                                  chrome.tabs.sendMessage(chatGPTTabId, { action: "pasteAndSend", text: request.text }, () => {
                                      // Chuyển lại tab PDF lên trên sau khi gửi thông điệp
                                      chrome.tabs.update(currentTabId, { active: true });
                                  });
                              });
                          } else {
                              alert("Không tìm thấy tab ChatGPT!");
                          }
                      });
                  } else {
                      alert("Không tìm thấy tab hiện tại!");
                  }
              });
          } else {
              alert("URL của tab ChatGPT chưa được lưu!");
          }
      });
  }
});
