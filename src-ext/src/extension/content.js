// Sample data to autofill the form
const resumeData = {
    firstName: "Janette",
    lastName: "Powell",
    email: "jan@stanford.edu",
    phone: "(650) 555-1234",
    presentAddress: "P.O. Box 2738, Stanford, CA 94309",
    city: "Stanford",
    zipCode: "94309",
    country: "United States",
    appliedPosition: "Software Engineer",
    earliestStartDate: "2024-09-01",
    coverLetter: "I am interested in this position because...",
    totalExperience: "3",
    linkedIn: "https://linkedin.com/in/janettecampbell",
    portfolio: "https://janetteportfolio.com",
    additionalInfo: "Proficient in Python, React, and machine learning."
};

// Function to autofill the form
function autofillForm() {
    // Select the input fields and assign values
    const firstNameField = document.querySelector('input[name="names[first_name]"]');
    if (firstNameField) firstNameField.value = resumeData.firstName;

    const lastNameField = document.querySelector('input[name="names[last_name]"]');
    if (lastNameField) lastNameField.value = resumeData.lastName;

    const emailField = document.querySelector('input[name="email"]');
    if (emailField) emailField.value = resumeData.email;

    const phoneField = document.querySelector('input[name="phone"]');
    if (phoneField) phoneField.value = resumeData.phone;

    const addressField = document.querySelector('input[name="address_1[address_line_1]"]');
    if (addressField) addressField.value = resumeData.presentAddress;

    const cityField = document.querySelector('input[name="address_1[city]"]');
    if (cityField) cityField.value = resumeData.city;

    const zipField = document.querySelector('input[name="address_1[zip]"]');
    if (zipField) zipField.value = resumeData.zipCode;

    // Handle the country dropdown
    const countrySelect = document.querySelector('select[name="address_1[country]"]');
    if (countrySelect) {
        Array.from(countrySelect.options).forEach(option => {
            if (option.text.includes(resumeData.country)) {
                option.selected = true;
            }
        });
    }

    // Applied position
    const appliedPositionField = document.querySelector('input[name="applied-position"]');
    if (appliedPositionField) appliedPositionField.value = resumeData.appliedPosition;

    // Earliest start date
    const startDateField = document.querySelector('input[name="datetime_1"]');
    if (startDateField) startDateField.value = resumeData.earliestStartDate;

    // Cover letter
    const coverLetterField = document.querySelector('textarea[name="description_3"]');
    if (coverLetterField) coverLetterField.value = resumeData.coverLetter;

    // Total experience
    const experienceField = document.querySelector('input[name="numeric-field"]');
    if (experienceField) experienceField.value = resumeData.totalExperience;

    // LinkedIn ID
    const linkedInField = document.querySelector('input[name="url"]');
    if (linkedInField) linkedInField.value = resumeData.linkedIn;

    // Portfolio
    const portfolioField = document.querySelector('input[name="url"]');
    if (portfolioField) portfolioField.value = resumeData.portfolio;

    // Additional info
    const additionalInfoField = document.querySelector('textarea[name="description"]');
    if (additionalInfoField) additionalInfoField.value = resumeData.additionalInfo;
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "autofillForm") {
        autofillForm();
        sendResponse({ status: "form autofilled" });
    }
});