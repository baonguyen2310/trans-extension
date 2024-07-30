// Biến để lưu trữ số lượng thẻ <p> trước khi thay đổi
let previousPCount = document.querySelectorAll('p').length;

// Hàm để nhấn nút 'Read Aloud' dưới thẻ <p> gần cuối
function clickReadAloudButton() {
    // Chọn tất cả các thẻ <p>
    const messages = document.querySelectorAll('p');

    // Nếu có ít hơn 2 thẻ <p>, không làm gì
    if (messages.length < 2) return;

    // Lấy thẻ <p> gần cuối, bỏ qua thẻ <p> cuối cùng
    const targetMessage = messages[messages.length - 2];

    // Tìm phần tử chứa dãy nút ngay bên dưới tin nhắn
    const buttonContainer = targetMessage.parentElement.parentElement.parentElement.parentElement.parentElement;

    // Chờ cho đến khi các nút có sẵn
    waitForButtons(buttonContainer, () => {
        const button = buttonContainer.querySelector('button');

        if (button) {
            button.click(); // Nhấn nút 'Read Aloud'
        }
    });
}

// Hàm chờ cho đến khi các nút có sẵn
function waitForButtons(container, callback) {
    const checkInterval = 100; // Thời gian kiểm tra (ms)

    const intervalId = setInterval(() => {
        const buttons = container.querySelectorAll('button');

        // Nếu các nút đã có sẵn, gọi callback và dừng kiểm tra
        if (buttons.length > 0) {
            clearInterval(intervalId);
            callback();
        }
    }, checkInterval);
}

// Tạo một MutationObserver để theo dõi sự thay đổi của DOM
const observer = new MutationObserver(mutationsList => {
    // Lấy số lượng thẻ <p> hiện tại
    const currentPCount = document.querySelectorAll('p').length;

    // So sánh số lượng thẻ <p> trước và sau khi thay đổi
    if (currentPCount > previousPCount) {
        clickReadAloudButton(); // Gọi hàm nhấn nút nếu số lượng thẻ <p> tăng lên
    }

    // Cập nhật số lượng thẻ <p> trước
    previousPCount = currentPCount;
});

// Cấu hình observer để theo dõi các thay đổi trong con của body
const config = { childList: true, subtree: true };

// Bắt đầu quan sát body
observer.observe(document.body, config);

// Lắng nghe tin nhắn từ phần mở rộng
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "pasteAndSend") {
        const chatInput = document.querySelector('textarea[id="prompt-textarea"]');
        const sendButton = document.querySelector('button[data-testid="send-button"]');

        if (chatInput && sendButton) {
            chatInput.value = `Dịch: ${request.text}`;
            
            // Gửi sự kiện input
            const inputEvent = new Event('input', { bubbles: true });
            chatInput.dispatchEvent(inputEvent);

            // Đợi một chút trước khi nhấn nút gửi
            setTimeout(() => {
                if (!sendButton.disabled) {
                    sendButton.click();
                } else {
                    console.log("Nút gửi vẫn bị vô hiệu hóa!");
                }
            }, 500); // Thay đổi thời gian nếu cần
        } else {
            console.log("Không tìm thấy phần tử ChatGPT!");
        }
    }
});
