from django.http import JsonResponse
from django.views.decorators.http import require_POST  
from django.db import transaction
from django.contrib.auth.decorators import login_required
from .models import Reps_and_weights,Session,Exercise,Exercise_in_program,Session_workout,Workout,Workouts_in_plan
from django.forms.models import model_to_dict
from json import loads as load
from .loaders import reps_weights as loader_reps_weights
from .loaders import workouts as loader_workouts

def reps_weights(request,order_id):
    try:
        json_data = load(request.body)
        print(json_data)
        
        with transaction.atomic():
            if json_data.get("session"):
                session = Session.objects.get(id=json_data.get("session"))
            else:
                current_workout = Workouts_in_plan.current_workout(request.user)
                session = Session(user=request.user,workout_performed=current_workout["workout"])
                session.save()
            session_workout,created = Session_workout.objects.get_or_create(exercise_id=json_data["exercise_id"],session=session)
            if json_data.get("units"):
                session_workout.units_kg = True if json_data.get("units") == "kgs" else False
                session_workout.save()
                return loader_reps_weights(request,order_id)
            if json_data.get("side"):
                session_workout.weight_per_side = True if json_data.get("side") == "perside" else False
                session_workout.save()
                return loader_reps_weights(request,order_id)
            record,created = Reps_and_weights.objects.get_or_create(
                set=json_data["set"],
                session_workout=session_workout
            )
            if json_data.get("weight") != None:
                record.weight = json_data.get("weight") or 0
            elif json_data.get("difficulty"):
                record.difficulty = json_data.get("difficulty")
            elif json_data.get("reps"):
                record.reps = json_data.get("reps")
            elif json_data.get("warmup"):
                record.is_warmup = record.is_warmup == False
                if record.is_warmup == False:
                    max_sets = Exercise_in_program.objects.filter(exercise_id=json_data["exercise_id"],workout=session.workout_performed).first().sets
                    print(max_sets)
                    rep_to_delete = Reps_and_weights.objects.filter(set__gt=max_sets,session_workout=session_workout).order_by("-set").first()
                    if rep_to_delete:
                        rep_to_delete.delete()
        record.save()
        return loader_reps_weights(request,order_id)
    except Exception as e:
        print(e)
        return JsonResponse({"message":str(e)},status=500)
    
@require_POST
@login_required
def create_workout(request,workout_id=None):
    try:
        tag = ""
        with transaction.atomic():
            json_data = load(request.body)
            if not json_data.get("exercises") or len(json_data["exercises"])== 0:
                tag="add_exercise"
                raise Exception("Add some exercises!")
            if not json_data.get("name") or len(json_data["name"]) < 1 or len(json_data["name"]) > 40:
                tag="name"
                raise Exception("Error in name")
            if workout_id:
                workout = Workout.objects.get(id=workout_id)
                if workout.created_by != request.user:
                    raise Exception("You can't edit this workout")
                workout.name = json_data["name"]
                workout.save()
            else:
                workout = Workout.objects.create(created_by=request.user,name=json_data["name"])
            workout.exercise_in_program_set.all().delete()
            for i,exercise in enumerate(json_data["exercises"]):
                workout.exercise_in_program_set.create(order=i+1,exercise_id=exercise["id"],sets=exercise["sets"])
            return JsonResponse(workout.get_default_dict())
    except Exception as e:
        print(e)
        return JsonResponse({"tag":tag,"message":str(e)},status=500)
    
@require_POST
@login_required
def edit_workouts(request,workout_id):
    try:
        with transaction.atomic():
            json_data = load(request.body)
            instruction = json_data["instruction"]
            workout = Workout.objects.get(id=workout_id)
            workouts_in_plan = request.user.workouts_in_plan_set
            if workout.created_by != request.user:
                raise Exception(f"This isn't yours.")
            if instruction=="add":
                count=workouts_in_plan.count()
                workouts_in_plan.create(workout=workout,order=count+1)
                return loader_workouts(request)
            this_workout_in_plan = workouts_in_plan.get(workout_id=workout_id)
            if instruction=="remove":
                this_workout_in_plan.delete()
            elif instruction in ["up","down"]:
                if instruction == "up":
                    switch_with=workouts_in_plan.filter(order__lt=this_workout_in_plan.order).order_by("-order").first()
                else:
                    switch_with=workouts_in_plan.filter(order__gt=this_workout_in_plan.order).order_by("order").first()
                that_order = switch_with.order
                switch_with.order = this_workout_in_plan.order
                this_workout_in_plan.order = that_order
                switch_with.save()
                this_workout_in_plan.save()
            for i,w in enumerate(workouts_in_plan.order_by("order").all()):
                w.order= i+1
                w.save()
            return loader_workouts(request)
        raise Exception(f"I can't {instruction}")
    except Exception as e:
        print(e)
        return JsonResponse({"message":str(e)},status=500)