from django.http import HttpResponse
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
resumeResponse[
    "additionalInfo"] = "Proficient in Python, React, and machine learning."


def resume(request):
    return HttpResponse(json.dumps(resumeResponse),
                        content_type="application/json")
