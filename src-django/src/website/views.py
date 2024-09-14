from django.http import HttpResponse
from .models import *
import json

# Create your views here.


def resume(request):
    if request.method == 'GET':
        first = "bob"
        last = "bob"
        email = "bob@bob.com"
        currentRef = None
        currentUser = None
        currentResume = None
        currentAddress = None
        currentEducation = None
        currentWork = None
        currentSkill = None
        currentProject = None
        currentLang = None
        for user in User.objects.values():
            if first == user['first_name'] and last == user[
                    'last_name'] and email == user['email']:
                currentUser = user['id']
        for resume in Resume.objects.values():
            if resume['user_id'] == currentUser:
                currentResume = resume
        for address in Address.objects.values():
            if address['resume_id'] == currentResume['id'] and address[
                    'user_id'] == currentUser:
                currentAddress = address
        for education in Education.objects.values():
            if education['user_id'] == currentUser and education[
                    'resume_id'] == currentResume['id']:
                currentEducation = education
        for work in Experience.objects.values():
            if work['user_id'] == currentUser and work['resume_id'] == resume[
                    'id']:
                currentWork = work
        for skill in Skill.objects.values():
            if skill['user_id'] == currentUser and skill[
                    'resume_id'] == resume['id']:
                currentSkill = skill
        for project in Project.objects.values():
            if project['user_id'] == currentUser and project[
                    'resume_id'] == resume['id']:
                currentProject = project
        for lang in Language.objects.values():
            if lang['user_id'] == currentUser and lang['resume_id'] == resume[
                    'id']:
                currentLang = lang
        for ref in Reference.objects.values():
            if ref['user_id'] == currentUser and ref['resume_id'] == resume[
                    'id']:
                currentRef = ref
        return HttpResponse(json.dumps({
            "personal_information": {
                "first_name": first,
                "last_name": last,
                "phone_number": resume['phone'],
                "email": email,
                "address": {
                    'street': currentAddress['street'],
                    'city': currentAddress['city'],
                    'province': currentAddress['province'],
                    'postal_code': currentAddress['postal_code'],
                    'country': currentAddress['country']
                },
                "linkedin": "www.linkedin.in",
                "website": "www.github.com",
            },
            "objective":
            "To get a job to leverage my skills.",
            "education:": [{
                'institution': currentEducation['institution'],
                'degree': currentEducation['degree'],
                'start_date': currentEducation['start_date'],
                'end_date': currentEducation['end_date'],
                'gpa': currentEducation['gpa']
            }],
            'work_experience': [{
                'job_title': currentWork['job_title'],
                'company': currentWork['company'],
                'start_date': currentWork['start_date'],
                'end_date': currentWork['end_date'],
                'location': 'San Francisco',
                'responsibilities': 'Code Monkey'
            }],
            'skills': [currentSkill],
            'projects': [{
                'name': currentProject['name'],
                'description': currentProject['description'],
                'url': currentProject['link']
            }],
            'languages': [currentLang],
            'references': [{
                'name': currentRef['reference'],
                'title': 'Senior Developer',
                'company': 'Apple',
                'email': 'rob@apple.com',
                'phone': '123 456 7890'
            }]
        }),
                            content_type='application/json')
