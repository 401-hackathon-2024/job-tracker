import React from 'react';

const App: React.FC = () => {
    const handleAutofill = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id!, { action: "autofillForm" }, (response) => {
                console.log(response.status);
            });
        });
    };

    return (
        <div id="container">
            <h2>Auto Job Application Filler</h2>
            <button onClick={handleAutofill}>Autofill Form</button>
        </div>
    );
};

export default App;