import React from 'react';

const App: React.FC = () => {
    const handleAutofill = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.tabs.sendMessage(tabs[0].id!, { action: "autofillForm" }, (response) => {
                console.log(response.status);
            });
        });
    };

    return (<div id="container">
    <h2>Auto Job Application Filler</h2>

    {/* Dropdown List should have the autofill profiles */}
    <select id="dropdown" defaultValue="">
        <option value="" disabled>Select Your Resume</option>

    </select>

    {/* Buttons */}
    <div id="button-container" style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
        <button
            onClick={handleAutofill}
            style={{ backgroundColor: '#81d4fa', border: 'none', padding: '10px 20px', cursor: 'pointer' }}
        >
            Autofill Form
        </button>
        <button
            onClick={handleAutofill}
            style={{ backgroundColor: '#81d4fa', border: 'none', padding: '10px 20px', cursor: 'pointer' }}
        >
            Download Resume
        </button>
    </div>
</div>
);
};

export default App;