import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import { fetchJobs, submitProfile, Job } from './services/api';
import ResumeBuilder from './ResumeBuilder';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
      </Routes>
    </Router>
  );
}

function MainPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [isUserInfoPopupOpen, setIsUserInfoPopupOpen] = useState(false); // State for user info popup
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

  // Hardcoded user information
  const userInfo = {
    first_name: 'Qwe',
    last_name: 'Rty',
    phone_number: '+1 012 345 6789',
    email: 'ua@ualberta.ca',
    address: {
      street: '123 Main Street',
      city: 'Edmonton',
      province: 'Alberta',
      postal_code: 'Q1Q 1Q1',
      country: 'Canada'
    },
    linkedin: 'https://www.linkedin.com/',
    website: 'https://www.ualberta.ca/'
  };

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
    setIsProfilePopupOpen(true);
  };

  const handleProfilePopupClose = () => {
    setIsProfilePopupOpen(false);
  };

  const handleUserInfoButtonClick = () => {
    setIsUserInfoPopupOpen(true);
  };

  const handleUserInfoPopupClose = () => {
    setIsUserInfoPopupOpen(false);
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

      setProfileData(prev => ({
        ...prev,
        [section]: [''] // Reset field
      }));
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while submitting the profile data.');
    }
  };

  return (
    <>
      <header>
        <h1>Job Tracker</h1>
        <div className="header-buttons">
          <Link to="/resume-builder">
            <button className="resume-builder-button">Resume Builder</button>
          </Link>
          <button className="profile-button" onClick={handleProfileButtonClick}>Profile</button>
          <button className="user-info-button" onClick={handleUserInfoButtonClick}>Show User Info</button>
        </div>
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

      {isProfilePopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-button" onClick={handleProfilePopupClose}>X</button>
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

      {isUserInfoPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-button" onClick={handleUserInfoPopupClose}>X</button>
            <h2>User Information</h2>
            <p><strong>First Name:</strong> {userInfo.first_name}</p>
            <p><strong>Last Name:</strong> {userInfo.last_name}</p>
            <p><strong>Phone Number:</strong> {userInfo.phone_number}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <p><strong>Address:</strong> {userInfo.address.street}, {userInfo.address.city}, {userInfo.address.province}, {userInfo.address.postal_code}, {userInfo.address.country}</p>
            <p><strong>LinkedIn:</strong> <a href={userInfo.linkedin} target="_blank" rel="noopener noreferrer">{userInfo.linkedin}</a></p>
            <p><strong>Website:</strong> <a href={userInfo.website} target="_blank" rel="noopener noreferrer">{userInfo.website}</a></p>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
