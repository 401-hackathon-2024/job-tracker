from django.http import HttpResponse
from fpdf import FPDF
import json

# Create your views here.

resumeResponse = {}
resumeResponse["firstName"] = "Janette"
resumeResponse["lastName"] = "Powell"
resumeResponse["email"] = "jan@stanford.edu"
resumeResponse["phone"] = "(650) 555-1234"
resumeResponse["presentAddress"] = "P.O. Box 2738, Stanford, CA 94309"
resumeResponse["city"] = "Stanford"
resumeResponse["zipCode"] = "94309"
resumeResponse["country"] = "United States"
resumeResponse["appliedPosition"] = "Software Engineer"
resumeResponse["earliestStartDate"] = "2024-09-01"
resumeResponse["coverLetter"] = "I am interested in this position becase ..."
resumeResponse["totalExperience"] = "3"
resumeResponse["linkedIn"] = "https://linkedin.com/in/janettecampbell"
resumeResponse["portfolio"] = "https://janetteportfolio.com"
resumeResponse["additionalInfo"] = "Proficient in Python, React, and machine learning."


class PDF(FPDF):
    def display_main_title(self):
        self.set_font('Arial', 'B', 16)
        self.cell(0, 10, "CURRICULUM VITAE", 0, 1, 'C')
    
    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', '', 8)
        self.cell(0, 10, 'Page %s' % self.page_no(), 0, 0, 'C')

    def chapter_title(self, title):
        self.ln(10)
        self.set_font('Arial', 'B', 12)
        self.cell(0, 10, title, 0, 1, 'L')

    def chapter_subtitle(self, subtitle):
        self.ln(1)
        self.set_font('Arial', 'B', 10)
        self.cell(0, 8, subtitle, 0, 1, 'L')

    def chapter_body(self, body):
        self.set_font('Arial', '', 10)
        self.multi_cell(0, 5, body)

def json_to_pdf(request):
    json_data = {
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
  
    # json_data = request
    # with open('resume.txt', 'w') as f:
    #     f.write(json_data)

    pdf = PDF()
    pdf.set_auto_page_break(auto = True, margin = 15)
    pdf.add_page()

    pdf.display_main_title()

    pdf.chapter_title("Personal Information")
    personal_info = json_data["personal_information"]
    for key, value in personal_info.items():
        if isinstance(value, dict):
            pdf.chapter_subtitle(f"{key.replace("_", " ").capitalize()}:")
            for sub_key, sub_value in value.items():
                pdf.chapter_body(f"{sub_key.replace("_", " ").capitalize()}: {sub_value}")
        else:
            pdf.chapter_body(f"{key.replace("_", " ").capitalize()}: {value}")

    pdf.chapter_title("Objective")
    pdf.chapter_body(json_data["objective"])

    pdf.chapter_title("Education")
    for education in json_data["education"]:
        pdf.chapter_subtitle(education["institution"])
        for key, value in education.items():
            if key != "institution":
                pdf.chapter_body(f"{key.replace('_', ' ').capitalize()}: {value}")
    
    pdf.chapter_title("Work Experience")
    for experience in json_data["work_experience"]:
        pdf.chapter_subtitle(f'{experience["job_title"]} at {experience["company"]}')
        for key, value in experience.items():
            if isinstance(value, list):
                pdf.chapter_body(f"{key.replace("_", " ").capitalize()}:")
                for item in value:
                    pdf.chapter_body(f"- {item}")
            else:
                pdf.chapter_body(f"{key.replace('_', ' ').capitalize()}: {value}")
    
    pdf.chapter_title("Skills")
    for skill in json_data["skills"]:
        pdf.chapter_body(f"- {skill}")

    pdf.chapter_title("Certifications")
    for cert in json_data["certifications"]:
        pdf.chapter_subtitle(cert["name"])
        pdf.chapter_body(f"Date Obtained: {cert['date_obtained']}")
    
    pdf.chapter_title("Projects")
    for project in json_data["projects"]:
        pdf.chapter_subtitle(project["name"])
        pdf.chapter_body(f"Description: {project['description']}")
        pdf.chapter_body(f"URL: {project['url']}")

    pdf.chapter_title("Languages")
    for language in json_data["languages"]:
        pdf.chapter_body(f"- {language}")

    pdf.chapter_title("References")
    for reference in json_data["references"]:
        pdf.chapter_subtitle(reference["name"])
        for key, value in reference.items():
            if key != "name":
                pdf.chapter_body(f"{key.replace("_", " ").capitalize()}: {value}")
    
    return HttpResponse(pdf.output(dest='S').encode('latin-1'), content_type='application/pdf')


def resume(request):
    return HttpResponse(json.dumps(resumeResponse),
                        content_type="application/json")
