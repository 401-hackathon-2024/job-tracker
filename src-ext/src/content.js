// Function to fetch resume data from a URL
async function fetchResumeData(url) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ request: 'resumeData' })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching resume data:', error);
      return null;
    }
  }
  
  // Function to autofill the form
  async function autofillForm() {
    console.log("Autofill form function called");
    const resumeData = await fetchResumeData('http://localhost:8000/resume');
    if (!resumeData) return;
  
    console.log("Resume data fetched:", resumeData);
  
    // Select the input fields and assign values
    const firstNameField = document.querySelector('input[name="names[first_name]"]');
    if (firstNameField) firstNameField.value = resumeData.firstName;
  
    const lastNameField = document.querySelector('input[name="names[last_name]"]');
    if (lastNameField) lastNameField.value = resumeData.lastName;
  
    const emailField = document.querySelector('input[name="email"]');
    if (emailField) emailField.value = resumeData.email;
  
    const phoneField = document.querySelector('input[name="phone"]');
    if (phoneField) phoneField.value = resumeData.phone;
  
    console.log("Form autofilled");
  }
  
  // Listen for messages from the popup script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received in content script:", request);
    if (request.action === "autofillForm") {
      autofillForm().then(() => {
        sendResponse({ status: "form autofilled" });
      }).catch(error => {
        console.error('Error autofilling form:', error);
        sendResponse({ status: "error", message: error.message });
      });
      return true; // Will respond asynchronously
    }
  });