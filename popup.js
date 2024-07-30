document.getElementById('save-url').addEventListener('click', () => {
    const url = document.getElementById('chatgpt-url').value;
    chrome.runtime.sendMessage({ action: "setChatGPTTab", url: url });
    alert('Set url tab chatgpt success!')
  });
  