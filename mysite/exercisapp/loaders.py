from django.http import JsonResponse
from .models import Reps_and_weights,Session_workout,Workout,Exercise,Workouts_in_plan
from django.forms.models import model_to_dict
from django.db.models import Count,F,Q,Value
from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth.decorators import login_required

def home(request):
    if request.user.is_authenticated:
        if request.user.workouts_in_plan_set.exists():
            current_workout = Workouts_in_plan.current_workout(request.user)
            print(current_workout)
            exercises = [{"id":e.exercise.id,"order":e.order,"name":e.exercise.name,"sets":e.sets,"completed":e.completed_sets(current_workout.get("session")) if current_workout.get("session") else 0} for e in current_workout["workout"].exercise_in_program_set.order_by("order").all()]
            result = {"name":current_workout["workout"].name,"exercises":exercises}
        return JsonResponse(result)
    return JsonResponse({})

@login_required
def workouts(request):
    workouts = [{"id":w.workout.id,"active":True,"name":w.workout.name,"muscles":w.workout.get_muscles()} for w in request.user.workouts_in_plan_set.order_by("order").all()]
    workouts += [{"id":w.id,"active":False,"name":w.name,"muscles":w.get_muscles()} for w in Workout.objects.filter(~Q(workouts_in_plan__user=request.user)&Q(created_by=request.user))]
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
    result = {"name":workout.name}
    result["exercises"]=[f"{w2.exercise.name} x {w2.sets}" for w2 in workout.exercise_in_program_set.order_by("order").all()]
    return JsonResponse(result)

@login_required
def reps_weights(request,order_id):
    result={}
    current_workout = Workouts_in_plan.current_workout(request.user)
    exercise_in_program = current_workout["workout"].exercise_in_program_set.get(order=order_id)
    result["name"] = exercise_in_program.exercise.name
    result["exercise_id"] = exercise_in_program.exercise.id
    result["uses_bar"] = exercise_in_program.exercise.uses_bar
    result["sets"] = exercise_in_program.sets
    result["rep_range"] = [exercise_in_program.exercise.lower_reps,exercise_in_program.exercise.higher_reps]
    session = current_workout.get("session")
    if session:
        result["session"] = current_workout["session"].id
        find_session_workout = Session_workout.objects.filter(exercise_id=result["exercise_id"],session_id=result["session"]).first()
        result["id"] = getattr(find_session_workout,"id") if find_session_workout else ""
        print("session",model_to_dict(current_workout["session"]))
    result["uses_kilos"] = find_session_workout.units_kg if session and find_session_workout else False
    result["per_side"] = find_session_workout.weight_per_side if session and find_session_workout else False
    print("workouts",list(current_workout["workout"].exercise_in_program_set.order_by("order").values()))
    # result["next"] = list(session
    #     .session_workout_set
    #     .annotate(count_reps_done=Count("reps_and_weights",filter=Q(reps_and_weights__is_warmup=False)),
    #             sets_required = Q(session__workout_performed__exercise_in_program__exercise=F("session__")))
    #     .exclude(id=result["id"])
    #     .values()) if session else current_workout["workout"].exercise_in_program_set.exclude(order=order_id).order_by("order")[0].order
    result["next"] = session.next(order_id) if session else current_workout["workout"].exercise_in_program_set.exclude(order=order_id).order_by("order")[0].order
    result["currentState"] = {int(e.set):{
            "weight":float(e.weight or 0),
            "difficulty":int(e.difficulty or 0),
            "reps":int(e.reps or 0),
            "warmup":e.is_warmup} for 
                e in Reps_and_weights.objects.filter(session_workout = result["id"]).all()
        } if result.get("id") else {}
    return JsonResponse(result)
    