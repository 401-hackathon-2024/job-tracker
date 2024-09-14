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
    workExperience: [{
      job_title: '',
      company: '',
      location: '',
      start_date: '',
      end_date: '',
      responsibilities: ['']
    }],
    projects: [{
      name: '',
      description: '',
      url: ''
    }],
    skills: [{
      programming: '',
      web_development: '',
      databases: '',
      tools: '',
    }],
    certifications: [{
      name: '',
      date_obtained: ''
    }],
    languages: [''],
    references: [{
      name: '',
      title: '',
      company: '',
      email: '',
      phone: ''
    }],
    education: [{
      institution: '',
      degree: '',
      start_date: '',
      end_date: '',
      gpa: ''
    }]
  });
  
  const [errors, setErrors] = useState({
    highlights: '',
    workExperience: '',
    projects: '',
    skills: '',
    certifications: '',
    languages: '',
    references: ''
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

  const handleInputChange = (section: string, index: number, value: string, field?: string) => {
    setProfileData(prev => {
      if (section === 'workExperience') {
        const updatedWorkExperience = [...prev.workExperience];
        if (field === 'responsibilities') {
          updatedWorkExperience[index] = {
            ...updatedWorkExperience[index],
            responsibilities: [value]
          };
        } else {
          updatedWorkExperience[index] = {
            ...updatedWorkExperience[index],
            [field]: value
          };
        }
        return { ...prev, workExperience: updatedWorkExperience };
      } else if (section === 'projects' || section === 'certifications' || section === 'references' || section === 'education') {
        const updatedSection = [...prev[section]];
        updatedSection[index] = {
          ...updatedSection[index],
          [field]: value
        };
        return { ...prev, [section]: updatedSection };
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
    } else if (section === 'certifications' || section === 'references' || section === 'education') {
      if (fieldData.some(item => Object.values(item).some(val => val.trim() === ''))) {
        fieldErrors[section] = 'Some fields are empty.';
        setErrors(fieldErrors);
        return;
      }
    } else if (section === 'projects') {
      if (fieldData.some(project => Object.values(project).some(val => val.trim() === ''))) {
        fieldErrors[section] = 'Some fields in projects are empty.';
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

      setProfileData(prev => ({
        ...prev,
        [section]: section === 'workExperience'
          ? [{ job_title: '', company: '', location: '', start_date: '', end_date: '', responsibilities: [''] }]
          : section === 'certifications'
            ? [{ name: '', date_obtained: '' }]
            : section === 'references'
              ? [{ name: '', title: '', company: '', email: '', phone: '' }]
              : section === 'projects'
                ? [{ name: '', description: '', url: '' }]
                : section === 'education'
                  ? [{ institution: '', degree: '', start_date: '', end_date: '', gpa: '' }]
                  : [''] // Reset other fields
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
            {['highlights'].map(section => (
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
              <h4>EDUCATION</h4>
              {profileData.education.map((education, index) => (
                <div key={index}>
                  <div className="input-group">
                    <input
                      type="text"
                      value={education.institution}
                      onChange={(e) => handleInputChange('education', index, e.target.value, 'institution')}
                      placeholder="Institution"
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      value={education.degree}
                      onChange={(e) => handleInputChange('education', index, e.target.value, 'degree')}
                      placeholder="Degree"
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="date"
                      value={education.start_date}
                      onChange={(e) => handleInputChange('education', index, e.target.value, 'start_date')}
                      placeholder="Start Date"
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="date"
                      value={education.end_date}
                      onChange={(e) => handleInputChange('education', index, e.target.value, 'end_date')}
                      placeholder="End Date"
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      value={education.gpa}
                      onChange={(e) => handleInputChange('education', index, e.target.value, 'gpa')}
                      placeholder="GPA"
                    />
                  </div>
                </div>
              ))}
              {errors.education && <p className="error-message">{errors.education}</p>}
              <button className="submit-button" onClick={() => handleFieldSubmit('education')}>Submit Education</button>
            </div>


            <div className="section">
              <h3>PROJECTS</h3>
              {profileData.projects.map((project, index) => (
                <div key={index}>
                  <div className="input-group">
                    <input
                      type="text"
                      value={project.name}
                      onChange={(e) => handleInputChange('projects', index, e.target.value, 'name')}
                      placeholder="Project Name"
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      value={project.description}
                      onChange={(e) => handleInputChange('projects', index, e.target.value, 'description')}
                      placeholder="Project Description"
                    />
                  </div>
                  <div className="input-group">
                    <input
                      type="text"
                      value={project.url}
                      onChange={(e) => handleInputChange('projects', index, e.target.value, 'url')}
                      placeholder="Project URL"
                    />
                  </div>
                </div>
              ))}
              {errors.projects && <p className="error-message">{errors.projects}</p>}
              <button className="submit-button" onClick={() => handleFieldSubmit('projects')}>Submit Projects</button>
            </div>

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

            {/* Certifications Section */}
<div className="section">
  <h2>CERTIFICATIONS</h2>
  {profileData.certifications.map((certification, index) => (
    <div key={index}>
      <div className="input-group">
        <input
          type="text"
          value={certification.name}
          onChange={(e) => handleInputChange('certifications', index, e.target.value, 'name')}
          placeholder="Certification Name"
        />
      </div>
      <div className="input-group">
        <input
          type="date"
          value={certification.date_obtained}
          onChange={(e) => handleInputChange('certifications', index, e.target.value, 'date_obtained')}
          placeholder="Date Obtained"
        />
      </div>
    </div>
  ))}
  {errors.certifications && <p className="error-message">{errors.certifications}</p>}
  <button className="submit-button" onClick={() => handleFieldSubmit('certifications')}>Submit Certifications</button>
</div>

{/* Languages Section */}
<div className="section">
  <h2>LANGUAGES</h2>
  {profileData.languages.map((language, index) => (
    <div key={index} className="input-group">
      <input
        type="text"
        value={language}
        onChange={(e) => handleInputChange('languages', index, e.target.value)}
        placeholder="Language"
      />
    </div>
  ))}
  {errors.languages && <p className="error-message">{errors.languages}</p>}
  <button className="submit-button" onClick={() => handleFieldSubmit('languages')}>Submit Languages</button>
</div>

{/* References Section */}
<div className="section">
  <h2>REFERENCES</h2>
  {profileData.references.map((reference, index) => (
    <div key={index}>
      <div className="input-group">
        <input
          type="text"
          value={reference.name}
          onChange={(e) => handleInputChange('references', index, e.target.value, 'name')}
          placeholder="Reference Name"
        />
      </div>
      <div className="input-group">
        <input
          type="text"
          value={reference.title}
          onChange={(e) => handleInputChange('references', index, e.target.value, 'title')}
          placeholder="Reference Title"
        />
      </div>
      <div className="input-group">
        <input
          type="text"
          value={reference.company}
          onChange={(e) => handleInputChange('references', index, e.target.value, 'company')}
          placeholder="Reference Company"
        />
      </div>
      <div className="input-group">
        <input
          type="email"
          value={reference.email}
          onChange={(e) => handleInputChange('references', index, e.target.value, 'email')}
          placeholder="Reference Email"
        />
      </div>
      <div className="input-group">
        <input
          type="tel"
          value={reference.phone}
          onChange={(e) => handleInputChange('references', index, e.target.value, 'phone')}
          placeholder="Reference Phone"
        />
      </div>
    </div>
  ))}
  {errors.references && <p className="error-message">{errors.references}</p>}
  <button className="submit-button" onClick={() => handleFieldSubmit('references')}>Submit References</button>
</div>
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
