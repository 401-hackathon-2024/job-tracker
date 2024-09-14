from django.shortcuts import render
from django.http import HttpResponse
import json

# Create your views here.

def resume(request):
    return HttpResponse(json.dumps(""), content_type="application/json")
