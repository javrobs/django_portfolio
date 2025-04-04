from django.http import JsonResponse
import json
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate,login,logout
from django.db import transaction
from django.contrib.auth.models import User
from .models import Friends

# Create your views here.

def load_user(request):
    user = request.user
    if user.is_authenticated:
        return JsonResponse({"success":True,"logged_in":True,"superuser":user.is_superuser,"first_name":user.first_name,"last_name":user.last_name})
    return JsonResponse({"success":True,"logged_in":False})


@require_POST
def login_user(request):
    try:
        json_data = json.loads(request.body)
        if not User.objects.filter(username = json_data['username'].lower().strip()).exists():
            tag="username"
            raise Exception("The user was not found")
        user = authenticate(request, username = json_data['username'].lower().strip(), password = json_data['password'])
        if not user:
            tag="password"
            raise Exception("The password is incorrect")
        login(request,user)
        return JsonResponse({"success": True})
    except Exception as e:
        if tag:
            return JsonResponse({"tag": tag, "message": str(e)}, status=500)
        else:
            return JsonResponse({"message": str(e)}, status=500)

@require_POST
def signup(request):
    try:
        tag = False
        json_data = json.loads(request.body)
        with transaction.atomic():
            new_username = json_data["username"].lower().strip()
            if User.objects.filter(username = new_username).exists():
                tag = "username"
                raise Exception(f"This user already exists")
            user = User(username=new_username) 
            if len(json_data.get("password")) < 8:
                tag = "password"
                raise Exception(f"Too short")
            if len(json_data.get("password")) > 20:
                tag = "password"
                raise Exception(f"Too long")
            if json_data.get("password2") != json_data['password']:
                tag = "password2"
                raise Exception(f"Passwords don't match")
            user.set_password(json_data['password'])
            for key in ["first_name","last_name"]:
                name = json_data.get(key)
                if not name:
                    tag = key
                    raise Exception({f"Incomplete data"})
                name = name[0].upper()+name[1:].strip()
                setattr(user,key,name)
            user.save()
            return JsonResponse({'user_id': user.id})
    except Exception as e:
        if tag:
            return JsonResponse({"tag": tag, "message": str(e)}, status=500)
        else:
            return JsonResponse({"message": str(e)}, status=500)
    
@login_required
def logout_user(request):
    logout(request)
    return JsonResponse({"user_logged_out":request.user.is_authenticated})

@login_required
@require_POST
def respond_friendship(request):
    try:
        json_data = json.loads(request.body)
        friendship = Friends.objects.get(id=json_data["friendship"])
        if json_data["accept"]:
            friendship.status = True
            friendship.save()
        else:
            friendship.delete()
        return JsonResponse({})
    except Exception as e:
        print(e)
        return JsonResponse({"message": "Error"}, status=500)
        
@login_required
def request_friendship(request):
    tag = ""
    try:
        json_data = json.loads(request.body)
        username = json_data["username"].lower().strip()
        new_friend = User.objects.get(username=username)
        if Friends.are_friends(new_friend.id,request.user.id):
            tag = "friendSearch"
            raise Exception("You're already friends")
        other_friend_request = Friends.objects.filter(friend_1=new_friend,friend_2=request.user).first()
        if other_friend_request:
            tag = "friendSearch"
            raise Exception(f"Respond to {new_friend.first_name}'s friend request")
        Friends.objects.create(friend_2=new_friend,friend_1=request.user)
        return JsonResponse({"showMessage":f"A friend request was sent to {new_friend.get_full_name()} ({new_friend.username})"})
    except User.DoesNotExist:
        return JsonResponse({"tag":"friendSearch","message": "No match to the username"}, status=500)
    except Exception as e:
        if tag:
            return JsonResponse({"tag": tag, "message": str(e)}, status=500)
        else:
            return JsonResponse({"message": str(e)}, status=500)