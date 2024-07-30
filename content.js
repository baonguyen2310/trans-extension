document.addEventListener('mouseup', function() {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      chrome.runtime.sendMessage({ action: "translateText", text: selectedText });
    }
  });
  