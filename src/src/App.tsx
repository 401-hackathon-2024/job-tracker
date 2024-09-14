import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';

function App() {
  const [count, setCount] = useState(0)
  invokePython();

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

async function invokePython() {
  await axios.post('http://localhost:5000/run-python-code', {
    "personal_information": {
      "first_name": "Qwe",
      "last_name": "Rty",
      "phone_number": "+1 012 345 6789",
      "email": "ua@ualberta.ca",
      "address": {
        "street": "123 Main Street",
        "city": "Edmonton",
        "province": "Alberta",
        "postal_code": "Q1Q 1Q1",
        "country": "Canada"
      },
      "linkedin": "https://www.linkedin.com/",
      "website": "https://www.ualberta.ca/"
    },
    "objective": "To obtain a software engineering position where I can leverage my coding skills and experience in developing scalable applications.",
    "education": [
      {
        "institution": "University of Alberta",
        "degree": "Bachelor of Science in Computer Science",
        "start_date": "2077-09-01",
        "end_date": "2081-06-30",
        "gpa": "4.01/4.0"
      }
    ],
    "work_experience": [
      {
        "job_title": "Software Engineer",
        "company": "1234567 Tech",
        "location": "Edmonton, Alberta",
        "start_date": "2088-07-01",
        "end_date": "Present",
        "responsibilities": [
          "Developed web applications using JavaScript, React, and Node.js",
          "Collaborated with cross-functional teams to design and implement new features",
          "Performed code reviews and optimized application performance"
        ]
      },
      {
        "job_title": "Software Engineering Intern",
        "company": "890JQKA Tech",
        "location": "Edmonton, Alberta",
        "start_date": "2080-05-01",
        "end_date": "2081-08-31",
        "responsibilities": [
          "Assisted in the development of internal tools for data analysis",
          "Tested and debugged software to ensure functionality",
          "Wrote documentation for software processes and workflows"
        ]
      }
    ],
    "skills": [
      "Programming: JavaScript, Python, C++",
      "Web Development: HTML, CSS, React, Node.js",
      "Databases: MySQL, MongoDB",
      "Tools: Git, Docker, Jenkins"
    ],
    "certifications": [
      {
        "name": "UofA Certified Solutions Architect",
        "date_obtained": "2079-03-01"
      }
    ],
    "projects": [
      {
        "name": "Personal Portfolio Website",
        "description": "Designed and developed a personal portfolio website to showcase projects and blog posts using React and CSS.",
        "url": "https://www.ualberta.ca/"
      },
      {
        "name": "Web App",
        "description": "Developed a full-stack application using Node.js, Express, and MongoDB.",
        "url": "https://github.com/"
      }
    ],
    "languages": [
      "English (Native)",
      "French (Intermediate)"
    ],
    "references": [
      {
        "name": "POI UYT",
        "title": "Senior Software Engineer",
        "company": "1234567 Tech",
        "email": "1234567@1234567.com",
        "phone": "+1 123 456 7890"
      }
    ]
  }
  );
}

export default App
