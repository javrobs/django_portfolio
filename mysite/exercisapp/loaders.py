from django.http import JsonResponse
from .models import Session_workout,Workout,Exercise,Workouts_in_plan,Session,Friends
from django.forms.models import model_to_dict
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

def home(request):
    if request.user.is_authenticated:
        if request.user.workouts_in_plan_set.exists():
            current_workout = Workouts_in_plan.current_workout(request.user)
            current_session = Session.current_session(request.user)
            exercises = [{"id":e.exercise.id,
                            "order":e.order,
                            "name":e.exercise.name,
                            "sets":e.sets,
                            "completed":e.completed_sets(current_session)}
                            for e in current_workout.exercise_in_program_set.order_by("order").all()]
            result = {"name":current_workout.name,"exercises":exercises}
            if current_session:
                result["session"] = model_to_dict(current_session)
            return JsonResponse(result)
    return JsonResponse({})

@login_required
def workouts(request): 
    workouts = [{"id":w.workout.id,"active":True,"name":w.workout.name,"muscles":w.workout.get_muscles()} for w in request.user.workouts_in_plan_set.order_by("order").all()]
    print(workouts)
    workouts += [{"id":w.id,"active":False,"name":w.name,"muscles":w.get_muscles()} for w in Workout.objects.exclude(workouts_in_plan__user=request.user).filter(created_by=request.user)]
    print(workouts)
    return JsonResponse({"my_workouts":workouts})

@login_required
def create_workout(request,workout_id=None):
    result = {}
    if workout_id:
        workout = Workout.objects.get(id=workout_id)
        if workout.created_by != request.user:
            raise Exception("You can't edit this workout")
        result["current_state"] = workout.get_default_dict()
    result["exercises"] = [{"id":e.id,"name":e.name,"muscles":list(e.muscle_group.values_list("name",flat=True))} for e in Exercise.objects.all()]
    return JsonResponse(result)

@login_required
def workout_details(request,workout_id):
    workout = Workout.objects.get(id=workout_id)
    if workout.created_by == request.user or (Friends.are_friends(workout.created_by.id,request.user.id) and workout.workouts_in_plan_set.exists()):
        result = {"name":workout.name}
        result["exercises"]=[f"{w2.exercise.name} x {w2.sets}" for w2 in workout.exercise_in_program_set.order_by("order").all()]
        return JsonResponse(result)

@login_required
def reps_weights(request,order_id):
    try:
        result={}
        session = Session.current_session(request.user)
        if not session:
            raise Exception("Session not found")
        current_workout = session.workout_performed
        exercise_in_program = current_workout.exercise_in_program_set.get(order=order_id)
        result["name"] = exercise_in_program.exercise.name
        result["description"] = exercise_in_program.exercise.description
        result["exercise_id"] = exercise_in_program.exercise.id
        result["uses_bar"] = exercise_in_program.exercise.uses_bar
        result["sets"] = exercise_in_program.sets
        find_notes = exercise_in_program.exercise.user_notes_set.filter(user=request.user).first()
        result["user_notes"] = find_notes.description if find_notes else ""
        result["rep_range"] = [exercise_in_program.exercise.lower_reps,exercise_in_program.exercise.higher_reps]
        result["session"] = session.id
        find_session_workout = Session_workout.objects.filter(exercise__exercise_in_program=exercise_in_program, session=session).first()
        if find_session_workout:
            find_last_workout = Session_workout.objects.filter(exercise__exercise_in_program=exercise_in_program, session__user=request.user).exclude(id=find_session_workout.id).order_by("-session__created_at").first()
            result["lastState"] = find_last_workout.get_session_reps()[0] if find_last_workout else {}
            result["currentState"],result["workout_session_info"] = find_session_workout.get_session_reps()
        else:
            result["currentState"] = {}
            find_last_workout = Session_workout.objects.filter(exercise__exercise_in_program=exercise_in_program, session__user=request.user).order_by("-session__created_at").first()
            result["lastState"],result["workout_session_info"] = find_last_workout.get_session_reps() if find_last_workout else [{},{}]
        print(find_last_workout)
        result["next"] = session.next(order_id)
        return JsonResponse(result)
    except Exception as e:
        print(e)
        return JsonResponse({"message":str(e)},status=500)
    
@login_required
def friends(request):
    result={}
    result['friendRequests']=[{"username":e.friend_1.username, "name":e.friend_1.get_full_name(),"id":e.id} for e in request.user.friend_receiver.filter(status=False).all()]
    result['currentFriends']=[{"username":e.username, "name":e.get_full_name(), "id_friend":e.id} for e in Friends.friends_of(request.user)]
    return JsonResponse(result)


@login_required
def my_profile(request):
    if request.user.is_authenticated:
        return profile(request,request.user.id)

@login_required
def profile(request,profile_id):
    if request.user.is_authenticated:
        result = {}
        if request.user.id == profile_id or Friends.are_friends(profile_id,request.user.id):
            user = User.objects.get(id=profile_id)
            result["name"] = [user.first_name,user.last_name]
            last_workout = user.session_set.order_by("-created_at").first()
            if last_workout:
                result["last_workout"] = last_workout.created_at.strftime("%B, %d").replace(", 0",", ")
            result["current_routine"] = [{"id":w.workout.id,"active":True,"name":w.workout.name,"muscles":w.workout.get_muscles()} for w in user.workouts_in_plan_set.order_by("order").all()]
            result["finished_workouts"] = user.session_set.count()
            result["myself"] = request.user.id == profile_id
            return JsonResponse(result)
        else:
            return JsonResponse({"message":"Access denied"},status=500)