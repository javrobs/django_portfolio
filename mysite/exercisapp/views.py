
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.middleware.csrf import get_token
from .models import Workout,Friends,Session
from django.contrib.auth.models import User
from django.db.models import Q

# Create your views here.
def main(request,*arg,**args):
    get_token(request)
    return render(request,"exercisapp/index.html")

def authenticated_view(request,*arg,**args):
    if request.user.is_authenticated:
        get_token(request)
        return render(request,"exercisapp/index.html")
    return redirect("/exercisapp/login")

def workout_view(request,workout_id):
    if request.user.is_authenticated:
        workout = Workout.filter(id=workout_id,created_by=request.user).first()
        if workout:
            get_token(request)
            return render(request,"exercisapp/index.html")
    return redirect("/exercisapp")

def workout_today(request,*arg,**args):
    if request.user.is_authenticated:
        session = Session.current_session(request.user)
        if session:
            return render(request,"exercisapp/index.html")
    return redirect("/exercisapp")
    
def profile_view(request,user_id):
    if request.user.is_authenticated:
        if Friends.are_friends(user_id,request.user.id):
            get_token(request)
            return render(request,"exercisapp/index.html")
    return redirect("/exercisapp")