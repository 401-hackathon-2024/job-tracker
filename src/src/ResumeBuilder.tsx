import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ResumeBuilder.css'; // Import the CSS file for additional styling

// Mock data for categories
const allHighlights = ['Graduated with Honors', 'Published Research Paper', 'Led Team Project', 'Volunteered at Non-Profit'];
const allWorkExperiences = ['Software Engineer at Company A', 'Intern at Company B', 'Freelancer', 'Research Assistant'];
const allSkills = ['JavaScript', 'React', 'Node.js', 'CSS'];
const allProjects = ['Portfolio Website', 'E-commerce App', 'Chat Application', 'Weather Dashboard'];

const ResumeBuilder = () => {
  const [selectedHighlights, setSelectedHighlights] = useState<string[]>([]);
  const [selectedWorkExperiences, setSelectedWorkExperiences] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const handleSelectionChange = (category: string, item: string, isChecked: boolean) => {
    let setSelected: React.Dispatch<React.SetStateAction<string[]>> | undefined;

    switch (category) {
      case 'highlights':
        setSelected = setSelectedHighlights;
        break;
      case 'workExperience':
        setSelected = setSelectedWorkExperiences;
        break;
      case 'skills':
        setSelected = setSelectedSkills;
        break;
      case 'projects':
        setSelected = setSelectedProjects;
        break;
      default:
        return; // Handle unexpected categories gracefully
    }

    if (setSelected) {
      setSelected(prev => {
        if (isChecked) {
          return [...prev, item];
        } else {
          return prev.filter(selectedItem => selectedItem !== item);
        }
      });
    }
  };

  const renderCheckboxes = (category: string, allItems: string[], selectedItems: string[]) => (
    <div className="checkbox-group">
      {allItems.map(item => (
        <label key={item} className="checkbox-label">
          <input
            type="checkbox"
            checked={selectedItems.includes(item)}
            onChange={(e) => handleSelectionChange(category, item, e.target.checked)}
          />
          {item}
        </label>
      ))}
    </div>
  );

  const handleSubmit = () => {
    const allSelected = [
      ...selectedHighlights,
      ...selectedWorkExperiences,
      ...selectedSkills,
      ...selectedProjects
    ].join(', ');

  };

  return (
    <div className="resume-builder-container">
      <header className="resume-builder-header">
        <Link to="/">
          <button className="home-button">Home</button>
        </Link>
        <h1 className="header-title">Resume Builder</h1>
      </header>
      <main>
        <section>
          <h2>Highlights</h2>
          {renderCheckboxes('highlights', allHighlights, selectedHighlights)}
        </section>
        <section>
          <h2>Work Experience</h2>
          {renderCheckboxes('workExperience', allWorkExperiences, selectedWorkExperiences)}
        </section>
        <section>
          <h2>Skills</h2>
          {renderCheckboxes('skills', allSkills, selectedSkills)}
        </section>
        <section>
          <h2>Projects</h2>
          {renderCheckboxes('projects', allProjects, selectedProjects)}
        </section>
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
      </main>
    </div>
  );
};

export default ResumeBuilder;
