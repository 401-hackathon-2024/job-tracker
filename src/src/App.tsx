import { useState, useEffect } from 'react';
import './App.css';
import { fetchJobs, submitProfile, Job } from './services/api';
import ResumeBuilder from './ResumeBuilder'; // Import ResumeBuilder component

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [navigateToResumeBuilder, setNavigateToResumeBuilder] = useState(false); // To track navigation
  const [profileData, setProfileData] = useState({
    highlights: [''],
    workExperience: [''],
    projects: [''],
    skills: ['']
  });
  const [errors, setErrors] = useState({
    highlights: '',
    workExperience: '',
    projects: '',
    skills: ''
  });

  // Fetch jobs when the component mounts
  useEffect(() => {
    const getJobs = async () => {
      const jobsFromApi = await fetchJobs();
      setJobs(jobsFromApi);
    };
    getJobs();
  }, []);

  const filteredJobs = jobs.filter(job =>
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProfileButtonClick = () => {
    setIsPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const handleInputChange = (section: string, index: number, value: string) => {
    setProfileData(prev => {
      const updatedSection = [...prev[section]];
      updatedSection[index] = value;
      return { ...prev, [section]: updatedSection };
    });
  };

  const handleFieldSubmit = async (section: string) => {
    const fieldData = profileData[section];
    const fieldErrors = { ...errors };

    // Validate the specific field
    if (fieldData.some(item => item.trim() === '')) {
      fieldErrors[section] = 'Field is empty.';
      setErrors(fieldErrors);
      return;
    }

    fieldErrors[section] = ''; // Clear error if valid
    setErrors(fieldErrors);

    try {
      await submitProfile({ [section]: fieldData });
      alert(`${section} data submitted successfully!`);

      // Clear the specific field
      setProfileData(prev => ({
        ...prev,
        [section]: [''] // Reset field
      }));
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting the profile data.');
    }
  };

  const handleResumeBuilderRedirect = () => {
    setNavigateToResumeBuilder(true); // Set navigation state to true
  };

  // If "navigateToResumeBuilder" is true, render the ResumeBuilder component
  if (navigateToResumeBuilder) {
    return <ResumeBuilder />;
  }

  return (
    <>
      <header>
        <h1>Job Tracker</h1>
        <button className="profile-button" onClick={handleProfileButtonClick}>Profile</button>
      </header>

      <main>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className="job-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Position</th>
              <th>Status</th>
              <th>Time Passed</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => (
                <tr key={index}>
                  <td>{job.company}</td>
                  <td>{job.position}</td>
                  <td>{job.status}</td>
                  <td>{job.timePassed}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="no-jobs">No jobs found</td>
              </tr>
            )}
          </tbody>
        </table>
      </main>

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-button" onClick={handlePopupClose}>X</button>

            {/* Add Resume Builder Button */}
            <button className="resume-builder-button" onClick={handleResumeBuilderRedirect}>
              Resume Builder
            </button>

            <h2>Profile</h2>
            {['highlights', 'workExperience', 'projects', 'skills'].map(section => (
              <div key={section} className="section">
                <h3>{section.replace(/([A-Z])/g, ' $1').toUpperCase()}</h3>
                {profileData[section].map((item, index) => (
                  <div key={index} className="input-group">
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleInputChange(section, index, e.target.value)}
                      placeholder={`Enter ${section} `}
                    />
                  </div>
                ))}
                {errors[section] && <p className="error-message">{errors[section]}</p>}
                <button className="submit-button" onClick={() => handleFieldSubmit(section)}>Submit {section}</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default App;
