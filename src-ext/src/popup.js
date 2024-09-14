// Attach click event to the button
document.getElementById('autofillButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "autofillForm" }, (response) => {
            console.log(response.status);
        });
    });
});