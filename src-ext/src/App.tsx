import React from 'react';

const App: React.FC = () => {
    const handleAutofill = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0].id) {
                chrome.tabs.sendMessage(tabs[0].id, { action: "autofillForm" }, (response) => {
                    if (chrome.runtime.lastError) {
                        console.error("Error sending message:", chrome.runtime.lastError.message);
                    } else if (response && response.status) {
                        console.log("Response status:", response.status);
                    } else {
                        console.error("No response or status received");
                    }
                });
            } else {
                console.error("No active tab found");
            }
        });
    };

    return (
        <div id="container">
            <h2>Resume Helper PRO</h2>
            <button onClick={handleAutofill}>Autofill Form</button>
        </div>
    );
};

export default App;