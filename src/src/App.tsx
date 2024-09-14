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
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [profileData, setProfileData] = useState({
    highlights: [''],
    workExperience: [{
      job_title: '',
      company: '',
      location: '',
      start_date: '',
      end_date: '',
      responsibilities: ['']
    }],
    projects: [''],
    skills: [{
      programming: '',
      web_development: '',
      databases: '',
      tools: '',
    }]
  });
  const [errors, setErrors] = useState({
    highlights: '',
    workExperience: '',
    projects: '',
    skills: ''
  });

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

  const handleInputChange = (section: string, index: number, value: string, field?: string) => {
    setProfileData(prev => {
      if (section === 'workExperience') {
        const updatedWorkExperience = [...prev.workExperience];
        if (field === 'responsibilities') {
          updatedWorkExperience[index] = {
            ...updatedWorkExperience[index],
            responsibilities: [value]  // Update this as an array, you can adjust if multiple items are needed.
          };
        } else {
          updatedWorkExperience[index] = {
            ...updatedWorkExperience[index],
            [field]: value
          };
        }
        return { ...prev, workExperience: updatedWorkExperience };
      } else {
        const updatedSection = [...prev[section]];
        updatedSection[index] = value;
        return { ...prev, [section]: updatedSection };
      }
    });
  };
  

  const handleFieldSubmit = async (section: string) => {
    const fieldData = profileData[section];
    const fieldErrors = { ...errors };

    if (section === 'workExperience') {
      if (fieldData.some(exp => Object.values(exp).some(item => typeof item === 'string' && item.trim() === ''))) {
        fieldErrors[section] = 'Some fields in work experience are empty.';
        setErrors(fieldErrors);
        return;
      }
    } else if (fieldData.some(item => item.trim() === '')) {
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
        [section]: section === 'workExperience'
          ? [{ job_title: '', company: '', location: '', start_date: '', end_date: '', responsibilities: [''] }]
          : [''] // Reset field
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

      {isPopupOpen && (
        <div className="popup-overlay">
          <div className="popup">
            <button className="close-button" onClick={handlePopupClose}>X</button>

            <Link to="/resume-builder">
              <button className="resume-builder-button">
                Resume Builder
              </button>
            </Link>

            <h2>Profile</h2>
            {['highlights', 'projects'].map(section => (
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

            <div className="section">
              <h2>SKILLS</h2>
              {profileData.skills.map((skills, index) => (
                <div key={index}>
                  <div className="input-group">
                    <input
                      type="text"
                      value={skills.programming}
                      onChange={(e) => handleInputChange('skills', index, e.target.value, 'programming')}
                      placeholder="Programming Skills"
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      value={skills.web_development}
                      onChange={(e) => handleInputChange('skills', index, e.target.value, 'web_development')}
                      placeholder="Web Development Skills"
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      value={skills.databases}
                      onChange={(e) => handleInputChange('skills', index, e.target.value, 'databases')}
                      placeholder="Database Skills"
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      value={skills.tools}
                      onChange={(e) => handleInputChange('skills', index, e.target.value, 'tools')}
                      placeholder="Tool Skills"
                    />
                  </div>
                </div>
              ))}
              {errors.workExperience && <p className="error-message">{errors.skills}</p>}
              <button className="submit-button" onClick={() => handleFieldSubmit('skills')}>Submit Skills</button>
            </div>


            <div className="section">
              <h3>WORK EXPERIENCE</h3>
              {profileData.workExperience.map((experience, index) => (
                <div key={index}>
                  <div className="input-group">
                    <input
                      type="text"
                      value={experience.job_title}
                      onChange={(e) => handleInputChange('workExperience', index, e.target.value, 'job_title')}
                      placeholder="Job Title"
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      value={experience.company}
                      onChange={(e) => handleInputChange('workExperience', index, e.target.value, 'company')}
                      placeholder="Company"
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      value={experience.location}
                      onChange={(e) => handleInputChange('workExperience', index, e.target.value, 'location')}
                      placeholder="Location"
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="date"
                      value={experience.start_date}
                      onChange={(e) => handleInputChange('workExperience', index, e.target.value, 'start_date')}
                      placeholder="Start Date"
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="date"
                      value={experience.end_date}
                      onChange={(e) => handleInputChange('workExperience', index, e.target.value, 'end_date')}
                      placeholder="End Date"
                    />
                  </div>
                  <div className="input-work-responsibilities">
                    <textarea
                      value={experience.responsibilities[0] || ''}  // Use the first item for simplicity.
                      onChange={(e) => handleInputChange('workExperience', index, e.target.value, 'responsibilities')}
                      placeholder="Responsibilities"
                    />
                  </div>
                </div>
              ))}
              {errors.workExperience && <p className="error-message">{errors.workExperience}</p>}
              <button className="submit-button" onClick={() => handleFieldSubmit('workExperience')}>Submit Work Experience</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
