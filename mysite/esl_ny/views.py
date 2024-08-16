from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def main(request):
    """Can you see me?"""
    # return HttpResponse('<a href="//www.google.com">Hello</a>')
    return render(request,"esl_ny/main.html",{})