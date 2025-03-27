
from django.http import JsonResponse
from django.shortcuts import render
from django.middleware.csrf import get_token

# Create your views here.
def main(request,*arg,**args):
    get_token(request)
    return render(request,"exercisapp/index.html")

