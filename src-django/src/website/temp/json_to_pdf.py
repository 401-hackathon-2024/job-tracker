from fpdf import FPDF
import json


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


def json_to_pdf(json_data, output_pdf):
    pdf = PDF()
    pdf.set_auto_page_break(auto=True, margin=15)
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
    
    pdf.output(output_pdf)

# def read_json_file(json_file):
#     with open(json_file, "r") as file:
#         json_data = json.load(file)
#     return json_data


# def main():
#     input_json = "data.json"
#     output_pdf = "resume.pdf"
#     json_data = read_json_file(input_json)
#     json_to_pdf(json_data, output_pdf)